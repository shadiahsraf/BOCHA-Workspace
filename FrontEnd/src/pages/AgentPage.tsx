import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  Copy,
  Check,
  Layers,
  CheckSquare,
  Inbox,
  BookOpen,
  Trash2,
} from 'lucide-react';
import { useAgent } from '@/hooks/useAgent';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const STARTER_PROMPTS = [
  'What are my priorities today?',
  'Show my active projects and progress',
  'Add a task: Review Q4 strategy with high priority',
  'Capture thought: Research new AI agents architecture',
];

export function AgentPage() {
  const user = useAuthStore((s) => s.user);
  const {
    messages,
    isSending,
    isGeneratingPersona,
    personaData,
    sendMessage,
    generatePersona,
    clearMessages,
  } = useAgent();

  const [inputVal, setInputVal] = useState('');
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const text = inputVal.trim();
    if (!text || isSending) return;

    setInputVal('');
    await sendMessage(text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpenPersona = async () => {
    try {
      await generatePersona();
      setIsPersonaModalOpen(true);
      setCopied(false);
    } catch {
      // Error handled by hook
    }
  };

  const handleCopyPersona = async () => {
    if (!personaData?.persona_prompt) return;
    try {
      await navigator.clipboard.writeText(personaData.persona_prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-5xl mx-auto py-2">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/80 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span>AI Assistant</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Agentic coordinator powered by Gemini with full database tool execution and context.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearMessages}
            className="text-xs gap-1.5 shadow-xs"
            title="Reset Chat"
          >
            <Trash2 className="h-3.5 w-3.5 text-text-secondary" />
            <span className="hidden sm:inline">Clear Chat</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenPersona}
            disabled={isGeneratingPersona}
            className="gap-2 text-xs font-semibold shadow-xs"
          >
            {isGeneratingPersona ? (
              <>
                <Spinner aria-hidden={true} className="h-3.5 w-3.5" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Generate External AI Persona</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={cn(
                'flex items-start gap-3 max-w-3xl',
                isUser ? 'ms-auto flex-row-reverse' : 'me-auto'
              )}
            >
              {/* Avatar Icon */}
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-xs text-xs font-bold ring-1 ring-border',
                  isUser
                    ? 'bg-primary text-white'
                    : 'bg-primary-soft text-text-primary dark:text-primary'
                )}
              >
                {isUser ? userInitial : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col space-y-1 max-w-[85%] sm:max-w-[78%]">
                <Card
                  className={cn(
                    'p-3.5 shadow-xs border text-sm leading-relaxed whitespace-pre-wrap break-words',
                    isUser
                      ? 'bg-primary text-white border-primary/90'
                      : 'bg-surface text-text-primary border-border'
                  )}
                >
                  {msg.content}
                </Card>
                <span
                  className={cn(
                    'text-[10px] text-text-secondary px-1',
                    isUser ? 'text-end' : 'text-start'
                  )}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isSending && (
          <div className="flex items-start gap-3 max-w-3xl me-auto animate-pulse">
            <div className="h-8 w-8 rounded-full bg-primary-soft text-text-primary dark:text-primary flex items-center justify-center shrink-0 shadow-xs ring-1 ring-border">
              <Bot className="h-4 w-4" />
            </div>
            <Card className="p-3.5 bg-surface text-text-primary border-border shadow-xs flex items-center gap-2 text-xs text-text-secondary">
              <Spinner aria-hidden={true} className="h-3.5 w-3.5 text-primary" />
              <span>BOCHA AI is reasoning and executing tools...</span>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompt Chips */}
      {messages.length <= 1 && (
        <div className="py-2 flex flex-wrap gap-2 shrink-0">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setInputVal(prompt);
                inputRef.current?.focus();
              }}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors text-start"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Sticky Bottom Input Bar */}
      <div className="pt-2 shrink-0 border-t border-border/80">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI assistant to create tasks, check projects, capture ideas..."
            className="flex-1 h-11 px-4 text-sm border-border bg-surface shadow-xs"
            disabled={isSending}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!inputVal.trim() || isSending}
            className="h-11 px-4 gap-1.5 shadow-xs font-semibold shrink-0"
          >
            {isSending ? (
              <Spinner aria-hidden={true} className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </div>

      {/* 5-Pillar Persona Modal */}
      <Dialog open={isPersonaModalOpen} onOpenChange={setIsPersonaModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>External AI Persona Prompt (5-Pillar Framework)</span>
            </DialogTitle>
            <DialogDescription>
              Copy this structured prompt to prime ChatGPT, Claude, Gemini, or DeepSeek with complete
              knowledge of your current BOCHA projects, tasks, and inbox.
            </DialogDescription>
          </DialogHeader>

          {/* Workspace Stats Overview */}
          {personaData?.stats && (
            <div className="flex flex-wrap gap-2 py-2">
              <Badge variant="outline" className="gap-1.5 text-xs py-1">
                <Layers className="h-3 w-3 text-indigo-500" />
                <span>{personaData.stats.projects_count} Projects</span>
              </Badge>
              <Badge variant="outline" className="gap-1.5 text-xs py-1">
                <CheckSquare className="h-3 w-3 text-destructive" />
                <span>{personaData.stats.pending_tasks_count} Open Tasks</span>
              </Badge>
              <Badge variant="outline" className="gap-1.5 text-xs py-1">
                <Inbox className="h-3 w-3 text-warning" />
                <span>{personaData.stats.inbox_items_count} Inbox Thoughts</span>
              </Badge>
              <Badge variant="outline" className="gap-1.5 text-xs py-1">
                <BookOpen className="h-3 w-3 text-primary" />
                <span>{personaData.stats.notes_count} Notes</span>
              </Badge>
            </div>
          )}

          {/* Monospace Prompt Preview Container */}
          <div className="flex-1 min-h-[300px] overflow-hidden rounded-md border border-border bg-surface-secondary/40 p-2">
            <textarea
              readOnly
              value={personaData?.persona_prompt || ''}
              className="w-full h-full min-h-[280px] p-2 bg-transparent text-text-primary font-mono text-xs leading-relaxed resize-none focus:outline-none select-all"
            />
          </div>

          <DialogFooter className="flex sm:justify-between items-center gap-2 pt-3 border-t border-border">
            <span className="text-xs text-text-secondary">
              Adheres strictly to Instructions, Context, Examples, Constraints & Format.
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPersonaModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCopyPersona}
                className="gap-1.5 shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
