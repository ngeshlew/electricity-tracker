import { act } from '@testing-library/react';
import { useAIChatStore } from '@/store/useAIChatStore';

jest.mock('@/services/aiService', () => ({
  sendChatMessage: jest.fn().mockResolvedValue({ status: 'OK', response: 'Assistant reply' }),
}));

describe('useAIChatStore', () => {
  beforeEach(() => {
    const { clear, close } = useAIChatStore.getState();
    clear();
    close();
  });

  it('adds user and assistant messages when sending', async () => {
    const initialCount = useAIChatStore.getState().messages.length; // welcome message

    await act(async () => {
      await useAIChatStore.getState().send('Hello AI');
    });

    const { messages, isLoading } = useAIChatStore.getState();
    expect(isLoading).toBe(false);
    expect(messages.length).toBe(initialCount + 2); // user + assistant
    expect(messages[messages.length - 2].role).toBe('user');
    expect(messages[messages.length - 1].role).toBe('assistant');
  });
});

