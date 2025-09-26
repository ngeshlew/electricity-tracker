import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InsightsPage } from '@/components/insights/InsightsPage';
import { useAIChatStore } from '@/store/useAIChatStore';

jest.mock('@/services/aiService', () => ({
  getAIHealth: jest.fn().mockResolvedValue({ status: 'OK' }),
  sendChatMessage: jest.fn().mockResolvedValue({ status: 'OK', response: 'Assistant reply' }),
}));

describe('InsightsPage Ask AI -> Chat integration', () => {
  beforeEach(() => {
    const { clear, close } = useAIChatStore.getState();
    clear();
    close();
  });

  it('submitting Ask AI opens chat and sends message', async () => {
    render(<InsightsPage />);

    // Switch to Ask AI tab
    const askTab = await screen.findByRole('tab', { name: /ask ai/i });
    fireEvent.click(askTab);

    // Enter a prompt
    const textarea = await screen.findByLabelText(/your question or request/i);
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });

    // Submit
    const submitBtn = await screen.findByRole('button', { name: /ask ai/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const { messages } = useAIChatStore.getState();
      expect(messages.some((m) => m.role === 'user' && m.content === 'Test prompt')).toBe(true);
    });
  });
});

