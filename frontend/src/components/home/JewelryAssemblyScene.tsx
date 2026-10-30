import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { Button } from '../common/Button';
import { GlassOverlay } from '../common/GlassOverlay';
import { useGsapContext, gsap, ScrollTrigger, prefersReducedMotion } from '../../utils/gsapConfig';
import { Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import * as THREE from 'three';

interface JewelryPiece {
  id: string;
  name: string;
  category: string;
  karatage: string;
  price: number;
  formattedPrice: string;
  image: string;
  description: string;
  bodyPlacement: string;
  specifications: string[];
  slug: string;
  target: {
    top: number; // % from top of model frame
    left: number; // % from left of model frame
    scale: number;
    rotate: number; // deg
  };
  initial: {
    x: number; // px offset
    y: number; // px offset
    z: number; // 3D depth in px
    scale: number;
    rotateX: number; // 3D pitch deg
    rotateY: number; // 3D yaw deg
    rotateZ: number; // 3D roll deg
  };
  scrollRange: [number, number]; // [start progress, end progress]
}

const JEWELRY_PIECES: JewelryPiece[] = [
  {
    id: 'piece-necklace',
    name: 'Atelier Fluid Torque Choker Necklace',
    category: 'Necklaces & Chokers',
    karatage: '22K Pure Gold (916 Purity)',
    price: 42500,
    formattedPrice: '$42,500',
    image: '/images/model/pieces/necklace.jpg',
    description: 'Sculptural, ergonomic collar hand-forged from molten 22K yellow gold, gracefully contours to the clavicle with a seamless magnetic hinge.',
    bodyPlacement: 'Decollété & Collarbone',
    specifications: ['Weight: 68.4g Pure Gold', 'Assay: 916 Government Certified', 'Finish: Satin Silk & Mirror Luster'],
    slug: 'fluid-torque-choker-necklace',
    target: { top: 39.5, left: 51.5, scale: 1.0, rotate: 0 },
    initial: { x: 35, y: -220, z: 120, scale: 1.30, rotateX: 18, rotateY: -12, rotateZ: -14 },
    scrollRange: [0.00, 0.22],
  },
  {
    id: 'piece-earrings',
    name: 'Sculptural Molten Gold Drop Earrings',
    category: 'Earrings & Solitaires',
    karatage: '22K Hand-Hammered Gold',
    price: 14800,
    formattedPrice: '$14,800',
    image: '/images/model/pieces/earrings.jpg',
    description: 'Organic molten drop earrings with textured gold nuggets that catch candlelight with fluid metallic reflections.',
    bodyPlacement: 'Left Earlobe',
    specifications: ['Weight: 14.8g per pair', 'Backing: 18K Solid Gold Clip-Post', 'Artisan: Place Vendôme Studio'],
    slug: 'sculptural-molten-gold-earrings',
    target: { top: 34.0, left: 42.5, scale: 0.88, rotate: 0 },
    initial: { x: -160, y: -140, z: 100, scale: 1.22, rotateX: -14, rotateY: 20, rotateZ: 18 },
    scrollRange: [0.03, 0.25],
  },
  {
    id: 'piece-watch',
    name: 'Haute Horlogerie Chronometer No. 01',
    category: 'Bespoke Watches',
    karatage: '18K Solid Gold & Alligator',
    price: 38500,
    formattedPrice: '$38,500',
    image: '/images/model/pieces/watch.jpg',
    description: 'Masterpiece skeleton timepiece displaying hand-beveled bridges, 21-jewel manual movement, and chocolate alligator strap.',
    bodyPlacement: 'Left Wrist',
    specifications: ['Case: 41mm 18K Solid Gold', 'Movement: AFC-01 Chronometer', 'Strap: Hand-Stitched French Leather'],
    slug: 'haute-horlogerie-chronometer-no-01',
    target: { top: 83.5, left: 51.0, scale: 1.02, rotate: 0 },
    initial: { x: -210, y: 110, z: 140, scale: 1.28, rotateX: 22, rotateY: -16, rotateZ: -20 },
    scrollRange: [0.06, 0.28],
  },
  {
    id: 'piece-bracelet',
    name: 'Hand-Forged 22K Curb Chain Bracelet',
    category: 'Bangles & Bracelets',
    karatage: '22K Gold & Diamond Clasp',
    price: 26800,
    formattedPrice: '$26,800',
    image: '/images/model/pieces/bracelet.jpg',
    description: 'Interlocking heavy-gauge 22K yellow gold curb links with double-safety box clasp paved with brilliant pavé diamonds.',
    bodyPlacement: 'Lower Wrist',
    specifications: ['Weight: 54.2g Pure Gold', 'Clasp: 1.4 ctw Pavé Diamonds', 'Length: 19.5 cm Custom Fit'],
    slug: 'hand-forged-22k-curb-chain-bracelet',
    target: { top: 82.5, left: 58.0, scale: 0.96, rotate: 0 },
    initial: { x: 180, y: 140, z: 110, scale: 1.25, rotateX: -16, rotateY: 18, rotateZ: 15 },
    scrollRange: [0.09, 0.31],
  },
  {
    id: 'piece-rings',
    name: 'Atelier Imperial 22K Signet & Solitaire Rings',
    category: 'Designer Rings',
    karatage: '22K Solid Gold & Diamonds',
    price: 9400,
    formattedPrice: '$9,400',
    image: '/images/model/pieces/ring.jpg',
    description: 'Sculptural signet crown and diamond eternity band worn in regal harmony on the hand.',
    bodyPlacement: 'Fingers & Knuckles',
    specifications: ['Metal: 22K Gold (916 Hallmarked)', 'Diamonds: VVS Round Brilliant', 'Sizing: Complimentary Atelier Fitting'],
    slug: 'atelier-imperial-22k-signet-ring',
    target: { top: 81.0, left: 81.0, scale: 0.9, rotate: 0 },
    initial: { x: 230, y: 35, z: 130, scale: 1.20, rotateX: 20, rotateY: -14, rotateZ: -16 },
    scrollRange: [0.12, 0.34],
  },
];

const STAGES = [
  { step: 'I', label: 'THE COLLECTION', subtitle: 'Ornaments in Suspended Equilibrium' },
  { step: 'II', label: 'THE ARRIVAL', subtitle: 'Gravitational Descent of 22K Pure Gold' },
  { step: 'III', label: 'THE ARRANGEMENT', subtitle: 'Anatomical Precision Alignment' },
  { step: 'IV', label: 'THE COMPLETE LOOK', subtitle: 'The Haute Joaillerie Masterpiece Assembled' },
  { step: 'V', label: 'DISCOVER THE SUITE', subtitle: 'Explore the Place Vendôme Vault' },
];

export const JewelryAssemblyScene: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const modelWrapperRef = useRef<HTMLDivElement>(null);
  const completeLookRef = useRef<HTMLImageElement>(null);
  const piecesRefs = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLElement>(null);
  const activeStageRef = useRef(1);
  const showDrawerRef = useRef(false);

  const [activeStage, setActiveStage] = useState(1);
  const [selectedPiece, setSelectedPiece] = useState<JewelryPiece>(JEWELRY_PIECES[0]);
  const [isReduced, setIsReduced] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    setIsReduced(prefersReducedMotion());
  }, []);

  // 1. Lightweight 3D Three.js Ambient Gold Dust & Lighting Canvas
  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current || prefersReducedMotion()) return;

    const container = canvasRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 100;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Floating 3D Gold Flecks
    const particleCount = 65;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      speeds[i] = Math.random() * 0.08 + 0.035;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const ctx = pCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 225, 160, 0.95)');
      grad.addColorStop(0.35, 'rgba(214, 174, 103, 0.45)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(pCanvas);

    const material = new THREE.PointsMaterial({
      color: 0xe8c78a,
      size: 4.2,
      map: texture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += speeds[i];
        pos[i * 3] += Math.sin(Date.now() * 0.002 + i) * 0.03;
        if (pos[i * 3 + 1] > 60) pos[i * 3 + 1] = -60;
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2. Coordinated GSAP ScrollTrigger Animation Timeline (Extreme Speed & 3D Fluidity)
  useGsapContext(containerRef, () => {
    if (!containerRef.current || !stickyRef.current || prefersReducedMotion()) return;

    // Pinning Master Timeline — complete assembly within ~480px of scroll, scrub 0.1 for instant reaction
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=480',
      pin: stickyRef.current,
      scrub: 0.1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Direct DOM updates for zero-lag progress display (bypassing React component re-renders)
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${Math.round(progress * 100)}%`;
        }
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `${Math.round(progress * 100)}%`;
        }

        // Discrete stage mapping: updates React state ONLY when stage actually transitions
        let newStage = 1;
        if (progress < 0.04) newStage = 1;
        else if (progress < 0.18) newStage = 2;
        else if (progress < 0.32) newStage = 3;
        else if (progress < 0.44) newStage = 4;
        else newStage = 5;

        if (newStage !== activeStageRef.current) {
          activeStageRef.current = newStage;
          setActiveStage(newStage);
        }

        // Show collection drawer automatically in stage 5
        const newDrawer = progress >= 0.42;
        if (newDrawer !== showDrawerRef.current) {
          showDrawerRef.current = newDrawer;
          setShowDrawer(newDrawer);
        }

        // Rapid 3D parabolic descent with simultaneous multi-piece flight
        JEWELRY_PIECES.forEach((piece, idx) => {
          const el = piecesRefs.current[idx];
          if (!el) return;

          const [startP, endP] = piece.scrollRange;
          let pieceProgress = 0;

          if (progress <= startP) {
            pieceProgress = 0;
          } else if (progress >= endP) {
            pieceProgress = 1;
          } else {
            pieceProgress = (progress - startP) / (endP - startP);
          }

          // Strong natural acceleration with rapid, crisp snap deceleration
          const easeProgress = gsap.parseEase('power4.out')(pieceProgress);

          // Subtle micro-settle (1.4px) that instantly locks in without wobble
          let settleX = 0;
          let settleY = 0;
          let settleScale = 0;
          if (pieceProgress > 0.80 && pieceProgress <= 1.0) {
            const normSettle = (pieceProgress - 0.80) / 0.20;
            const settleWave = Math.sin(normSettle * Math.PI) * (1 - normSettle);
            settleY = settleWave * 1.4;
            settleX = settleWave * -0.4;
            settleScale = settleWave * 0.01;
          }

          // 3D coordinates interpolation
          const currentX = piece.initial.x * (1 - easeProgress) + settleX;
          const currentY = piece.initial.y * (1 - easeProgress) + settleY;
          const currentZ = piece.initial.z * (1 - easeProgress);
          const currentRotateX = piece.initial.rotateX * (1 - easeProgress);
          const currentRotateY = piece.initial.rotateY * (1 - easeProgress);
          const currentRotateZ = piece.initial.rotateZ * (1 - easeProgress);
          const currentScale = (piece.initial.scale - (piece.initial.scale - 1) * easeProgress) + settleScale;

          // Direct parabolic flight with minimal arc detour
          const arcHeight = Math.sin(pieceProgress * Math.PI) * -8;

          el.style.transform = `perspective(900px) translate3d(${currentX.toFixed(1)}px, ${(currentY + arcHeight).toFixed(1)}px, ${currentZ.toFixed(1)}px) rotateX(${currentRotateX.toFixed(1)}deg) rotateY(${currentRotateY.toFixed(1)}deg) rotateZ(${currentRotateZ.toFixed(1)}deg) scale(${currentScale.toFixed(3)})`;

          // Fade out individual floating markers as complete look seamlessly takes over
          if (progress > 0.30) {
            const fade = Math.max(0, 1 - (progress - 0.30) / 0.08);
            el.style.opacity = fade.toFixed(2);
          } else {
            el.style.opacity = '1';
          }
        });

        // Rapid Seamless Complete Look Crossfade
        if (completeLookRef.current) {
          if (progress <= 0.28) {
            completeLookRef.current.style.opacity = '0';
          } else if (progress >= 0.38) {
            completeLookRef.current.style.opacity = '1';
          } else {
            const crossfade = (progress - 0.28) / (0.38 - 0.28);
            completeLookRef.current.style.opacity = crossfade.toFixed(3);
          }
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Handler to jump to any stage manually
  const jumpToStage = (stageNum: number) => {
    if (!containerRef.current) return;
    const progressMap = [0.00, 0.12, 0.26, 0.38, 0.58];
    const targetP = progressMap[stageNum - 1];
    const scrollY = containerRef.current.offsetTop + targetP * 480;
    window.scrollTo({ top: scrollY, behavior: 'smooth' });
    setActiveStage(stageNum);
  };

  return (
    <section
      ref={containerRef}
      id="jewelry-assembly"
      aria-label="Atelier Haute Joaillerie Model Assembly Showcase"
      style={{
        position: 'relative',
        height: isReduced ? 'auto' : '1100px',
        backgroundColor: '#070605',
        color: 'var(--color-ivory)',
        overflow: 'clip',
      }}
    >
      {/* Sticky Full-Viewport Stage */}
      <div
        ref={stickyRef}
        style={{
          position: isReduced ? 'relative' : 'sticky',
          top: 0,
          height: isReduced ? 'auto' : '100vh',
          minHeight: '700px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '1.25rem 1.5rem',
          background:
            'radial-gradient(circle 800px at 50% 45%, rgba(196, 154, 90, 0.12) 0%, rgba(34, 22, 15, 0.35) 45%, #070605 85%)',
        }}
      >
        {/* Ambient WebGL 3D Particles Atmosphere */}
        <div
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.85,
          }}
        />

        {/* 1. Header Navigation Bar of the Assembly Scene */}
        <div
          style={{
            width: '100%',
            maxWidth: '1360px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 25,
            paddingBottom: '0.75rem',
            borderBottom: '1px solid rgba(196, 154, 90, 0.18)',
          }}
        >
          {/* Section Brand Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#D6AE67',
                boxShadow: '0 0 10px #D6AE67',
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                letterSpacing: '0.12em',
                color: '#F5F0E7',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Haute Joaillerie Campaign • Model Assembly
            </span>
          </div>

          {/* Interactive Stage Step Indicator */}
          <nav
            aria-label="Jewelry Assembly Stages"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(12, 11, 9, 0.8)',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(196, 154, 90, 0.3)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {STAGES.map((s, idx) => {
              const stageNum = idx + 1;
              const isActive = activeStage === stageNum;
              return (
                <button
                  key={s.step}
                  onClick={() => jumpToStage(stageNum)}
                  aria-label={`Jump to Stage ${s.step}: ${s.label}`}
                  style={{
                    background: isActive ? '#D6AE67' : 'transparent',
                    color: isActive ? '#0C0B09' : '#D8C4A8',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>{s.step}</span>
                  <span className="hidden-mobile-sm">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 2. Central Model Portrait & Floating Jewelry Assembly Stage */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            margin: '0.5rem 0',
          }}
        >
          {/* Atmospheric Backlight Halo */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '460px',
              height: '580px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(214, 174, 103, 0.28) 0%, rgba(214, 174, 103, 0.08) 50%, transparent 75%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Model Frame with Pixel-Aligned Dual Photos */}
          <div
            ref={modelWrapperRef}
            style={{
              position: 'relative',
              width: 'min(90vw, 480px)',
              aspectRatio: '3/4',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow:
                '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(214, 174, 103, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              border: '1.5px solid rgba(214, 174, 103, 0.45)',
              backgroundColor: '#0A0907',
              zIndex: 5,
            }}
          >
            {/* Base Pose: Elegant Model Without Jewelry */}
            <img
              src="/images/model/model-base-pose.jpg"
              alt="Atelier Fashion Model in Haute Couture Black Gown"
              loading="eager"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Complete Look: Exact Model Wearing All 5 Assembled Jewelry Pieces */}
            <img
              ref={completeLookRef}
              src="/images/model/model-complete-look.jpg"
              alt="Atelier Fashion Model Wearing Complete 22K Haute Joaillerie Suite and 18K Mechanical Chronometer"
              loading="eager"
              decoding="async"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isReduced ? 1 : 0,
                transition: isReduced ? 'none' : 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: 'none',
              }}
            />

            {/* Soft Ambient Rim Light Filter Over Model */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 50% 25%, transparent 60%, rgba(12, 10, 8, 0.5) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Individual Floating / Landing Jewelry Pieces Over Model Coordinates */}
            {JEWELRY_PIECES.map((piece, idx) => (
              <div
                key={piece.id}
                ref={(el) => (piecesRefs.current[idx] = el)}
                onClick={() => setSelectedPiece(piece)}
                onMouseEnter={() => setSelectedPiece(piece)}
                style={{
                  position: 'absolute',
                  top: `${piece.target.top}%`,
                  left: `${piece.target.left}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20 + idx,
                  cursor: 'pointer',
                  pointerEvents: activeStage >= 4 ? 'none' : 'auto',
                  transition: 'filter 0.14s ease',
                  filter:
                    selectedPiece.id === piece.id
                      ? 'drop-shadow(0 0 16px rgba(214, 174, 103, 0.95))'
                      : 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.8))',
                }}
                aria-label={`Inspect ${piece.name}`}
              >
                {/* Floating Miniature Jewel Component — 1.0s rapid levitation cycle */}
                <div
                  style={{
                    position: 'relative',
                    width: idx === 0 ? '90px' : idx === 2 ? '64px' : '52px',
                    aspectRatio: '1/1',
                    borderRadius: '50%',
                    padding: '2px',
                    background:
                      'radial-gradient(circle, rgba(255, 230, 180, 0.4) 0%, rgba(214, 174, 103, 0.2) 60%, transparent 100%)',
                    animation: isReduced ? 'none' : 'jewelFloatCycle 1s ease-in-out infinite',
                    animationDelay: `${(idx * 0.12).toFixed(2)}s`,
                  }}
                >
                  <img
                    src={piece.image}
                    alt={piece.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '50%',
                      mixBlendMode: 'screen', // Screen blend mode blends pure black into perfect transparent glass
                      filter: 'contrast(1.15) brightness(1.1)',
                      display: 'block',
                    }}
                  />
                  {/* Subtle Precision Target Beacon Marker */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#D6AE67',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 8px #FFF, 0 0 16px #D6AE67',
                      opacity: activeStage < 4 ? 0.75 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Left Narrative Glass Panel: Current Stage & Lore */}
          <div
            className="hidden-mobile"
            style={{
              position: 'absolute',
              left: '2rem',
              maxWidth: '310px',
              zIndex: 15,
            }}
          >
            <GlassOverlay
              variant="elevated"
              blur={20}
              style={{
                padding: '1.5rem',
                backgroundColor: 'rgba(14, 12, 9, 0.82)',
                border: '1.5px solid rgba(214, 174, 103, 0.35)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#D6AE67',
                  fontSize: '0.72rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                }}
              >
                <Sparkles size={13} />
                <span>Stage {STAGES[activeStage - 1].step} of V</span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.45rem',
                  color: '#F5F0E7',
                  lineHeight: 1.2,
                  marginBottom: '0.65rem',
                  fontWeight: 600,
                }}
              >
                {STAGES[activeStage - 1].label}
              </h3>

              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#D8D0C4',
                  lineHeight: 1.6,
                  margin: 0,
                  marginBottom: '1rem',
                }}
              >
                {activeStage === 1 &&
                  'The model stands in the dark Parisian salon. Noble 22K gold creations float in gravitational equilibrium, awaiting their descent.'}
                {activeStage === 2 &&
                  'As you scroll, each individual gold piece descends through the atmospheric studio air with graceful rotational physics and metallic reflections.'}
                {activeStage === 3 &&
                  'Each piece aligns perfectly with its anatomical destination—the fluid torque choker onto the neck, chronometer onto the wrist, and rings onto the fingers.'}
                {activeStage === 4 &&
                  'All 5 bespoke creations unite in complete harmony. The Haute Joaillerie ensemble radiates with incandescent warm golden luster.'}
                {activeStage === 5 &&
                  'The suite is assembled. Discover the provenance, weight, and acquisition details of each individual heirloom creation.'}
              </p>

              {/* Scroll Scrub Progress Bar */}
              <div style={{ width: '100%', height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  ref={progressBarRef}
                  style={{
                    height: '100%',
                    width: '0%',
                    backgroundColor: '#D6AE67',
                    boxShadow: '0 0 8px #D6AE67',
                    transition: 'width 0.04s linear',
                  }}
                />
              </div>
            </GlassOverlay>
          </div>

          {/* Right Product Inspector Glass Card: Focused Piece Details */}
          <div
            className="hidden-mobile"
            style={{
              position: 'absolute',
              right: '2rem',
              maxWidth: '320px',
              zIndex: 15,
            }}
          >
            <GlassOverlay
              variant="elevated"
              blur={20}
              style={{
                padding: '1.5rem',
                backgroundColor: 'rgba(14, 12, 9, 0.85)',
                border: '1.5px solid rgba(214, 174, 103, 0.35)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
              }}
            >
              <div
                key={selectedPiece.id}
                style={{
                  animation: isReduced ? 'none' : 'cardRevealFast 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: '1px solid rgba(214, 174, 103, 0.3)',
                      backgroundColor: '#000',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={selectedPiece.image}
                      alt={selectedPiece.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        letterSpacing: '0.12em',
                        color: '#D6AE67',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        display: 'block',
                      }}
                    >
                      {selectedPiece.category}
                    </span>
                    <h4
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem',
                        color: '#F5F0E7',
                        lineHeight: 1.2,
                        margin: '0.2rem 0',
                      }}
                    >
                      {selectedPiece.name}
                    </h4>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '0.85rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(214, 174, 103, 0.2)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#D8C4A8' }}>{selectedPiece.karatage}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.35rem',
                      color: '#F5F0E7',
                      fontWeight: 600,
                    }}
                  >
                    {selectedPiece.formattedPrice}
                  </span>
                </div>

                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    color: '#D8D0C4',
                    marginBottom: '1rem',
                  }}
                >
                  {selectedPiece.specifications.map((spec, sIdx) => (
                    <li key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Check size={12} style={{ color: '#D6AE67', flexShrink: 0 }} />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <Link to={ROUTES.GALLERY} style={{ flex: 1 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      style={{
                        width: '100%',
                        borderColor: '#D6AE67',
                        color: '#F5F0E7',
                        fontSize: '0.74rem',
                        transition: 'all 0.22s ease',
                      }}
                    >
                      View in Gallery
                    </Button>
                  </Link>
                  <Link to={ROUTES.CONTACT}>
                    <Button
                      size="sm"
                      style={{
                        backgroundColor: '#D6AE67',
                        color: '#0C0B09',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        transition: 'all 0.22s ease',
                      }}
                    >
                      Inquire
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassOverlay>
          </div>
        </div>

        {/* 3. Bottom Assembly Control Bar & Stage 5 Collection Drawer */}
        <div
          style={{
            width: '100%',
            maxWidth: '1360px',
            position: 'relative',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {/* Stage 5 Full-Suite Unfold Tray */}
          {showDrawer && (
            <div
              className="assembly-suite-drawer"
              style={{
                width: '100%',
                padding: '1.25rem 1.5rem',
                backgroundColor: 'rgba(12, 10, 8, 0.94)',
                border: '1.5px solid rgba(214, 174, 103, 0.45)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(214, 174, 103, 0.25)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                animation: 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              {JEWELRY_PIECES.map((piece) => (
                <div
                  key={piece.id}
                  onClick={() => setSelectedPiece(piece)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor:
                      selectedPiece.id === piece.id ? 'rgba(214, 174, 103, 0.15)' : 'transparent',
                    border:
                      selectedPiece.id === piece.id
                        ? '1px solid rgba(214, 174, 103, 0.6)'
                        : '1px solid rgba(214, 174, 103, 0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <img
                    src={piece.image}
                    alt={piece.name}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      objectFit: 'contain',
                      backgroundColor: '#000',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: '#F5F0E7',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {piece.name}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#D6AE67', fontWeight: 600 }}>
                      {piece.formattedPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Bar: Action CTAs and Scroll Instruction */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              fontSize: '0.78rem',
              color: '#D8C4A8',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} style={{ color: '#D6AE67' }} />
                <span>BIS 916 & 999 French Assay Certified</span>
              </span>
              <span className="hidden-mobile" style={{ color: 'rgba(255, 255, 255, 0.2)' }}>
                |
              </span>
              <span className="hidden-mobile">
                Scroll progress: <strong ref={progressTextRef}>0%</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to={ROUTES.GALLERY}>
                <Button
                  size="sm"
                  icon={<ArrowRight size={14} />}
                  style={{
                    backgroundColor: '#D6AE67',
                    color: '#0C0B09',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '0.5rem 1.25rem',
                    transition: 'all 0.14s ease',
                  }}
                >
                  EXPLORE FULL GALLERY
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes jewelFloatCycle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-3px) rotate(0.8deg);
          }
        }
        @keyframes cardRevealFast {
          from {
            opacity: 0;
            transform: translateY(4px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (max-width: 960px) {
          .hidden-mobile {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .hidden-mobile-sm {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
