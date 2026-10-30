import { useEffect, useRef, useState } from 'react';

export interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  disabled?: boolean;
}

/**
 * High-performance scroll reveal hook powered by IntersectionObserver.
 * - Triggers an upward reveal once the element crosses the viewport threshold.
 * - Unobserves immediately upon entering viewport to eliminate scroll overhead.
 * - Respects prefers-reduced-motion to avoid unnecessary motion.
 * - SSR & No-JS safe: returns true if window/IntersectionObserver is not available.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const {
    threshold = 0.12,
    rootMargin = '0px 0px -40px 0px',
    delay = 0,
    disabled = false,
  } = options;

  const elementRef = useRef<T | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(() => {
    // If running in SSR or reduced motion preferred, default to visible immediately
    if (typeof window === 'undefined') return true;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (disabled || isRevealed) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    let timeoutId: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutId = window.setTimeout(() => {
              setIsRevealed(true);
            }, delay);
          } else {
            setIsRevealed(true);
          }
          observer.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [threshold, rootMargin, delay, disabled, isRevealed]);

  return { ref: elementRef, isRevealed };
}
