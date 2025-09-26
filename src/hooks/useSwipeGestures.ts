import { useState, useRef, useCallback } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefault?: boolean;
}

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isSwipping: boolean;
}

export const useSwipeGestures = (options: SwipeGestureOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefault = true
  } = options;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwipping: false
  });

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }

    const touch = e.touches[0];
    const now = Date.now();
    
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: now
    };

    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isSwipping: true
    });
  }, [preventDefault]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }

    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    
    setSwipeState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY
    }));
  }, [preventDefault]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }

    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Only process swipes that are quick enough and far enough
    if (deltaTime > 300) {
      touchStartRef.current = null;
      setSwipeState(prev => ({ ...prev, isSwipping: false }));
      return;
    }

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      // Horizontal swipe
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      // Vertical swipe
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }

    touchStartRef.current = null;
    setSwipeState(prev => ({ ...prev, isSwipping: false }));
  }, [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, preventDefault]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }

    const now = Date.now();
    
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: now
    };

    setSwipeState({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isSwipping: true
    });
  }, [preventDefault]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }

    if (!touchStartRef.current) return;

    setSwipeState(prev => ({
      ...prev,
      currentX: e.clientX,
      currentY: e.clientY
    }));
  }, [preventDefault]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }

    if (!touchStartRef.current) return;

    const deltaX = e.clientX - touchStartRef.current.x;
    const deltaY = e.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Only process swipes that are quick enough and far enough
    if (deltaTime > 300) {
      touchStartRef.current = null;
      setSwipeState(prev => ({ ...prev, isSwipping: false }));
      return;
    }

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      // Horizontal swipe
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      // Vertical swipe
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }

    touchStartRef.current = null;
    setSwipeState(prev => ({ ...prev, isSwipping: false }));
  }, [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, preventDefault]);

  return {
    swipeState,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    mouseHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    },
    isSwipping: swipeState.isSwipping
  };
};
