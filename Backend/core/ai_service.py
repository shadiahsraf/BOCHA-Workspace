import os
import random
import asyncio
import logging
from typing import List, Dict, Any, Optional
from datetime import date
from django.conf import settings
from django.utils import timezone
from asgiref.sync import sync_to_async

# Allow Django ORM access within async contexts safely
os.environ.setdefault("DJANGO_ALLOW_ASYNC_UNSAFE", "true")

import google.generativeai as genai
from google.api_core.exceptions import (
    NotFound,
    ResourceExhausted,
    ServiceUnavailable,
    GoogleAPICallError,
)

from core.models import User, InboxItem
from tasks.models import Task, Project
from notes.models import Note

logger = logging.getLogger(__name__)


# ==============================================================================
# 1. (IBM Topic 8): Exponential Backoff Async Wrapper
# ==============================================================================
async def safe_gemini_call_async(func, *args, max_retries: int = 3, initial_delay: float = 2.0, backoff_factor: float = 2.0, **kwargs):
    """
    Executes an asynchronous Gemini API call with exponential backoff and jitter
    to handle HTTP 429 (ResourceExhausted) and HTTP 503 (ServiceUnavailable).
    """
    delay = initial_delay
    last_exception = None

    for attempt in range(max_retries + 1):
        try:
            return await func(*args, **kwargs)
        except (ResourceExhausted, ServiceUnavailable) as e:
            last_exception = e
            err_msg = str(e).lower()
            # If daily quota limit is reached, backoff won't help; re-raise immediately for candidate fallback
            if "per day" in err_msg or "daily" in err_msg or "quota" in err_msg:
                logger.warning(f"[AI Service] Quota exhausted: {e}. Skipping retries for this model.")
                raise
            if attempt == max_retries:
                logger.error(f"[AI Service] Gemini call failed after {max_retries} retries: {e}")
                raise
            jitter = random.uniform(0.1, 1.0)
            sleep_duration = delay + jitter
            logger.warning(
                f"[AI Service] Rate limited or service unavailable ({e.__class__.__name__}). "
                f"Retrying in {sleep_duration:.2f}s (Attempt {attempt + 1}/{max_retries})..."
            )
            await asyncio.sleep(sleep_duration)
            delay *= backoff_factor
        except Exception as e:
            # Non-retryable error
            logger.error(f"[AI Service] Non-retryable error during Gemini call: {e}")
            raise

    if last_exception:
        raise last_exception


