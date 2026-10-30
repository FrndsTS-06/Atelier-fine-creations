import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGsapContext, gsap, prefersReducedMotion } from '../../utils/gsapConfig';
import { Flame, Sparkles, Mountain, Play, Pause } from 'lucide-react';

interface Stage {
  id: string;
  name: string;
  badge: string;
  image: string;
  temperature: string;
  description: string;
  icon: React.ReactNode;
}

const REFINING_STAGES: Stage[] = [
  {
    id: 'mine',
    name: 'Mined Veins',
    badge: '01. EXTRACTION',
    image: '/images/mining/gold-mine-bedrock.jpg',
    temperature: 'Ambient Mine 18°C',
    description: 'Natural 24K raw gold veins uncovered within subterranean obsidian rock',
    icon: <Mountain size={14} />,
  },
  {
    id: 'smelt',
    name: 'Furnace Smelting',
    badge: '02. 1064°C CRUCIBLE',
    image: '/images/mining/gold-furnace-crucible.jpg',
    temperature: 'Foundry Furnace 1064°C',
    description: 'Atelier crucible heating raw gold into radiant, bubbling molten metal',
    icon: <Flame size={14} />,
  },
  {
    id: 'pour',
    name: 'Molten Pour',
    badge: '03. 24K FLUID REFINING',
    image: '/images/mining/molten-gold-flowing.jpg',
    temperature: 'Liquid Gold Flow 1040°C',
    description: 'Slow, viscous stream of incandescent 24K liquid gold poured into casting ingots',
    icon: <Sparkles size={14} />,
  },
];

interface EmberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  hue: number;
}

