import datetime
import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import User, InboxItem
from tasks.models import Project, Task


class Command(BaseCommand):
    help = "Seeds a realistic 1-month history demo account for user 'shady' in BOCHA Workspace."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding 1-month demo account for 'shady' in BOCHA Workspace..."))

        shady_email = "shady@bocha.app"
        shady_username = "shady"
        shady_password = "shady1234"

        # 1. Clean up existing shady user if exists
        User.objects.filter(email=shady_email).delete()
        User.objects.filter(username=shady_username).delete()

        # 2. Create User shady
        user = User.objects.create_user(
            email=shady_email,
            username=shady_username,
            first_name="Shady",
            last_name="El-Sayed",
            password=shady_password,
            preferred_language="en",
            preferred_theme="dark",
            bio=(
                "Creative Director and Project Manager. "
                "I rely on BOCHA Workspace to track my daily rendering pipelines and team tasks."
            ),
        )
        self.stdout.write(self.style.SUCCESS(f"Created user: {user.first_name} (@{user.username}) - {user.email}"))

        now = timezone.now()
        today = now.date()

        # 3. Create 3 Projects
        p1 = Project.objects.create(
            user=user,
            title="BOCHA Brand Identity & 3D Assets",
            category="Design",
            description="Overhaul visual language, high-resolution 3D glassmorphic elements, and comprehensive style guide.",
            due_date=today + datetime.timedelta(days=14),
        )

        p2 = Project.objects.create(
            user=user,
            title="Unreal Engine 5 Realtime Pipeline",
            category="VFX & Tech",
            description="Develop automated scene assembly, Nanite geometry optimizations, and custom Lumen shader graphs.",
            due_date=today + datetime.timedelta(days=30),
        )

        p3 = Project.objects.create(
            user=user,
            title="Commercial TVC Campaign Delivery",
            category="Production",
            description="Final ACES color grading, surround sound sync, and multi-format ProRes master exports.",
            due_date=today + datetime.timedelta(days=7),
        )
        self.stdout.write(self.style.SUCCESS(f"Created 3 projects: '{p1.title}', '{p2.title}', '{p3.title}'"))

        # 4. Generate 30+ Tasks spread across the last 30 days
        # Define realistic tasks: older ones are done, recent ones in_progress, upcoming ones todo
        historical_tasks = [
            # Week 1 (25-30 days ago) - Done
            {"title": "Initial creative brief & storyboard alignment with agency", "project": p1, "days_ago": 29, "status": "done", "priority": "high"},
            {"title": "Moodboard curation: Neo-brutalist typography & warm palettes", "project": p1, "days_ago": 28, "status": "done", "priority": "medium"},
            {"title": "Hardware benchmark: RTX 4090 vs dual A6000 rendering speed", "project": p2, "days_ago": 27, "status": "done", "priority": "medium"},
            {"title": "Set up Perforce version control repository for UE 5.4 project", "project": p2, "days_ago": 26, "status": "done", "priority": "high"},
            {"title": "Client kickoff call: Timeline & delivery milestones confirmation", "project": p3, "days_ago": 25, "status": "done", "priority": "urgent"},
            
            # Week 2 (18-24 days ago) - Done
            {"title": "Draft 3D abstract letter 'B' geometric concepts in Blender", "project": p1, "days_ago": 23, "status": "done", "priority": "high"},
            {"title": "Material shaders test: Frosted glass, rose gold & warm amber", "project": p1, "days_ago": 22, "status": "done", "priority": "medium"},
            {"title": "Ingest and organize raw Alexa 35 footage (OpenEXR ACEScg)", "project": p3, "days_ago": 21, "status": "done", "priority": "high"},
            {"title": "Offline edit assembly in DaVinci Resolve (Cut 01)", "project": p3, "days_ago": 20, "status": "done", "priority": "urgent"},
            {"title": "Test USD asset pipeline from Maya to Unreal Engine", "project": p2, "days_ago": 19, "status": "done", "priority": "medium"},
            {"title": "Configure OCIO color management in Unreal Engine 5", "project": p2, "days_ago": 18, "status": "done", "priority": "high"},

            # Week 3 (11-17 days ago) - Done
            {"title": "Present 3D logo iterations to executive stakeholders", "project": p1, "days_ago": 16, "status": "done", "priority": "urgent"},
            {"title": "Export vector logo guidelines (SVG, EPS, high-res PNGs)", "project": p1, "days_ago": 15, "status": "done", "priority": "medium"},
            {"title": "Build modular environment kits with Nanite mesh LODs", "project": p2, "days_ago": 14, "status": "done", "priority": "high"},
            {"title": "Lighting study: Golden hour sunset simulation with Lumen", "project": p2, "days_ago": 13, "status": "done", "priority": "medium"},
            {"title": "Client review of TVC Rough Cut - Incorporate director notes", "project": p3, "days_ago": 12, "status": "done", "priority": "urgent"},
            {"title": "Audio stems prep: Dialogue clean-up and foley layering", "project": p3, "days_ago": 11, "status": "done", "priority": "medium"},

            # Week 4 (6-10 days ago) - Done
            {"title": "Design social media banners and avatar branding kit", "project": p1, "days_ago": 10, "status": "done", "priority": "low"},
            {"title": "Automate Movie Render Queue output via Python script", "project": p2, "days_ago": 9, "status": "done", "priority": "high"},
            {"title": "Optimize VRAM memory footprint for 4K real-time playback", "project": p2, "days_ago": 8, "status": "done", "priority": "medium"},
            {"title": "VFX cleanup: Wire removal & screen replacements (Scene 03)", "project": p3, "days_ago": 7, "status": "done", "priority": "high"},
            {"title": "Color grade lock: Conform REC.709 and HDR10 PQ passes", "project": p3, "days_ago": 6, "status": "done", "priority": "urgent"},

            # Recent Days (1-5 days ago) - In Progress
            {"title": "Finalize brand design manual typography & component specs", "project": p1, "days_ago": 5, "status": "in_progress", "priority": "high"},
            {"title": "Render high-res key visual poster for global brand launch", "project": p1, "days_ago": 4, "status": "in_progress", "priority": "urgent"},
            {"title": "Assemble hero cinematic sequence in Unreal Sequencer", "project": p2, "days_ago": 4, "status": "in_progress", "priority": "high"},
            {"title": "Calibrate volumetric fog and subsurface scattering shaders", "project": p2, "days_ago": 3, "status": "in_progress", "priority": "medium"},
            {"title": "Dolby Atmos 5.1 / 7.1 surround mix balance with sound studio", "project": p3, "days_ago": 2, "status": "in_progress", "priority": "urgent"},
            {"title": "QC inspection: Artifact check on 4K 10-bit ProRes 4444 XQ", "project": p3, "days_ago": 1, "status": "in_progress", "priority": "high"},
            {"title": "Setup BOCHA workspace dashboard custom analytics widgets", "project": None, "days_ago": 1, "status": "in_progress", "priority": "medium"},

            # Upcoming / Current - To Do
            {"title": "Publish brand guidelines portal to web domain", "project": p1, "days_ago": 0, "status": "todo", "priority": "medium"},
            {"title": "Deliver final commercial TVC broadcast package to networks", "project": p3, "days_ago": 0, "status": "todo", "priority": "urgent"},
            {"title": "Package UE5 master project and archive source assets to LTO tape", "project": p2, "days_ago": 0, "status": "todo", "priority": "medium"},
            {"title": "Conduct sprint retrospective with 3D animation lead", "project": None, "days_ago": 0, "status": "todo", "priority": "low"},
            {"title": "Prepare Q1 2027 visual effects pipeline roadmap & R&D budget", "project": p2, "days_ago": 0, "status": "todo", "priority": "high"},
            {"title": "Sign off client handover certificates and contract completion", "project": p3, "days_ago": 0, "status": "todo", "priority": "medium"},
        ]

        created_tasks_count = 0
        for item in historical_tasks:
            days_ago = item["days_ago"]
            created_dt = now - datetime.timedelta(
                days=days_ago,
                hours=random.randint(1, 10),
                minutes=random.randint(5, 55),
            )
            
            # Calculate due date
            if item["status"] == "done":
                due_dt = created_dt + datetime.timedelta(days=random.randint(1, 4))
            elif item["status"] == "in_progress":
                due_dt = now + datetime.timedelta(days=random.randint(1, 3))
            else:
                due_dt = now + datetime.timedelta(days=random.randint(3, 10))

            task = Task.objects.create(
                user=user,
                project=item["project"],
                title=item["title"],
                priority=item["priority"],
                status=item["status"],
                completed=(item["status"] == "done"),
                due_date=due_dt,
            )
            # Update created_at directly to bypass auto_now_add
            Task.objects.filter(id=task.id).update(created_at=created_dt)
            created_tasks_count += 1

        self.stdout.write(self.style.SUCCESS(f"Created {created_tasks_count} tasks spread across the last 30 days."))

        # 5. Create 3 Inbox Items
        inbox_items = [
            "Review draft color grade for scene 04 rendering delivery",
            "Confirm Maya to UE5 live link plugin licensing and workstations",
            "Organize sprint retrospective with the animation lead",
        ]
        for text in inbox_items:
            InboxItem.objects.create(
                user=user,
                text=text,
                is_processed=False,
            )
        self.stdout.write(self.style.SUCCESS(f"Created {len(inbox_items)} GTD inbox items."))

        # Compute summary stats
        done_count = sum(1 for t in historical_tasks if t["status"] == "done")
        prog_count = sum(1 for t in historical_tasks if t["status"] == "in_progress")
        todo_count = sum(1 for t in historical_tasks if t["status"] == "todo")
        rate = round((done_count / created_tasks_count) * 100, 1)

        self.stdout.write(
            self.style.SUCCESS(
                f"\n"
                f"==========================================================\n"
                f"[SUCCESS] Shady 1-Month Demo Seeded Successfully!\n"
                f"==========================================================\n"
                f"User Credentials:\n"
                f"  Name:       {user.first_name} {user.last_name}\n"
                f"  Email:      {shady_email}\n"
                f"  Username:   {shady_username}\n"
                f"  Password:   {shady_password}\n"
                f"----------------------------------------------------------\n"
                f"Statistics Generated:\n"
                f"  Total Tasks:      {created_tasks_count}\n"
                f"  Done (Completed): {done_count}\n"
                f"  In Progress:      {prog_count}\n"
                f"  To Do:            {todo_count}\n"
                f"  Completion Rate:  {rate}%\n"
                f"  Projects:         3\n"
                f"==========================================================\n"
            )
        )
