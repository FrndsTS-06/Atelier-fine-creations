import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGsapContext, gsap, prefersReducedMotion } from '../../utils/gsapConfig';
import { Flame, Sparkles, Mountain, Play, Pause, Activity } from 'lucide-react';

export interface RefiningStage {
  id: string;
  name: string;
  badge: string;
  image: string;
  temperature: string;
  tempValue: number;
  description: string;
  icon: React.ReactNode;
}

export const REFINING_STAGES: RefiningStage[] = [
  {
    id: 'pour',
    name: 'Molten Pour',
    badge: '03. 24K FLUID REFINING',
    image: '/images/mining/molten-gold-flowing.jpg',
    temperature: 'Liquid Stream 1040°C',
    tempValue: 1040,
    description: 'Continuous stream of glowing, incandescent 24K liquid gold poured from crucible to casting mold',
    icon: <Sparkles size={14} />,
  },
  {
    id: 'smelt',
    name: 'Foundry Furnace',
    badge: '02. 1064°C CRUCIBLE',
    image: '/images/mining/gold-furnace-crucible.jpg',
    temperature: 'Foundry Core 1064°C',
    tempValue: 1064,
    description: 'Atelier stone furnace heating raw gold into radiant, bubbling incandescent molten metal',
    icon: <Flame size={14} />,
  },
  {
    id: 'mine',
    name: 'Mined Bedrock',
    badge: '01. EXTRACTION',
    image: '/images/mining/gold-mine-bedrock.jpg',
    temperature: 'Subterranean 18°C',
    tempValue: 18,
    description: 'Natural 24K raw gold veins uncovered within subterranean obsidian rock formations',
    icon: <Mountain size={14} />,
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

interface GoldMeltingBackgroundProps {
  initialStageIndex?: number;
  autoPlay?: boolean;
  className?: string;
}

/**
 * GoldMeltingBackground
 * Photorealistic cinematic background showcasing real gold mining, furnace smelting,
 * and visibly flowing liquid molten gold with real-time fluid stream waves and thermal embers.
 */
export const GoldMeltingBackground: React.FC<GoldMeltingBackgroundProps> = ({
  initialStageIndex = 0, // Start on the dramatic molten gold pour
  autoPlay = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStageIndex, setActiveStageIndex] = useState(initialStageIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTemp, setCurrentTemp] = useState<number>(REFINING_STAGES[initialStageIndex].tempValue);
  const isReduced = prefersReducedMotion();

  // Subtle thermodynamic temperature sensor fluctuation
  useEffect(() => {
    const targetTemp = REFINING_STAGES[activeStageIndex].tempValue;
    const interval = setInterval(() => {
      const jitter = (Math.random() - 0.5) * 4;
      setCurrentTemp(Math.round(targetTemp + jitter));
    }, 1200);
    return () => clearInterval(interval);
  }, [activeStageIndex]);

  // Automatic refining stage cycle (8.5s per stage)
  useEffect(() => {
    if (!isPlaying || isReduced) return;

    const interval = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % REFINING_STAGES.length);
    }, 8500);

    return () => clearInterval(interval);
  }, [isPlaying, isReduced]);

  // Subtle GSAP scroll parallax depth without dimming text
  useGsapContext(containerRef, () => {
    if (!containerRef.current || isReduced) return;

    gsap.to(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current.parentElement || containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
      y: 60,
      scale: 0.98,
      ease: 'none',
    });
  }, []);

  // Real-Time Viscous Molten Gold Stream & Thermal Sparks Engine
  useEffect(() => {
    if (isReduced || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Initialize 42 glowing sparks & embers
    const emberCount = 42;
    const embers: EmberParticle[] = [];

    const createEmber = (bottomSpawn = false): EmberParticle => ({
      x: width * 0.52 + (Math.random() - 0.5) * (width * 0.45),
      y: bottomSpawn ? height * 0.92 + Math.random() * 25 : Math.random() * height,
      vx: (Math.random() - 0.48) * 0.8,
      vy: -(Math.random() * 1.6 + 0.75),
      size: Math.random() * 3.0 + 1.2,
      alpha: Math.random() * 0.75 + 0.25,
      maxLife: Math.random() * 180 + 100,
      life: bottomSpawn ? 0 : Math.random() * 180,
      hue: Math.random() > 0.55 ? 42 : 32, // Brilliant gold to warm amber
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

    // Continuous 60fps Fluid Render Loop
    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      time += 0.022;
      ctx.clearRect(0, 0, width, height);

      const activeStage = REFINING_STAGES[activeStageIndex];
      const isPour = activeStage.id === 'pour';
      const isSmelt = activeStage.id === 'smelt';

      // 1. Dynamic Liquid Gold Stream Wave Animation (Stage 3 & 2)
      if (isPour || isSmelt) {
        // Stream coordinates calibrated to match the crucible spout in molten-gold-flowing.jpg
        const startX = width * 0.54 + Math.sin(time * 0.7) * 3;
        const startY = height * 0.14;
        const poolX = width * 0.57;
        const poolY = height * 0.80;

        const baseWidth = width > 768 ? 26 : 16;
        const streamWidth = isPour ? baseWidth : baseWidth * 0.4;

        // Outer Incandescent Amber Heat Aura
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX - streamWidth * 1.8, startY);
        ctx.bezierCurveTo(
          startX - streamWidth * 0.9 + Math.sin(time * 1.8) * 6,
          startY + (poolY - startY) * 0.38,
          poolX - streamWidth * 2.2 + Math.cos(time * 1.4) * 8,
          poolY - (poolY - startY) * 0.25,
          poolX - streamWidth * 1.8,
          poolY
        );
        ctx.lineTo(poolX + streamWidth * 1.8, poolY);
        ctx.bezierCurveTo(
          poolX + streamWidth * 2.2 + Math.cos(time * 1.4) * 8,
          poolY - (poolY - startY) * 0.25,
          startX + streamWidth * 0.9 + Math.sin(time * 1.8) * 6,
          startY + (poolY - startY) * 0.38,
          startX + streamWidth * 1.8,
          startY
        );
        ctx.closePath();

        const amberGlow = ctx.createLinearGradient(startX, startY, poolX, poolY);
        amberGlow.addColorStop(0, 'rgba(255, 179, 0, 0.45)');
        amberGlow.addColorStop(0.45, 'rgba(230, 81, 0, 0.65)');
        amberGlow.addColorStop(1, 'rgba(255, 215, 0, 0.7)');
        ctx.fillStyle = amberGlow;
        ctx.shadowColor = '#FF9800';
        ctx.shadowBlur = 40;
        ctx.fill();
        ctx.restore();

        // Inner Molten White-Hot Liquid Gold Core
        ctx.save();
        ctx.beginPath();
        const coreWidth = streamWidth * 0.65;
        ctx.moveTo(startX - coreWidth, startY);
        ctx.bezierCurveTo(
          startX - coreWidth * 0.5 + Math.sin(time * 2.1) * 4,
          startY + (poolY - startY) * 0.38,
          poolX - coreWidth * 1.1 + Math.cos(time * 1.7) * 5,
          poolY - (poolY - startY) * 0.25,
          poolX - coreWidth,
          poolY
        );
        ctx.lineTo(poolX + coreWidth, poolY);
        ctx.bezierCurveTo(
          poolX + coreWidth * 1.1 + Math.cos(time * 1.7) * 5,
          poolY - (poolY - startY) * 0.25,
          startX + coreWidth * 0.5 + Math.sin(time * 2.1) * 4,
          startY + (poolY - startY) * 0.38,
          startX + coreWidth,
          startY
        );
        ctx.closePath();

        const coreGlow = ctx.createLinearGradient(startX, startY, poolX, poolY);
        coreGlow.addColorStop(0, 'rgba(255, 255, 245, 0.95)'); // Incandescent white-hot liquid core
        coreGlow.addColorStop(0.3, 'rgba(255, 225, 60, 0.98)'); // 24K pure gold
        coreGlow.addColorStop(0.75, 'rgba(255, 153, 0, 0.92)'); // Molten amber
        coreGlow.addColorStop(1, 'rgba(255, 235, 100, 0.96)');
        ctx.fillStyle = coreGlow;
        ctx.shadowColor = '#FFF59D';
        ctx.shadowBlur = 22;
        ctx.fill();
        ctx.restore();

        // 2. Liquid Molten Pool Waves & Concentric Ripples in Crucible / Mold
        const rippleCount = 4;
        for (let r = 0; r < rippleCount; r++) {
          const phase = (time * 0.9 + r * (Math.PI / 2)) % Math.PI;
          const rx = poolX + Math.sin(time * 0.7 + r) * 14;
          const ry = poolY + Math.cos(time * 0.5 + r) * 7;
          const radX = 35 + phase * 55;
          const radY = radX * 0.34; // Perspective oval
          const alpha = Math.max(0, Math.sin(phase) * 0.55);

          ctx.save();
          ctx.beginPath();
          ctx.ellipse(rx, ry, radX, radY, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 248, 200, ${alpha})`;
          ctx.lineWidth = 2.2;
          ctx.shadowColor = '#FFD54F';
          ctx.shadowBlur = 16;
          ctx.stroke();
          ctx.restore();
        }
      }

      // 3. Dynamic Rising Incandescent Gold Embers & Sparks
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life++;
        e.x += e.vx + Math.sin(time * 1.2 + i) * 0.55;
        e.y += e.vy;

        const progress = e.life / e.maxLife;
        const currentAlpha = Math.sin(progress * Math.PI) * e.alpha;

        if (e.life >= e.maxLife || e.y < -25) {
          embers[i] = createEmber(true);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * (1 - progress * 0.28), 0, Math.PI * 2);

        const lightness = 88 - progress * 35;
        ctx.fillStyle = `hsla(${e.hue}, 95%, ${lightness}%, ${currentAlpha})`;
        ctx.shadowColor = `hsla(${e.hue}, 95%, 65%, ${currentAlpha * 0.85})`;
        ctx.shadowBlur = e.size * 4;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [activeStageIndex, isReduced]);

  const selectStage = useCallback((index: number) => {
    setActiveStageIndex(index);
  }, []);

  const activeStage = REFINING_STAGES[activeStageIndex];

  return (
    <div
      ref={containerRef}
      className={`molten-bg-container ${className}`}
      aria-label="Cinematic Gold Mining and Molten Refining Background"
    >
      {/* 1. Cinematic Photographic Stage Layers (Cross-Dissolve Progression) */}
      {REFINING_STAGES.map((stage, index) => (
        <div
          key={stage.id}
          className={`molten-stage-layer ${index === activeStageIndex ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${stage.image})`,
            filter: 'brightness(0.96) contrast(1.08)',
          }}
          role="img"
          aria-label={stage.description}
        />
      ))}

      {/* 2. Furnace Thermodynamic Radiator Glow (Pulsing Amber Heat) */}
      <div className="furnace-heat-radiator" aria-hidden="true" />

      {/* 3. Real-Time Viscous Molten Liquid Gold Stream & Sparks Canvas */}
      <canvas ref={canvasRef} className="molten-fluid-canvas" aria-hidden="true" />

      {/* 4. Balanced Gradient Overlay (Darker left for text readability, luminous center & right) */}
      <div className="molten-vignette-overlay" aria-hidden="true" />

      {/* 5. Smooth Bottom Fade into Next Section */}
      <div className="molten-bottom-fade" aria-hidden="true" />

      {/* 6. Interactive Refining Telemetry & Stage Control HUD (Bottom Right) */}
      <div
        className="refining-stage-nav"
        style={{
          position: 'absolute',
          bottom: '1.75rem',
          right: '2rem',
          zIndex: 12,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'rgba(14, 12, 9, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(214, 174, 103, 0.35)',
          borderRadius: 'var(--radius-full)',
          padding: '0.45rem 1rem',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(214, 174, 103, 0.2)',
          pointerEvents: 'auto',
        }}
      >
        {/* Live Thermal Sensor Telemetry */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            paddingRight: '0.75rem',
            borderRight: '1px solid rgba(214, 174, 103, 0.25)',
            fontSize: '0.74rem',
            fontFamily: 'monospace',
            color: activeStage.tempValue > 500 ? '#FFB300' : '#81C784',
            fontWeight: 600,
          }}
        >
          <Activity size={13} className="animate-pulse" />
          <span>{currentTemp}°C</span>
        </div>

        {/* Stage Selector Chips */}
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
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(214, 174, 103, 0.4) 0%, rgba(180, 83, 9, 0.5) 100%)'
                    : 'transparent',
                  borderColor: isActive ? '#D6AE67' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#D8D0C4',
                  boxShadow: isActive ? '0 0 14px rgba(214, 174, 103, 0.35)' : 'none',
                }}
              >
                <span
                  className="stage-dot"
                  style={{
                    backgroundColor: isActive ? '#FFD700' : 'rgba(216, 208, 196, 0.4)',
                    boxShadow: isActive ? '0 0 8px #FFD700' : 'none',
                  }}
                  aria-hidden="true"
                />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem' }}>
                  {stage.icon}
                  {stage.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Play/Pause Cycle Control */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause refining stage cycle' : 'Play refining stage cycle'}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#D8D0C4',
            cursor: 'pointer',
            padding: '0.2rem 0.35rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color var(--transition-fast)',
            borderLeft: '1px solid rgba(214, 174, 103, 0.25)',
            marginLeft: '0.2rem',
            paddingLeft: '0.6rem',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#D6AE67')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#D8D0C4')}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>
      </div>
    </div>
  );
};