export const GoldMiningBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStageIndex, setActiveStageIndex] = useState(2); // Start on dramatic molten pour
  const [isPlaying, setIsPlaying] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    setIsReducedMotion(prefersReducedMotion());
  }, []);

  // Automatic stage cycling
  useEffect(() => {
    if (!isPlaying || isReducedMotion) return;

    const interval = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % REFINING_STAGES.length);
    }, 8500);

    return () => clearInterval(interval);
  }, [isPlaying, isReducedMotion]);

  // GSAP ScrollTrigger depth & dimming as user scrolls down
  useGsapContext(containerRef, () => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current.parentElement || containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
      y: 90,
      scale: 0.96,
      opacity: 0.22,
      filter: 'brightness(0.65)',
      ease: 'none',
    });
  }, []);

  // Real-Time Viscous Molten Fluid Flow & Thermal Ember Canvas Engine
  useEffect(() => {
    if (isReducedMotion || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Initialize 36 restrained glowing thermal embers
    const emberCount = 36;
    const embers: EmberParticle[] = [];

    const createEmber = (resetAtBottom = false): EmberParticle => ({
      x: width * 0.45 + (Math.random() - 0.5) * (width * 0.4),
      y: resetAtBottom ? height * 0.95 + Math.random() * 20 : Math.random() * height,
      vx: (Math.random() - 0.48) * 0.7,
      vy: -(Math.random() * 1.35 + 0.65),
      size: Math.random() * 2.8 + 1.2,
      alpha: Math.random() * 0.7 + 0.3,
      maxLife: Math.random() * 180 + 120,
      life: resetAtBottom ? 0 : Math.random() * 180,
      hue: Math.random() > 0.6 ? 42 : 32, // Champagne-gold to deep amber
    });

    for (let i = 0; i < emberCount; i++) {
      embers.push(createEmber(false));
    }

    let time = 0;
    let isVisible = true;

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Animation Loop
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Slow Viscous Molten Gold Pour Stream (when on molten stages)
      const flowIntensity = activeStageIndex === 0 ? 0.2 : activeStageIndex === 1 ? 0.6 : 1.0;

      if (flowIntensity > 0.1) {
        // Stream source origin
        const startX = width * 0.52 + Math.sin(time * 0.5) * 4;
        const startY = height * 0.18;
        const poolX = width * 0.56;
        const poolY = height * 0.78;

        // Draw multiple viscous glowing liquid layers
        const streamWidth = (width > 768 ? 24 : 16) * flowIntensity;

        // Outer fiery amber glow
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX - streamWidth * 1.6, startY);
        ctx.bezierCurveTo(
          startX - streamWidth * 0.8,
          startY + (poolY - startY) * 0.4 + Math.sin(time * 1.5) * 8,
          poolX - streamWidth * 2.2,
          poolY - (poolY - startY) * 0.3,
          poolX - streamWidth * 1.8,
          poolY
        );
        ctx.lineTo(poolX + streamWidth * 1.8, poolY);
        ctx.bezierCurveTo(
          poolX + streamWidth * 2.2,
          poolY - (poolY - startY) * 0.3,
          startX + streamWidth * 0.8,
          startY + (poolY - startY) * 0.4 + Math.sin(time * 1.5) * 8,
          startX + streamWidth * 1.6,
          startY
        );
        ctx.closePath();

        const amberGrad = ctx.createLinearGradient(startX, startY, poolX, poolY);
        amberGrad.addColorStop(0, 'rgba(255, 179, 0, 0.45)');
        amberGrad.addColorStop(0.5, 'rgba(230, 81, 0, 0.55)');
        amberGrad.addColorStop(1, 'rgba(255, 215, 0, 0.65)');
        ctx.fillStyle = amberGrad;
        ctx.shadowColor = '#FFB300';
        ctx.shadowBlur = 35 * flowIntensity;
        ctx.fill();
        ctx.restore();

        // Inner Incandescent Yellow-Gold Core
        ctx.save();
        ctx.beginPath();
        const innerWidth = streamWidth * 0.65;
        ctx.moveTo(startX - innerWidth, startY);
        ctx.bezierCurveTo(
          startX - innerWidth * 0.5,
          startY + (poolY - startY) * 0.4 + Math.sin(time * 1.5) * 6,
          poolX - innerWidth * 1.2,
          poolY - (poolY - startY) * 0.3,
          poolX - innerWidth,
          poolY
        );
        ctx.lineTo(poolX + innerWidth, poolY);
        ctx.bezierCurveTo(
          poolX + innerWidth * 1.2,
          poolY - (poolY - startY) * 0.3,
          startX + innerWidth * 0.5,
          startY + (poolY - startY) * 0.4 + Math.sin(time * 1.5) * 6,
          startX + innerWidth,
          startY
        );
        ctx.closePath();

        const coreGrad = ctx.createLinearGradient(startX, startY, poolX, poolY);
        coreGrad.addColorStop(0, 'rgba(255, 253, 231, 0.9)'); // White-hot core
        coreGrad.addColorStop(0.35, 'rgba(255, 215, 0, 0.95)'); // 24K gold
        coreGrad.addColorStop(0.85, 'rgba(255, 152, 0, 0.85)'); // Amber-gold
        coreGrad.addColorStop(1, 'rgba(255, 238, 88, 0.92)');
        ctx.fillStyle = coreGrad;
        ctx.shadowColor = '#FFF59D';
        ctx.shadowBlur = 18 * flowIntensity;
        ctx.fill();
        ctx.restore();

        // 2. Molten Pool Caustics & Liquid Ripples in Crucible
        const rippleCount = 3;
        for (let r = 0; r < rippleCount; r++) {
          const ripplePhase = (time * 0.8 + r * (Math.PI / 1.5)) % Math.PI;
          const rx = poolX + Math.sin(time * 0.6 + r) * 12;
          const ry = poolY + Math.cos(time * 0.4 + r) * 6;
          const radiusX = (30 + ripplePhase * 45) * flowIntensity;
          const radiusY = radiusX * 0.35; // Perspective oval
          const rippleAlpha = Math.max(0, Math.sin(ripplePhase) * 0.45 * flowIntensity);

          ctx.save();
          ctx.beginPath();
          ctx.ellipse(rx, ry, radiusX, radiusY, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 240, 180, ${rippleAlpha})`;
          ctx.lineWidth = 1.8;
          ctx.shadowColor = '#FFD54F';
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.restore();
        }
      }

      // 3. Render Rising Thermal Embers & Sparks
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life++;
        e.x += e.vx + Math.sin(time + i) * 0.4;
        e.y += e.vy;

        // Calculate fading based on lifespan
        const progress = e.life / e.maxLife;
        const currentAlpha = Math.sin(progress * Math.PI) * e.alpha;

        if (e.life >= e.maxLife || e.y < -20) {
          embers[i] = createEmber(true);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * (1 - progress * 0.3), 0, Math.PI * 2);

        // Color shifts from incandescent yellow to amber-red as it rises
        const lightness = 85 - progress * 35;
        ctx.fillStyle = `hsla(${e.hue}, 95%, ${lightness}%, ${currentAlpha})`;
        ctx.shadowColor = `hsla(${e.hue}, 95%, 65%, ${currentAlpha * 0.8})`;
        ctx.shadowBlur = e.size * 3.5;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [activeStageIndex, isReducedMotion]);

  const selectStage = useCallback((index: number) => {
    setActiveStageIndex(index);
  }, []);

  return (
    <div
      ref={containerRef}
      className="molten-bg-container"
      aria-label="Cinematic Gold Mining and Refining Background"
    >
      {/* 1. Visual Stage Image Layers (Extraction -> Smelting -> Molten Pour) */}
      {REFINING_STAGES.map((stage, index) => (
        <div
          key={stage.id}
          className={`molten-stage-layer ${index === activeStageIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${stage.image})` }}
          role="img"
          aria-label={stage.description}
        />
      ))}

      {/* 2. Furnace Thermodynamic Radiator Glow */}
      <div className="furnace-heat-radiator" aria-hidden="true" />

      {/* 3. Real-Time Molten Fluid Flow & Embers Canvas */}
      <canvas ref={canvasRef} className="molten-fluid-canvas" aria-hidden="true" />

      {/* 4. Deep Obsidian Chiaroscuro Vignette for High Readability */}
      <div className="molten-vignette-overlay" aria-hidden="true" />
      <div className="molten-bottom-fade" aria-hidden="true" />

      {/* 5. Refining Stage Storyline Navigation Bar */}
      <nav
        aria-label="Gold Refining Stages"
        className="refining-stage-nav"
        style={{ pointerEvents: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {REFINING_STAGES.map((stage, index) => {
            const isActive = index === activeStageIndex;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => selectStage(index)}
                className={`refining-stage-chip ${isActive ? 'active' : ''}`}
                aria-pressed={isActive}
                title={`${stage.name} — ${stage.description}`}
              >
                <span className="stage-dot" aria-hidden="true" />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  {stage.icon}
                  {stage.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Play/Pause Auto-Cycle Toggle */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause refining stage cycle' : 'Play refining stage cycle'}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-ivory-dim)',
            cursor: 'pointer',
            padding: '0.25rem 0.4rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color var(--transition-fast)',
            borderLeft: '1px solid rgba(196, 154, 90, 0.25)',
            marginLeft: '0.3rem',
            paddingLeft: '0.6rem',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory-dim)')}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>
      </nav>
    </div>
  );
};
