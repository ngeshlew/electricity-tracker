import { useEffect } from 'react';

interface ShortcutHandlers {
  onAddReading?: () => void;
  onFocusSearch?: () => void;
  onToggleFilters?: () => void;
  onOpenCommand?: () => void;
}

export const useKeyboardShortcuts = (handlers: ShortcutHandlers) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Command palette (⌘K or Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handlers.onOpenCommand?.();
        return;
      }

      // Add reading (A)
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handlers.onAddReading?.();
        return;
      }

      // Focus search (/)
      if (e.key === '/') {
        e.preventDefault();
        handlers.onFocusSearch?.();
        return;
      }

      // Toggle filters (F)
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handlers.onToggleFilters?.();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};