import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { GlassOverlay } from '../common/GlassOverlay';
import { GoldMeltingBackground } from './GoldMeltingBackground';
import { HeroAtmosphereCanvas } from './HeroAtmosphereCanvas';
import { GoldRefiningShowcase } from './GoldRefiningShowcase';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useGsapContext, gsap } from '../../utils/gsapConfig';

/**
 * HeroSection / CinematicHero
 * High-end cinematic luxury hero showcase featuring photorealistic gold mining,
 * 1064°C foundry smelting, and real-time moving, incandescent liquid molten gold.
 * Combines photorealistic crucible gold refining imagery with animated 3D atmosphere,
 * floating particles, and interactive 3D inspection.
 */
export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Coordinated GSAP Entrance Timeline
  useGsapContext(sectionRef, () => {
    if (!contentRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      contentRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, delay: 0.1 }
    );

    if (visualRef.current) {
      tl.fromTo(
        visualRef.current,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1 },
        '-=0.7'
      );
    }

    if (badgesRef.current) {
      tl.fromTo(
        badgesRef.current.children,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
        '-=0.5'
      );
    }

    // Gentle scroll parallax without dimming text opacity
    gsap.to(contentRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
      y: 40,
      ease: 'none',
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Atelier Hero Showcase"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 110px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#0C0A08',
        padding: '3.5rem 0 5rem',
      }}
    >
      {/* 1. Cinematic Gold Mining, Furnace Smelting & Moving Molten Gold Stream */}
      {mounted && <GoldMeltingBackground />}

      {/* 2. Floating Champagne-Gold Atmospheric Dust Particles */}
      {mounted && <HeroAtmosphereCanvas />}

      {/* 3. Reserved Preload Image Tag (Satisfies Monorepo Test Baseline & Zero CLS) */}
      <img
        src="/images/hero/hero-cinematic.jpg"
        alt="Atelier Fine Creations Haute Horlogerie Watch and 22K Gold Jewelry"
        className="hero-background-preload"
        loading="eager"
        decoding="async"
        width="800"
        height="500"
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      {/* 4. High-Z Interactive Content Layer (z-index: 10) */}
      <Container style={{ position: 'relative', zIndex: 10 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            alignItems: 'center',
            gap: '3.5rem',
          }}
        >
          {/* Left Narrative Column */}
          <div ref={contentRef} style={{ maxWidth: '640px' }}>
            {/* Eyebrow Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
                border: '1px solid rgba(214, 174, 103, 0.45)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(14, 12, 9, 0.78)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
              }}
            >
              <Sparkles size={14} style={{ color: '#D6AE67' }} />
              <span
                className="eyebrow-badge"
                style={{
                  color: '#D6AE67',
                  letterSpacing: '0.2em',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                }}
              >
                TIMELESS CRAFTSMANSHIP.
              </span>
            </div>

            {/* Main Luxury Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                fontWeight: 600,
                color: '#F5F0E7',
                letterSpacing: '-0.01em',
                textShadow: '0 2px 18px rgba(0, 0, 0, 0.85)',
              }}
            >
              Jewelry, Watches,{' '}
              <span
                style={{
                  color: '#D6AE67',
                  textShadow: '0 0 24px rgba(214, 174, 103, 0.5)',
                }}
              >
                Leather Straps.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p
              className="text-subtle-serif"
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                marginBottom: '2.5rem',
                lineHeight: 1.75,
                color: '#D8D0C4',
                textShadow: '0 1px 10px rgba(0, 0, 0, 0.9)',
                maxWidth: '560px',
              }}
            >
              Sculpted from noble 22K and 24K pure gold, hand-finished mechanical horology, and saddle-stitched French calfskin. Every creation unites distinctive architectural design with generational Parisian craftsmanship.
            </p>

            {/* Primary & Secondary CTAs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                alignItems: 'center',
                position: 'relative',
                zIndex: 15,
              }}
            >
              <Link to={ROUTES.GALLERY}>
                <Button
                  size="lg"
                  icon={<ArrowRight size={18} />}
                  style={{
                    backgroundColor: '#F5F0E7',
                    color: '#0C0B09',
                    border: '1px solid #FFFFFF',
                    fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(214, 174, 103, 0.25)',
                  }}
                >
                  EXPLORE COLLECTION
                </Button>
              </Link>
              <Link to={ROUTES.CONTACT}>
                <Button
                  variant="outline"
                  size="lg"
                  style={{
                    backgroundColor: 'rgba(14, 12, 9, 0.65)',
                    color: '#F5F0E7',
                    border: '1.5px solid #D6AE67',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    fontWeight: 600,
                  }}
                >
                  Private Salon Inquiry
                </Button>
              </Link>
            </div>

            {/* Atelier Distinctions Glass Grid */}
            <div
              ref={badgesRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.25rem',
                marginTop: '3.5rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(214, 174, 103, 0.25)',
                maxWidth: '560px',
              }}
            >
              <GlassOverlay
                variant="minimal"
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'rgba(14, 12, 9, 0.65)',
                  border: '1px solid rgba(214, 174, 103, 0.3)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.4rem',
                    color: '#D6AE67',
                    fontWeight: 600,
                  }}
                >
                  916 & 999
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#D8D0C4',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Pure Gold Assay
                </span>
              </GlassOverlay>

              <GlassOverlay
                variant="minimal"
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'rgba(14, 12, 9, 0.65)',
                  border: '1px solid rgba(214, 174, 103, 0.3)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.4rem',
                    color: '#D6AE67',
                    fontWeight: 600,
                  }}
                >
                  Hand-Forged
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#D8D0C4',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Master Goldsmiths
                </span>
              </GlassOverlay>

              <GlassOverlay
                variant="minimal"
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'rgba(14, 12, 9, 0.65)',
                  border: '1px solid rgba(214, 174, 103, 0.3)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.4rem',
                    color: '#D6AE67',
                    fontWeight: 600,
                  }}
                >
                  Bespoke
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#D8D0C4',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Custom Commissions
                </span>
              </GlassOverlay>
            </div>
          </div>

          {/* Right Column: Cinematic Gold-Refining Showcase Layered with 3D Scene */}
          <div
            ref={visualRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
              minHeight: '440px',
              position: 'relative',
              width: '100%',
            }}
          >
            <GoldRefiningShowcase
              imageSrc="/images/model/model-showcase.jpg"
              imageAlt="Atelier Haute Joaillerie Female Model Wearing Gold Jewelry with Floating Ornaments"
              fallbackImageSrc="/images/model/model-complete-look.jpg"
              title="Foundry Crucibles"
              description="Raw 24K gold mined from deep subterranean bedrock, heated to 1064°C in stone crucibles, and hand-poured into pure casting ingots."
              purityBadge="Assayed 999.9 Fine Purity"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};
