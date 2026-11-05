import { useState, useCallback } from 'react';
import { aiService } from '@/services/aiService';
import type { AgentChatMessage, PersonaResponse } from '@/types/api';

export function useAgent() {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I am your LifeOS AI Assistant. I can help manage your tasks, check your project status, capture thoughts to your inbox, or provide a daily executive briefing. What would you like to do?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);
  const [personaData, setPersonaData] = useState<PersonaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      const userMsg: AgentChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsSending(true);
      setError(null);

      // Build Gemini history
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [m.content],
        }));

      try {
        const response = await aiService.chatWithAgent(trimmed, history);
        const assistantMsg: AgentChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: response.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to reach the LifeOS AI assistant.';
        setError(message);
        const errorMsg: AgentChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Error: ${message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsSending(false);
      }
    },
    [messages, isSending]
  );

  const generatePersona = useCallback(async (): Promise<PersonaResponse> => {
    setIsGeneratingPersona(true);
    setError(null);
    try {
      const data = await aiService.generatePersona();
      setPersonaData(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate external AI persona.';
      setError(msg);
      throw err;
    } finally {
      setIsGeneratingPersona(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          "Conversation cleared. How can I assist you with your LifeOS workspace today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  return {
    messages,
    isSending,
    isGeneratingPersona,
    personaData,
    error,
    sendMessage,
    generatePersona,
    clearMessages,
  };
}
