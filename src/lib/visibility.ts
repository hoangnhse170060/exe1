export type VisibilityCallback = (entry: IntersectionObserverEntry) => void;

export type VisibilityOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

/**
 * Creates a shared IntersectionObserver instance.
 */
export function createVisibilityObserver(callback: VisibilityCallback, options?: VisibilityOptions) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return {
      root: null,
      rootMargin: '0px',
      thresholds: [] as number[],
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {},
      takeRecords: () => [],
    } as IntersectionObserver;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, options);

  return observer;
}
