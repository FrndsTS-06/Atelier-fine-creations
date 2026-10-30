import React, { useRef } from 'react';
import { Container } from '../common/Container';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { LayeredImageScene } from '../common/LayeredImageScene';
import { GlassOverlay } from '../common/GlassOverlay';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { useGsapContext, gsap } from '../../utils/gsapConfig';

export const BrandStory: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGsapContext(sectionRef, () => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
      y: 40,
      ease: 'none',
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Atelier Brand Story & Workshop Narrative"
      style={{
        padding: '5rem 0',
        backgroundColor: 'var(--color-obsidian)',
        borderBottom: '1px solid var(--color-obsidian-border)',
      }}
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: '4.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Text Narrative */}
          <RevealOnScroll>
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
              <Sparkles size={13} style={{ color: 'var(--color-champagne)' }} />
              <span className="eyebrow-badge" style={{ fontSize: '0.7rem', letterSpacing: '0.18em' }}>
                ATELIER PHILOSOPHY
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                lineHeight: 1.15,
                marginBottom: '1.5rem',
                fontWeight: 600,
                color: 'var(--color-ivory)',
              }}
            >
              Dedicated to the Poetry of <span className="text-gold-gradient">Noble Materials</span>
            </h2>

            <p
              className="text-subtle-serif"
              style={{
                fontSize: '1.15rem',
                lineHeight: 1.75,
                color: 'var(--color-ivory-muted)',
                marginBottom: '1.35rem',
              }}
            >
              Atelier Fine Creations was founded on a singular commitment: to craft personal treasures with uncompromised integrity, quiet elegance, and enduring mechanical precision.
            </p>

            <p
              style={{
                color: 'var(--color-ivory-dim)',
                fontSize: '0.92rem',
                lineHeight: 1.75,
                marginBottom: '1.35rem',
              }}
            >
              Our work spans three closely intertwined disciplines: bespoke fine jewelry, hand-finished mechanical horology, and artisan leather goods. Rather than pursuing fleeting fashion cycles, our workshop prioritizes classical proportions, structural balance, and tactile comfort.
            </p>

            <p
              style={{
                color: 'var(--color-ivory-dim)',
                fontSize: '0.92rem',
                lineHeight: 1.75,
                marginBottom: '2.5rem',
              }}
            >
              Every gold bezel is hand-filed at the bench, every movement bridge is scrutinized under magnification, and every leather strap is hand-stitched with waxed linen thread. We believe true luxury resides in the quiet hours of benchwork that cannot be hurried.
            </p>

            {/* Atelier Disciplines Glass Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.25rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(196, 154, 90, 0.2)',
              }}
            >
              <div
                className="glass-badge"
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'flex-start',
                  padding: '1.15rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(196, 154, 90, 0.22)',
                  backgroundColor: 'rgba(255, 255, 255, 0.035)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                }}
              >
                <Compass size={20} style={{ color: 'var(--color-champagne)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-ivory)', marginBottom: '0.2rem' }}>
                    Fine Jewelry
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-ivory-dim)', margin: 0 }}>
                    18K & 22K pure gold sculptural bands & solitaires.
                  </p>
                </div>
              </div>

              <div
                className="glass-badge"
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'flex-start',
                  padding: '1.15rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(196, 154, 90, 0.22)',
                  backgroundColor: 'rgba(255, 255, 255, 0.035)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                }}
              >
                <ShieldCheck size={20} style={{ color: 'var(--color-champagne)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-ivory)', marginBottom: '0.2rem' }}>
                    Horology & Leather
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-ivory-dim)', margin: 0 }}>
                    Solid gold chronometers and saddle-stitched straps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Right Visual: Multi-Layer 2.5D Depth Scene */}
        <RevealOnScroll delay={150}>
          <div ref={imageRef} style={{ position: 'relative' }}>
            <LayeredImageScene
              aspectRatio="4/3"
              maxTilt={6}
              layers={[
                {
                  src: '/images/about/workshop.jpg',
                  alt: 'Atelier Fine Creations Workbench - Master Artisan Hand-Forging Jewelry with Precision Loupe and Tools',
                  depth: 0.6,
                  translateZ: 12,
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
                          'linear-gradient(180deg, rgba(12, 11, 9, 0) 50%, rgba(12, 11, 9, 0.82) 100%)',
                      }}
                    />
                  ),
                },
                {
                  depth: 1.5,
                  translateZ: 50,
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
                          padding: '1.15rem 1.4rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--color-ivory)', margin: 0 }}>
                            The Artisan Workbench
                          </h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-champagne)', margin: '0.15rem 0 0 0' }}>
                            Hand filing, flame welding & micro-setting discipline
                          </p>
                        </div>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-sans)',
                            letterSpacing: '0.14em',
                            color: 'var(--color-champagne-light)',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                          }}
                        >
                          Paris Atelier
                        </span>
                      </GlassOverlay>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </RevealOnScroll>
      </div>
    </Container>
    </section>
  );
};
