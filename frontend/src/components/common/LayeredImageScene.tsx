import React, { useRef, useState, useEffect } from 'react';
import { prefersReducedMotion } from '../../utils/gsapConfig';

export interface LayerConfig {
  src?: string;
  alt?: string;
  element?: React.ReactNode;
  depth: number; // e.g. 0.2 for background, 1.0 for subject, 1.6 for floating glass
  translateZ?: number; // in pixels
  scale?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface LayeredImageSceneProps {
  layers: LayerConfig[];
  aspectRatio?: string;
  maxTilt?: number; // maximum rotation degrees (default: 6)
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * LayeredImageScene
 * Separates visual compositions into authentic, independent spatial depth layers:
 * Background atmosphere -> Midground textures -> Main subject -> Foreground glints & Glass overlays.
 * Includes interactive pointer 3D perspective tracking and graceful resting recovery.
 */
export const LayeredImageScene: React.FC<LayeredImageSceneProps> = ({
  layers,
  aspectRatio = '4/3',
  maxTilt = 6,
  className = '',
  style = {},
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const isTouchRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      isTouchRef.current =
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(hover: none)').matches;
    }

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (isTouchRef.current || prefersReducedMotion()) return;
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.15s ease-out';
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouchRef.current || prefersReducedMotion() || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotX = ((y / rect.height - 0.5) * -maxTilt * 2).toFixed(2);
    const rotY = ((x / rect.width - 0.5) * maxTilt * 2).toFixed(2);

    const pctX = ((x / rect.width) * 100).toFixed(1);
    const pctY = ((y / rect.height) * 100).toFixed(1);

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      cardRef.current.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

      // Move individual layers based on their specific depth factor
      const layerElements = cardRef.current.querySelectorAll<HTMLElement>('.scene-depth-layer');
      layerElements.forEach((el) => {
        const depth = parseFloat(el.getAttribute('data-depth') || '1');
        const z = parseFloat(el.getAttribute('data-z') || '0');
        const shiftX = (x / rect.width - 0.5) * -22 * depth;
        const shiftY = (y / rect.height - 0.5) * -22 * depth;
        el.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, ${z}px)`;
      });

      // Update Specular light sheen
      if (sheenRef.current) {
        sheenRef.current.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255, 230, 180, 0.22) 0%, rgba(196, 154, 90, 0.08) 35%, transparent 65%)`;
        sheenRef.current.style.opacity = '1';
      }
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (isTouchRef.current || prefersReducedMotion()) return;

    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';

      const layerElements = cardRef.current.querySelectorAll<HTMLElement>('.scene-depth-layer');
      layerElements.forEach((el) => {
        const z = parseFloat(el.getAttribute('data-z') || '0');
        el.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = `translate3d(0px, 0px, ${z}px)`;
      });
    }

    if (sheenRef.current) {
      sheenRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`layered-image-scene-wrapper ${className}`}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        position: 'relative',
        width: '100%',
        perspective: '1200px',
        ...style,
      }}
    >
      <div
        ref={cardRef}
        className="layered-image-scene-inner"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          transformStyle: 'preserve-3d',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: '#100F0C',
          boxShadow: isHovered
            ? '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 36px rgba(196, 154, 90, 0.22)'
            : '0 16px 40px rgba(0, 0, 0, 0.65), 0 0 20px rgba(196, 154, 90, 0.1)',
          border: '1px solid rgba(196, 154, 90, 0.3)',
          transition: 'transform 0.5s ease-out, box-shadow 0.3s ease',
        }}
      >
        {/* Render Layer Elements */}
        {layers.map((layer, idx) => (
          <div
            key={idx}
            className={`scene-depth-layer ${layer.className || ''}`}
            data-depth={layer.depth}
            data-z={layer.translateZ ?? layer.depth * 24}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: layer.depth > 1.2 ? 'auto' : 'none',
              transform: `translate3d(0, 0, ${layer.translateZ ?? layer.depth * 24}px)`,
              opacity: layer.opacity ?? 1,
              transition: isHovered ? 'none' : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
              ...layer.style,
            }}
          >
            {layer.src ? (
              <img
                src={layer.src}
                alt={layer.alt || 'Atelier fine layered visual element'}
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transform: layer.scale ? `scale(${layer.scale})` : undefined,
                }}
              />
            ) : (
              layer.element
            )}
          </div>
        ))}

        {/* Specular Interactive Light Sheen */}
        <div
          ref={sheenRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            pointerEvents: 'none',
            mixBlendMode: 'screen',
            transition: 'opacity 0.3s ease',
            zIndex: 10,
          }}
        />

        {children}
      </div>
    </div>
  );
};
