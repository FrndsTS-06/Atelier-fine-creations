import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { LayeredImageScene } from '../common/LayeredImageScene';
import { GlassOverlay } from '../common/GlassOverlay';
import { ArrowRight, Compass, Sparkles, ShieldCheck } from 'lucide-react';
import { useGsapContext, gsap } from '../../utils/gsapConfig';

export const CraftsmanshipSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const workbenchRef = useRef<HTMLDivElement>(null);

  useGsapContext(sectionRef, () => {
    if (!workbenchRef.current) return;
    gsap.to(workbenchRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.4,
      },
      y: 36,
      ease: 'none',
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Atelier Craftsmanship Discipline"
      style={{
        padding: '7rem 0',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--color-obsidian-subtle)',
        borderBottom: '1px solid var(--color-obsidian-border)',
      }}
    >
      {/* Subtle Warm Amber Forge Reflection from Gold Smelting */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229, 142, 38, 0.08) 0%, rgba(196, 154, 90, 0.04) 40%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: '4.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Visual: Multi-Layer 2.5D Depth Scene */}
          <RevealOnScroll style={{ position: 'relative' }}>
            <div ref={workbenchRef}>
              <LayeredImageScene
                aspectRatio="4/3"
                maxTilt={6}
                layers={[
                  {
                    src: '/images/craftsmanship/artisan-workbench.jpg',
                    alt: 'Master Goldsmith at Wooden Workbench Hand-Forging 22K Gold Jewelry with Precision Tools and Loupe',
                    depth: 0.6,
                    translateZ: 10,
                    scale: 1.05,
                  },
                  {
                    depth: 0.9,
                    translateZ: 25,
                    element: (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(180deg, rgba(12, 11, 9, 0) 50%, rgba(12, 11, 9, 0.85) 100%)',
                        }}
                      />
                    ),
                  },
                  {
                    depth: 1.4,
                    translateZ: 45,
                    element: (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '1.25rem',
                          left: '1.25rem',
                          right: '1.25rem',
                        }}
                      >
                        <GlassOverlay
                          variant="elevated"
                          style={{
                            padding: '1.25rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                          }}
                        >
                          <div
                            style={{
                              color: 'var(--color-champagne)',
                              backgroundColor: 'rgba(196, 154, 90, 0.1)',
                              padding: '0.75rem',
                              borderRadius: 'var(--radius-xs)',
                              border: '1px solid rgba(196, 154, 90, 0.25)',
                              flexShrink: 0,
                            }}
                          >
                            <Compass size={24} />
                          </div>
                          <div>
                            <span
                              style={{
                                display: 'block',
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.15rem',
                                color: 'var(--color-ivory)',
                                fontWeight: 600,
                              }}
                            >
                              Place Vendôme Parisian Workshop
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-ivory-dim)', letterSpacing: '0.04em' }}>
                              Every setting, pivot, and seam is hand-executed under 10x microscopic scrutiny.
                            </span>
                          </div>
                        </GlassOverlay>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </RevealOnScroll>

          {/* Right Text Narrative */}
          <RevealOnScroll delay={150}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(196, 154, 90, 0.3)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(196, 154, 90, 0.08)',
                }}
              >
                <Sparkles size={14} style={{ color: 'var(--color-champagne)' }} />
                <span className="eyebrow-badge" style={{ fontSize: '0.72rem', letterSpacing: '0.18em' }}>
                  THE ATELIER DISCIPLINE
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)',
                  lineHeight: 1.15,
                  marginBottom: '1.5rem',
                  fontWeight: 600,
                  color: 'var(--color-ivory)',
                }}
              >
                Generational Mastery, <span className="text-gold-gradient">Unhurried Perfection.</span>
              </h2>

              <p
                className="text-subtle-serif"
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.75,
                  color: 'var(--color-ivory-muted)',
                  marginBottom: '1.5rem',
                }}
              >
                In our private Parisian workshop, time is measured not by clocks, but by the relentless pursuit of perfection. Each creation demands weeks of meticulous attention from master jewelers, certified horologists, and leather craftsmen whose skills have been honed across decades.
              </p>

              <p
                style={{
                  color: 'var(--color-ivory-dim)',
                  fontSize: '0.92rem',
                  lineHeight: 1.75,
                  marginBottom: '2.5rem',
                }}
              >
                From hand-selecting rare unheated sapphires to precision-turning balance wheels and hand-skiving full-grain French calfskin, our artisans preserve techniques unchanged since the golden age of European luxury.
              </p>

              {/* Distinctions Checklist */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginBottom: '2.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--color-champagne)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--color-ivory)' }}>
                    Authenticated 18K and 22K pure gold, verified with French state assay hallmark stamps.
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--color-champagne)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--color-ivory)' }}>
                    Chronometer calibers regulated across 5 positions and tested to ISO 3159 standards.
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--color-champagne)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--color-ivory)' }}>
                    Hand-stitched saddle seams using pure beeswax-dressed linen thread for century-long resilience.
                  </span>
                </div>
              </div>

              <Link to={ROUTES.ABOUT}>
                <Button variant="outline" size="lg" icon={<ArrowRight size={18} />}>
                  Discover Our Heritage
                </Button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </Container>
    </section>
  );
};