# ==============================================================================
# 2. (IBM Topic 4): Tenant-Scoped LifeOS Toolbox
# ==============================================================================
class LifeOSToolbox:
    """
    Toolbox exposing Python callable methods to Gemini Function Calling.
    All operations are strictly scoped to the authenticated user instance.
    """

    def __init__(self, user: User):
        self.user = user

    def get_pending_tasks(self) -> str:
        """Retrieves up to 15 pending (uncompleted) tasks for the user, including priority, project, and due date.
        Returns:
            A formatted summary string of the user's pending tasks.
        """
        tasks = Task.objects.filter(user=self.user, completed=False).select_related('project').order_by('due_date', 'priority')[:15]
        if not tasks.exists():
            return "No pending tasks found. The user's task list is clear!"

        lines = ["Current Pending Tasks:"]
        for t in tasks:
            proj_name = t.project.title if t.project else "No project"
            due_str = t.due_date.strftime("%Y-%m-%d") if t.due_date else "No due date"
            lines.append(f"- [ID:{t.id}] {t.title} (Priority: {t.priority}, Project: {proj_name}, Due: {due_str})")
        return "\n".join(lines)

    def create_task(self, title: str, priority: str = "medium", due_date: Optional[str] = None) -> str:
        """Creates a new task in LifeOS for the user.
        Args:
            title: The task title.
            priority: Priority level ('urgent', 'high', 'medium', or 'low'). Defaults to 'medium'.
            due_date: Optional due date string in YYYY-MM-DD format (e.g. '2026-11-15').
        Returns:
            Confirmation message indicating task creation.
        """
        valid_priorities = ['urgent', 'high', 'medium', 'low']
        clean_priority = priority.lower() if priority and priority.lower() in valid_priorities else 'medium'

        parsed_date = None
        if due_date:
            try:
                parts = [int(p) for p in due_date.split('-')]
                if len(parts) == 3:
                    import datetime
                    dt = datetime.datetime(parts[0], parts[1], parts[2], 12, 0, 0)
                    parsed_date = timezone.make_aware(dt) if timezone.is_naive(dt) else dt
            except Exception:
                parsed_date = None

        task = Task.objects.create(
            user=self.user,
            title=title.strip(),
            priority=clean_priority,
            due_date=parsed_date,
        )
        due_info = f" with due date {parsed_date}" if parsed_date else ""
        return f"Task created successfully: '{task.title}' (ID: {task.id}, Priority: {clean_priority}{due_info})."

    def capture_inbox_item(self, text: str) -> str:
        """Captures a quick thought or raw idea into the user's GTD Inbox for later processing.
        Args:
            text: The raw thought, idea, or fleeting task to record.
        Returns:
            Confirmation message.
        """
        item = InboxItem.objects.create(
            user=self.user,
            text=text.strip(),
        )
        return f"Captured in Inbox: '{item.text}' (ID: {item.id})."

    def get_projects(self) -> str:
        """Lists active projects with their completion progress and due dates.
        Returns:
            A formatted summary string of the user's projects.
        """
        projects = Project.objects.filter(user=self.user).order_by('-created_at')[:10]
        if not projects.exists():
            return "No projects found in the workspace."

        lines = ["Active Projects:"]
        for p in projects:
            due_str = p.due_date.strftime("%Y-%m-%d") if p.due_date else "No deadline"
            lines.append(f"- [ID:{p.id}] {p.title} (Category: {p.category}, Progress: {p.progress}%, Due: {due_str})")
        return "\n".join(lines)

    def create_note(self, title: str, content: str = "", category: str = "General") -> str:
        """Creates a documentation or idea note in LifeOS.
        Args:
            title: Title of the note.
            content: Note content or details.
            category: Category name (e.g. 'General', 'Work', 'Personal').
        Returns:
            Confirmation message.
        """
        note = Note.objects.create(
            user=self.user,
            title=title.strip(),
            content=content.strip(),
            category=category.strip(),
        )
        return f"Note created: '{note.title}' (ID: {note.id}, Category: {note.category})."

    def web_search(self, query: str) -> str:
        """Searches the live web for accurate, real-time external information to prevent hallucination.
        Args:
            query: The search terms or question to look up on the web.
        Returns:
            A formatted summary of top search results including Title, Body snippet, and Source URL.
        """
        try:
            try:
                from ddgs import DDGS
            except ImportError:
                from duckduckgo_search import DDGS

            results = list(DDGS().text(query.strip(), max_results=3))
            if not results:
                return f"No web search results found for: '{query}'."

            formatted = [f"Web Search Results for '{query}':"]
            for i, res in enumerate(results, 1):
                title = res.get('title', 'No Title')
                body = res.get('body', '')
                href = res.get('href', '')
                formatted.append(f"{i}. [{title}]({href})\nSnippet: {body}\nSource: {href}")

            return "\n\n".join(formatted)
        except Exception as e:
            logger.warning(f"[AI Service] Web search failed for query '{query}': {e}")
            return f"Search failed: {str(e)}"


