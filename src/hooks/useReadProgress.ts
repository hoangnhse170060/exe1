import { useCallback, useEffect, useRef, useState } from 'react';

export type UseReadProgressArgs = {
  threshold?: number;
  onThreshold?: () => void;
};

export type UseReadProgressResult<T extends HTMLElement> = {
  ref: (node: T | null) => void;
  progress: number;
};

/**
 * Tracks how much of an article has been viewed based on viewport bottom crossing the content height.
 */
export function useReadProgress<T extends HTMLElement>({ threshold = 0.8, onThreshold }: UseReadProgressArgs = {}): UseReadProgressResult<T> {
  const nodeRef = useRef<T | null>(null);
  const seenThreshold = useRef(false);
  const [progress, setProgress] = useState(0);

  const calculate = useCallback(() => {
    const node = nodeRef.current;
    if (!node || typeof window === 'undefined') return;

    const rect = node.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const elementHeight = rect.height || 1;
    const elementTop = window.scrollY + rect.top;
    const viewportBottom = window.scrollY + viewportHeight;
    const ratio = Math.max(0, Math.min(1, (viewportBottom - elementTop) / elementHeight));
    setProgress((prev) => (ratio > prev ? ratio : prev));
    if (!seenThreshold.current && ratio >= threshold) {
      seenThreshold.current = true;
      onThreshold?.();
    }
  }, [threshold, onThreshold]);

  useEffect(() => {
    calculate();
    const handler = () => calculate();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [calculate]);

  const ref = useCallback((node: T | null) => {
    nodeRef.current = node;
    calculate();
  }, [calculate]);

  return { ref, progress };
}
