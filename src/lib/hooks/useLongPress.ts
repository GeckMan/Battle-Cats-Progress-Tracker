import { useRef, useState, useCallback } from "react";

interface UseLongPressOptions {
  /** Callback fired when long-press completes */
  onLongPress: () => void;
  /** Milliseconds to hold before triggering (default 500) */
  duration?: number;
  /** Max pixels of movement allowed before cancelling (default 10) */
  moveThreshold?: number;
}

interface UseLongPressResult {
  /** Spread these onto the target element */
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerUp: () => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerLeave: () => void;
  };
  /** True while the press timer is actively running (use for visual feedback) */
  pressActive: boolean;
  /**
   * Ref that is `true` immediately after a long-press fires.
   * Check this in your onClick handler to suppress the tap that follows a
   * touch release. Reset it to `false` after reading.
   */
  longPressed: React.MutableRefObject<boolean>;
}

/**
 * Detects long-press (touch hold) gestures using pointer events.
 * Works for both touch and mouse input.
 *
 * Cancels if the pointer moves beyond `moveThreshold` pixels (so scrolling
 * doesn't accidentally trigger) or if the pointer leaves / lifts early.
 */
export function useLongPress({
  onLongPress,
  duration = 500,
  moveThreshold = 10,
}: UseLongPressOptions): UseLongPressResult {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const longPressed = useRef(false);
  const [pressActive, setPressActive] = useState(false);

  // Stable ref for the callback so the handlers never change identity
  const callbackRef = useRef(onLongPress);
  callbackRef.current = onLongPress;

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPressActive(false);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only respond to primary pointer (left mouse / single touch)
      if (e.button !== 0) return;

      longPressed.current = false;
      startPos.current = { x: e.clientX, y: e.clientY };
      setPressActive(true);

      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        longPressed.current = true;
        setPressActive(false);
        callbackRef.current();
      }, duration);
    },
    [duration],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startPos.current || !timerRef.current) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      if (Math.abs(dx) > moveThreshold || Math.abs(dy) > moveThreshold) {
        cancel();
      }
    },
    [moveThreshold, cancel],
  );

  const onPointerUp = useCallback(() => {
    cancel();
  }, [cancel]);

  const onPointerLeave = useCallback(() => {
    cancel();
  }, [cancel]);

  return {
    handlers: { onPointerDown, onPointerUp, onPointerMove, onPointerLeave },
    pressActive,
    longPressed,
  };
}
