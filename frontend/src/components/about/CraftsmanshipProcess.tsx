import React from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { Palette, Gem, Cog, Sparkles } from 'lucide-react';

export const CraftsmanshipProcess: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Design & Inspiration',
      subtitle: 'Conceptual Balance',
      icon: <Palette size={22} />,
      description:
        'Every creation begins with pencil studies, geometric blueprints, and proportional silhouettes. We balance ergonomic comfort with architectural presence, refining every contour until the piece feels natural to the hand and eye.',
    },
    {
      number: '02',
      title: 'Material Selection',
      subtitle: 'Noble Purity',
      icon: <Gem size={22} />,
      description:
        'We work strictly with authenticated 18K and 22K noble gold, calibrated diamonds, and certified gemstones. For our horology straps, we hand-select full-grain French calfskin and alligator hides chosen for their natural grain and supple durability.',
    },
    {
      number: '03',
      title: 'Precision Craftsmanship',
      subtitle: 'Artisanal Execution',
      icon: <Cog size={22} />,
      description:
        'Our artisans hand-forge gold forms at the bench, hand-seat gemstones with burnished prongs, assemble mechanical watch calibers with regulated escapements, and hand-stitch leather straps using two-needle saddle stitching.',
    },
    {
      number: '04',
      title: 'Finishing & Presentation',
      subtitle: 'Flawless Scrutiny',
      icon: <Sparkles size={22} />,
      description:
        'Final surfaces undergo multiple stages of hand-buffing, satin graining, and microscopic inspection. Each piece is hallmarked, serialized, and housed in a bespoke velvet-lined presentation box ready for generations of appreciation.',
    },
  ];

  return (
    <section
      aria-label="Atelier Craftsmanship Process"
      style={{
        padding: '6rem 0',
        backgroundColor: 'var(--color-obsidian-subtle)',
        borderBottom: '1px solid var(--color-obsidian-border)',
      }}
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="THE ATELIER DISCIPLINE"
            title="From Concept to Heirloom"
            subtitle="Four disciplined stages of craftsmanship that transform noble raw elements into timeless personal treasures."
            centered
          />
        </RevealOnScroll>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '2rem',
          }}
        >
          {steps.map((step, idx) => (
            <RevealOnScroll key={step.number} delay={idx * 100} style={{ display: 'flex' }}>
              <div
                className="atelier-card"
                style={{
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  backgroundColor: 'var(--color-obsidian-card)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-obsidian-border)',
                  position: 'relative',
                  transition: 'all var(--transition-normal)',
                }}
              >
              {/* Step Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    color: 'var(--color-champagne)',
                    backgroundColor: 'rgba(196, 154, 90, 0.08)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid rgba(196, 154, 90, 0.2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-hidden="true"
                >
                  {step.icon}
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2rem',
                    fontWeight: 600,
                    color: 'rgba(196, 154, 90, 0.35)',
                    lineHeight: 1,
                  }}
                >
                  {step.number}
                </span>
              </div>

              <span
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-champagne-light)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  marginBottom: '0.35rem',
                  display: 'block',
                }}
              >
                {step.subtitle}
              </span>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  color: 'var(--color-ivory)',
                  marginBottom: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  color: 'var(--color-ivory-dim)',
                  fontSize: '0.875rem',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {step.description}
              </p>
            </div>
          </RevealOnScroll>
        ))}
        </div>
      </Container>
    </section>
  );
};
