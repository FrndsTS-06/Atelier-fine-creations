import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins safely in browser environment
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// SSR-safe layout effect
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Checks if the patron prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Custom hook to execute GSAP animations within a scoped context,
 * ensuring complete cleanup and memory safety on component unmount.
 */
export const useGsapContext = (
  scopeRef: React.RefObject<HTMLElement | null>,
  callback: (ctx: gsap.Context) => void,
  dependencies: React.DependencyList = []
) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !scopeRef.current) return;

    if (prefersReducedMotion()) {
      // If user prefers reduced motion, bypass complex timelines
      return;
    }

    let ctx: gsap.Context | undefined;
    ctx = gsap.context((self) => {
      callback(self);
    }, scopeRef);

    return () => {
      ctx?.revert(); // Completely reverts all tweens & ScrollTriggers created in context
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export { gsap, ScrollTrigger };
