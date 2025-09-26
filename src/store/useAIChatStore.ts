import { create } from 'zustand';
import { sendChatMessage, ChatMessage } from '@/services/aiService';

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIChatState {
  isOpen: boolean;
  isLoading: boolean;
  messages: AIChatMessage[];
  open: () => void;
  close: () => void;
  toggle: () => void;
  clear: () => void;
  send: (content: string) => Promise<void>;
}

const initialAssistantMessage: AIChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    `Hello! I'm your AI energy assistant. I can help you analyze your electricity consumption patterns, provide energy-saving recommendations, and answer questions about your usage data.\n\n` +
    `Here's what I can help you with:\n` +
    `• 📊 Analyze your consumption trends\n` +
    `• 💡 Suggest energy-saving tips\n` +
    `• 💰 Calculate potential cost savings\n` +
    `• 🔍 Identify unusual usage patterns\n` +
    `• 📈 Predict future consumption\n\n` +
    `What would you like to know about your energy usage?`
};

export const useAIChatStore = create<AIChatState>()((set, get) => ({
  isOpen: false,
  isLoading: false,
  messages: [initialAssistantMessage],

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((previousState: AIChatState) => ({ isOpen: !previousState.isOpen })),
  clear: () => set({ messages: [initialAssistantMessage] }),

  send: async (content: string) => {
    if (!content.trim() || get().isLoading) return;

    const userMessage: AIChatMessage = {
      id: `${Date.now()}`,
      role: 'user',
      content: content.trim(),
    };

    // Optimistically add user message
    set((state: AIChatState) => ({ messages: [...state.messages, userMessage], isLoading: true }));

    try {
      const currentMessages: ChatMessage[] = get().messages.map((message) => ({ role: message.role, content: message.content }));
      const response = await sendChatMessage({ messages: [...currentMessages, { role: 'user', content: userMessage.content }] });

      if (response.status === 'OK' && response.response) {
        const assistantMessage: AIChatMessage = {
          id: `${Date.now() + 1}`,
          role: 'assistant',
          content: response.response,
        };
        set((state: AIChatState) => ({ messages: [...state.messages, assistantMessage] }));
      } else {
        const errorContent = response.code === 429
          ? `I'm experiencing high demand and my API quota has been exceeded. Please try again later.`
          : (response.message || 'Sorry, I encountered an error. Please try again.');
        const assistantMessage: AIChatMessage = {
          id: `${Date.now() + 1}`,
          role: 'assistant',
          content: errorContent,
        };
        set((state: AIChatState) => ({ messages: [...state.messages, assistantMessage] }));
      }
    } catch {
      const assistantMessage: AIChatMessage = {
        id: `${Date.now() + 1}`,
        role: 'assistant',
        content: 'Sorry, I encountered a network error. Please try again.',
      };
      set((state: AIChatState) => ({ messages: [...state.messages, assistantMessage] }));
    } finally {
      set({ isLoading: false });
    }
  },
}));

