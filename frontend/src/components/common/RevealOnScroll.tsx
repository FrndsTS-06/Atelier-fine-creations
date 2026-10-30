import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: 'up' | 'none';
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

/**
 * Reusable scroll-triggered upward animation wrapper.
 * - Elements gently fade in while translating upward ~24-40px.
 * - Smooth luxury cubic-bezier easing.
 * - Stagger friendly (via delay prop).
 * - SSR & accessible fallback for prefers-reduced-motion.
 */
export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  delay = 0,
  duration = 650,
  distance = 32,
  direction = 'up',
  threshold = 0.1,
  className = '',
  style = {},
  as: Component = 'div',
}) => {
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>({
    delay,
    threshold,
  });

  const shouldShift = direction === 'up';

  const motionStyle: React.CSSProperties = {
    ...style,
    opacity: isRevealed ? 1 : 0,
    transform: isRevealed
      ? 'translateY(0)'
      : shouldShift
        ? `translateY(${distance}px)`
        : 'none',
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    willChange: isRevealed ? 'auto' : 'opacity, transform',
  };

  return (
    <Component
      ref={ref}
      className={`reveal-on-scroll ${className}`}
      style={motionStyle}
    >
      {children}
    </Component>
  );
};
