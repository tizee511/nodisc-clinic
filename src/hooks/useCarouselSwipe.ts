import React, { useCallback, useEffect, useRef, useState } from 'react';

interface UseCarouselSwipeOptions {
  activeIndex: number;
  maxIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

export function useReducedMotionPref(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export function useCarouselSwipe({
  activeIndex,
  maxIndex,
  onNext,
  onPrev,
}: UseCarouselSwipeOptions) {
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const gestureRef = useRef<{
    active: boolean;
    lockedAxis: 'none' | 'x' | 'y';
    startX: number;
    startY: number;
    lastDx: number;
    didDrag: boolean;
  }>({
    active: false,
    lockedAxis: 'none',
    startX: 0,
    startY: 0,
    lastDx: 0,
    didDrag: false,
  });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (maxIndex === 0) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      // Do not hijack drags starting on interactive buttons inside cards
      const target = e.target as HTMLElement | null;
      if (target?.closest('button')) return;

      gestureRef.current = {
        active: true,
        lockedAxis: 'none',
        startX: e.clientX,
        startY: e.clientY,
        lastDx: 0,
        didDrag: false,
      };
    },
    [maxIndex]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const g = gestureRef.current;
      if (!g.active) return;

      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;

      if (g.lockedAxis === 'none') {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        if (Math.abs(dy) > Math.abs(dx) * 1.1) {
          g.lockedAxis = 'y';
          g.active = false;
          return;
        }
        g.lockedAxis = 'x';
        g.didDrag = true;
        setIsDragging(true);
      }

      if (g.lockedAxis === 'x') {
        g.lastDx = dx;
        // Apply gentle resistance at track edges
        const atStartBoundary = activeIndex === 0 && dx > 0;
        const atEndBoundary = activeIndex === maxIndex && dx < 0;
        const damped = atStartBoundary || atEndBoundary ? dx * 0.32 : dx;
        setDragOffsetPx(Math.max(-180, Math.min(180, damped)));
      }
    },
    [activeIndex, maxIndex]
  );

  const finishGesture = useCallback(() => {
    const g = gestureRef.current;
    if (!g.active && g.lockedAxis !== 'x') return;

    const dx = g.lastDx;
    const wasHorizontal = g.lockedAxis === 'x';

    g.active = false;
    g.lockedAxis = 'none';
    g.lastDx = 0;

    setIsDragging(false);
    setDragOffsetPx(0);

    if (wasHorizontal && Math.abs(dx) > 40) {
      if (dx < 0) onNext();
      else onPrev();
    }

    if (g.didDrag) {
      window.setTimeout(() => {
        gestureRef.current.didDrag = false;
      }, 40);
    }
  }, [onNext, onPrev]);

  const handleClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (gestureRef.current.didDrag) {
      e.preventDefault();
      e.stopPropagation();
      gestureRef.current.didDrag = false;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (maxIndex === 0) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      }
    },
    [maxIndex, onNext, onPrev]
  );

  return {
    dragOffsetPx,
    isDragging,
    viewportProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: finishGesture,
      onPointerCancel: finishGesture,
      onPointerLeave: finishGesture,
      onClickCapture: handleClickCapture,
      onKeyDown: handleKeyDown,
    },
  };
}