# ==============================================================================
# 3. (IBM Topic 5): Asynchronous Agentic Chat
# ==============================================================================
async def chat_with_agent_async(user: User, message: str, history: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
    """
    Communicates asynchronously with Gemini using Function Calling tools
    bound to the authenticated user.
    """
    api_key = getattr(settings, 'GEMINI_API_KEY', '') or os.environ.get('GEMINI_API_KEY', '')
    if not api_key:
        return {
            "reply": (
                "⚠️ Gemini API key is not configured. "
                "Please configure GEMINI_API_KEY in your backend environment to enable live AI capabilities."
            )
        }

    genai.configure(api_key=api_key)

    toolbox = LifeOSToolbox(user)
    tools = [
        toolbox.get_pending_tasks,
        toolbox.create_task,
        toolbox.capture_inbox_item,
        toolbox.get_projects,
        toolbox.create_note,
        toolbox.web_search,
    ]

    bio_context = f"\nUser Bio / Resume / Working Style:\n{user.bio}\n" if getattr(user, 'bio', None) else ""

    system_instruction = (
        f"You are the BOCHA Workspace internal AI. You are a Planner and an Executor for {user.username}. "
        f"The user's preferred language is '{user.preferred_language}'. "
        f"{bio_context}"
        "Tailor your plans and advice based on the user's bio/resume. "
        "When asked to plan a project, break it down and proactively use your tools (like create_task) to add those tasks to the database. "
        "You have direct access to database tools to manage tasks, active projects, inbox items, and notes. "
        "Whenever the user asks to create, retrieve, or manage their tasks, inbox, or projects, "
        "USE THE APPROPRIATE TOOL IMMEDIATELY. "
        "You are also a Strict Web Researcher. When asked for external information, documentation, news, or technical references, "
        "you MUST use the web_search tool. "
        "ZERO HALLUCINATION POLICY: You must ONLY use the facts provided by the search tool results. NEVER make up information. "
        "ALWAYS append the exact source URL (href) at the end of your points. "
        "Respond clearly and concisely in GitHub-flavored markdown. "
        "If the user speaks in Arabic or has preferred_language 'ar', respond in fluent Arabic."
    )

    configured_model = getattr(settings, 'GEMINI_MODEL', '') or os.environ.get('GEMINI_MODEL', '')
    candidates = [
        m for m in [
            configured_model,
            'gemini-1.5-flash',
            'gemini-1.5-flash-8b',
            'gemini-3.5-flash-lite',
            'gemini-flash-latest',
            'gemini-3.5-flash',
            'gemini-3.8-flash',
        ] if m
    ]
    # Deduplicate while preserving order
    candidates = list(dict.fromkeys(candidates))

    last_error = None
    for model_name in candidates:
        try:
            logger.info(f"[AI Service] Initializing GenerativeModel with '{model_name}'...")
            model = genai.GenerativeModel(
                model_name=model_name,
                tools=tools,
                system_instruction=system_instruction,
            )

            formatted_history = []
            if history:
                for item in history:
                    role = item.get('role', 'user')
                    gemini_role = 'model' if role in ['assistant', 'model'] else 'user'
                    parts = item.get('parts') or [item.get('content', '')]
                    formatted_history.append({'role': gemini_role, 'parts': parts})

            chat = model.start_chat(
                enable_automatic_function_calling=True,
                history=formatted_history,
            )

            # Call asynchronously with exponential backoff
            response = await safe_gemini_call_async(chat.send_message_async, message)
            try:
                reply_text = response.text if response and hasattr(response, 'text') else ""
            except Exception:
                reply_text = ""

            if not reply_text and hasattr(response, 'candidates') and response.candidates:
                first_cand = response.candidates[0]
                if hasattr(first_cand, 'content') and hasattr(first_cand.content, 'parts'):
                    part_texts = [p.text for p in first_cand.content.parts if hasattr(p, 'text') and p.text]
                    reply_text = " ".join(part_texts)

            if not reply_text:
                reply_text = "Action completed successfully."

            return {"reply": reply_text}
        except Exception as e:
            logger.warning(f"[AI Service] Model '{model_name}' failed ({e.__class__.__name__}: {e}). Trying next candidate...")
            last_error = e
            continue

    logger.error(f"[AI Service] Error during agent chat after trying candidates: {last_error}", exc_info=True)
    return {
        "reply": f"An error occurred while communicating with the AI service: {str(last_error)}"
    }


# ==============================================================================
# 4. (IBM Topic 9): 5-Pillar Persona Prompt Generator
# ==============================================================================
def generate_5_pillar_persona(user: User) -> Dict[str, Any]:
    """
    Generates a comprehensive Markdown system prompt adhering strictly to the 5-Pillar Framework:
    (1) Instructions, (2) Context [Live DB Data], (3) Examples, (4) Constraints, (5) Output Format.
    """
    projects = list(Project.objects.filter(user=user).order_by('-created_at')[:10])
    pending_tasks = list(Task.objects.filter(user=user, completed=False).select_related('project').order_by('due_date', 'priority')[:15])
    inbox_items = list(InboxItem.objects.filter(user=user, is_processed=False).order_by('-created_at')[:10])
    notes = list(Note.objects.filter(user=user).order_by('-updated_at')[:5])

    # Context Formatting
    projects_md = []
    if projects:
        for p in projects:
            due = p.due_date.strftime("%Y-%m-%d") if p.due_date else "No deadline"
            projects_md.append(f"- **{p.title}** ({p.category}) — Progress: {p.progress}% | Deadline: {due}")
    else:
        projects_md.append("- No active projects currently recorded.")

    tasks_md = []
    if pending_tasks:
        for t in pending_tasks:
            proj = t.project.title if t.project else "General"
            due = t.due_date.strftime("%Y-%m-%d") if t.due_date else "No due date"
            tasks_md.append(f"- [ ] **{t.title}** (Priority: `{t.priority}`, Project: {proj}, Due: {due})")
    else:
        tasks_md.append("- All tasks completed! No open items.")

    inbox_md = []
    if inbox_items:
        for item in inbox_items:
            inbox_md.append(f"- *\"{item.text}\"* (Captured: {item.created_at.strftime('%Y-%m-%d')})")
    else:
        inbox_md.append("- Inbox Zero. No raw thoughts pending triage.")

    notes_md = []
    if notes:
        for n in notes:
            notes_md.append(f"- **{n.title}** ({n.category}): {n.snippet}")
    else:
        notes_md.append("- No recent notes.")

    lang_display = "Arabic (العربية)" if user.preferred_language == 'ar' else "English"

    markdown_prompt = f"""# SYSTEM PROMPT: Personal LifeOS Executive Assistant & Strategist

## 1. INSTRUCTIONS & ROLE
You are the dedicated AI Executive Assistant and Personal Strategist for **{user.username}** within their LifeOS personal productivity operating system.
Your mission is to help {user.username} achieve clarity, prioritize high-impact deliverables, maintain momentum across active projects, and process raw thoughts from their inbox.
Act with high agency, proactive structure, and encouraging professionalism.

## 2. CONTEXT (WORKSPACE STATE)
The following is an authenticated, real-time snapshot of {user.username}'s LifeOS database:

### User Profile & Preferences
- **Username:** {user.username}
- **Email:** {user.email}
- **Primary Language:** {lang_display}
- **Preferred Interface Theme:** {user.preferred_theme}
- **Bio / Resume / Working Style:** {user.bio if getattr(user, 'bio', None) else 'Not provided'}

### Active Projects ({len(projects)})
{chr(10).join(projects_md)}

### Open & Pending Tasks ({len(pending_tasks)})
{chr(10).join(tasks_md)}

### Unprocessed GTD Inbox Thoughts ({len(inbox_items)})
{chr(10).join(inbox_md)}

### Recent Notes & Knowledge Docs ({len(notes)})
{chr(10).join(notes_md)}

## 3. EXAMPLES & INTERACTION PATTERNS

### Example 1: Morning Focus Briefing
**User:** *"What should I focus on today?"*
**Assistant:**
> "Good morning, {user.username}! Here is your high-leverage agenda for today:
> 1. 🔴 **Urgent Action:** [Top urgent task from pending list]
> 2. 🟡 **Project Momentum:** Advance **[Active Project]** towards its next milestone.
> 3. 💡 **Triage:** You have {len(inbox_items)} raw thoughts in your inbox waiting for quick review."

### Example 2: Triaging an Inbox Thought
**User:** *"I have a raw thought in my inbox about redesigning the landing page."*
**Assistant:**
> "Let's turn that raw thought into actionable execution:
> - **Proposed Category:** Project or Task
> - **Actionable Checklist:**
>   - [ ] Audit top 3 competitor landing pages
>   - [ ] Draft copy wireframe in LifeOS Notes
> Would you like me to schedule these as new tasks?"

## 4. CONSTRAINTS & PRINCIPLES
- **Language Matching:** When speaking in Arabic or when user specifies Arabic, converse in fluent, native Arabic.
- **Truthfulness & Data Anchoring:** Reference only the actual projects, tasks, and notes listed in the Context above. Never invent phantom deadlines or unassigned items.
- **Executive Conciseness:** Provide actionable, high-signal responses without unnecessary boilerplate or preamble.
- **Cognitive Load Reduction:** Limit daily recommendations to 3–5 items to prevent overwhelm.

## 5. OUTPUT FORMAT
- Format all responses using structured GitHub-flavored Markdown.
- Use checkboxes (`- [ ]`) for executable task items.
- Bold project names, priority levels, and target dates.
- Keep briefings scannable with clear headings and bulleted tiers.
"""

    return {
        "persona_prompt": markdown_prompt,
        "stats": {
            "projects_count": len(projects),
            "pending_tasks_count": len(pending_tasks),
            "inbox_items_count": len(inbox_items),
            "notes_count": len(notes),
        },
    }
