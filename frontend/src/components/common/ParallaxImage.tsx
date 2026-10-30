import React, { useRef } from 'react';
import { useGsapContext, gsap, prefersReducedMotion } from '../../utils/gsapConfig';

export interface ParallaxImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  speed?: number; // e.g. 0.25 (moves 25% slower than scroll)
  scaleAmount?: number; // e.g. 1.15 to ensure no gaps during parallax
  direction?: 'vertical' | 'zoom' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
  overlay?: React.ReactNode;
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Reusable scroll-driven ParallaxImage container using GSAP ScrollTrigger.
 * Keeps normal native scrolling completely smooth while creating rich physical depth.
 */
export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  speed = 0.2,
  scaleAmount = 1.14,
  direction = 'vertical',
  className = '',
  style = {},
  overlay,
  objectFit = 'cover',
  objectPosition = 'center',
  loading = 'lazy',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGsapContext(containerRef, () => {
    if (!imageRef.current || !containerRef.current || prefersReducedMotion()) return;

    if (direction === 'vertical') {
      const distance = 60 * speed * 2;
      gsap.fromTo(
        imageRef.current,
        {
          y: -distance,
          scale: scaleAmount,
        },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
          y: distance,
          scale: scaleAmount,
          ease: 'none',
        }
      );
    } else if (direction === 'zoom') {
      gsap.fromTo(
        imageRef.current,
        {
          scale: 1,
        },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
          scale: scaleAmount + 0.08,
          ease: 'none',
        }
      );
    }
  }, [src, speed, scaleAmount, direction]);

  return (
    <div
      ref={containerRef}
      className={`parallax-image-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        aspectRatio,
        backgroundColor: '#0C0B09',
        ...style,
      }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          objectPosition,
          display: 'block',
          willChange: 'transform',
          transform: `scale(${scaleAmount})`,
        }}
      />
      {overlay}
    </div>
  );
};
