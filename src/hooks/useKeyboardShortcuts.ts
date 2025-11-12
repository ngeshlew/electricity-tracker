import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: (e: KeyboardEvent) => void;
  description?: string;
}

/**
 * Custom hook for handling keyboard shortcuts
 * 
 * @param shortcuts Array of keyboard shortcut configurations
 * @param enabled Whether shortcuts are enabled (default: true)
 * 
 * @example
 * useKeyboardShortcuts([
 *   {
 *     key: 'a',
 *     handler: () => toggleMeterPanel(true),
 *     description: 'Open Add Reading panel'
 *   },
 *   {
 *     key: '/',
 *     handler: () => searchInputRef.current?.focus(),
 *     description: 'Focus search'
 *   }
 * ]);
 */
export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow "/" to focus search even when in input (common pattern)
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
          // Let it through for search focus
        } else {
          return;
        }
      }

      shortcuts.forEach((shortcut) => {
        const keyMatches = 
          e.key.toLowerCase() === shortcut.key.toLowerCase() ||
          e.code.toLowerCase() === shortcut.key.toLowerCase();
        
        const ctrlMatches = shortcut.ctrlKey ? e.ctrlKey : !e.ctrlKey;
        const shiftMatches = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;
        const altMatches = shortcut.altKey ? e.altKey : !e.altKey;
        const metaMatches = shortcut.metaKey ? e.metaKey : !e.metaKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
          e.preventDefault();
          shortcut.handler(e);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
};

