import React from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { Hammer, ShieldCheck, Clock, Sparkles } from 'lucide-react';

export const BrandBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <Hammer size={26} strokeWidth={1.5} />,
      title: 'Craftsmanship',
      subtitle: 'Artisanal Discipline',
      description:
        'Every creation is formed by experienced goldsmiths and horologists using time-honored bench techniques alongside modern precision engineering.',
    },
    {
      icon: <ShieldCheck size={26} strokeWidth={1.5} />,
      title: 'Quality',
      subtitle: 'Material Integrity',
      description:
        'We work exclusively with certified 18K, 22K, and 24K pure noble metals, calibrated diamonds, and carefully selected vegetable-tanned leathers.',
    },
    {
      icon: <Clock size={26} strokeWidth={1.5} />,
      title: 'Timeless Design',
      subtitle: 'Enduring Proportion',
      description:
        'Guided by classical geometric harmony and balanced proportions, our designs transcend fleeting trends to remain relevant across eras.',
    },
    {
      icon: <Sparkles size={26} strokeWidth={1.5} />,
      title: 'Attention to Detail',
      subtitle: 'Meticulous Finishing',
      description:
        'From micro-beveled movement bridges to hand-burnished prong settings and saddle-stitched strap edges, every surface receives rigorous scrutiny.',
    },
  ];

  return (
    <section
      aria-label="Atelier Guiding Principles"
      style={{
        padding: '6rem 0',
        backgroundColor: 'var(--color-obsidian)',
        borderBottom: '1px solid var(--color-obsidian-border)',
      }}
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="OUR PHILOSOPHY"
            title="Guiding Principles"
            subtitle="A quiet dedication to foundational excellence, where noble materials meet meticulous hand execution."
            centered
          />
        </RevealOnScroll>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: '2rem',
          }}
        >
          {benefits.map((item, idx) => (
            <RevealOnScroll key={idx} delay={idx * 90} style={{ display: 'flex' }}>
              <div
                className="atelier-card glass-panel"
                style={{
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: '100%',
                  backgroundColor: 'rgba(22, 20, 16, 0.75)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(196, 154, 90, 0.2)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                  transition: 'all var(--transition-normal)',
                }}
              >
              {/* Icon Container */}
              <div
                style={{
                  color: 'var(--color-champagne)',
                  marginBottom: '1.5rem',
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'rgba(196, 154, 90, 0.08)',
                  border: '1px solid rgba(196, 154, 90, 0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-hidden="true"
              >
                {item.icon}
              </div>

              <span
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-champagne-light)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  marginBottom: '0.35rem',
                  display: 'block',
                }}
              >
                {item.subtitle}
              </span>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  color: 'var(--color-ivory)',
                  marginBottom: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color: 'var(--color-ivory-dim)',
                  fontSize: '0.875rem',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {item.description}
              </p>
            </div>
          </RevealOnScroll>
        ))}
        </div>
      </Container>
    </section>
  );
};
