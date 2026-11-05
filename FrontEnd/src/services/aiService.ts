import api from '@/lib/api';
import type { AgentChatResponse, PersonaResponse } from '@/types/api';

export const aiService = {
  /**
   * Sends a message to the Agentic AI assistant, passing the conversation history.
   */
  async chatWithAgent(
    message: string,
    history: Array<{ role: string; parts: string[] }> = []
  ): Promise<AgentChatResponse> {
    const response = await api.post<AgentChatResponse>('/agent/chat/', {
      message,
      history,
    });
    return response.data;
  },

  /**
   * Fetches the 5-Pillar Context/Persona Prompt summarizing the user's workspace state.
   */
  async generatePersona(): Promise<PersonaResponse> {
    const response = await api.get<PersonaResponse>('/agent/persona/');
    return response.data;
  },
};
