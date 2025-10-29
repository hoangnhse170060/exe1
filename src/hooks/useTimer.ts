import { useCallback, useEffect, useRef, useState } from 'react';

export type UseTimerOptions = {
  durationMs: number;
  autoStart?: boolean;
  onTick?: (msLeft: number) => void;
  onComplete?: () => void;
};

export type TimerControls = {
  timeLeft: number;
  isActive: boolean;
  start: () => void;
  pause: () => void;
  reset: (nextDurationMs?: number) => void;
};

/** Countdown timer used for the quiz with millisecond precision and callbacks. */
export function useTimer({ durationMs, autoStart = false, onTick, onComplete }: UseTimerOptions): TimerControls {
  const [timeLeft, setTimeLeft] = useState(durationMs);
  const [isActive, setIsActive] = useState(autoStart);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const pauseRef = useRef<number>(0);

  const step = useCallback((timestamp: number) => {
    if (!startRef.current) {
      startRef.current = timestamp;
    }
    const elapsed = timestamp - (startRef.current + pauseRef.current);
    const remaining = Math.max(0, durationMs - elapsed);
    setTimeLeft(remaining);
    onTick?.(remaining);

    if (remaining === 0) {
      setIsActive(false);
      onComplete?.();
      return;
    }

    rafRef.current = window.requestAnimationFrame(step);
  }, [durationMs, onTick, onComplete]);

  useEffect(() => {
    if (!isActive) {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      pauseRef.current = 0;
      startRef.current = null;
      return;
    }
    rafRef.current = window.requestAnimationFrame(step);
    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isActive, step]);

  const start = useCallback(() => {
    setIsActive(true);
    startRef.current = null;
    pauseRef.current = 0;
  }, []);

  const pause = useCallback(() => {
    if (!isActive) return;
    setIsActive(false);
    pauseRef.current += window.performance.now() - (startRef.current ?? 0);
  }, [isActive]);

  const reset = useCallback((nextDurationMs?: number) => {
    if (typeof nextDurationMs === 'number') {
      setTimeLeft(nextDurationMs);
    } else {
      setTimeLeft(durationMs);
    }
    setIsActive(false);
    startRef.current = null;
    pauseRef.current = 0;
  }, [durationMs]);

  useEffect(() => {
    setTimeLeft(durationMs);
    setIsActive(autoStart);
  }, [durationMs, autoStart]);

  return {
    timeLeft,
    isActive,
    start,
    pause,
    reset,
  };
}
