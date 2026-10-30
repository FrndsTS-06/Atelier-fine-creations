import React from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { Shield, Sparkles, Clock, HeartHandshake } from 'lucide-react';

export const BrandValues: React.FC = () => {
  const values = [
    {
      icon: <Shield size={24} />,
      title: 'Material Integrity',
      description:
        'Complete transparency regarding noble metal karatage, calibrated stone weights, and leather provenance with itemized documentation for every creation.',
    },
    {
      icon: <Clock size={24} />,
      title: 'Unrushed Discipline',
      description:
        'We resist accelerated production. Every curve, solder joint, movement gear, and edge burnish is allocated the bench time necessary to achieve enduring excellence.',
    },
    {
      icon: <Sparkles size={24} />,
      title: 'Enduring Proportion',
      description:
        'Our aesthetic language balances classical harmony and contemporary elegance, creating designs intended to be cherished across generations.',
    },
    {
      icon: <HeartHandshake size={24} />,
      title: 'Client Dedication',
      description:
        'Attentive bespoke consultations, transparent communication, and dedicated long-term care for every piece entrusted to our patrons.',
    },
  ];

  return (
    <section
      aria-label="Atelier Core Values"
      style={{
        padding: '6rem 0',
        backgroundColor: 'var(--color-obsidian)',
        borderBottom: '1px solid var(--color-obsidian-border)',
      }}
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="PILLARS OF OUR HOUSE"
            title="Core Principles"
            subtitle="The foundational values that guide our studio decisions, bench practices, and client relationships."
            centered
          />
        </RevealOnScroll>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '2.5rem',
          }}
        >
          {values.map((v, i) => (
            <RevealOnScroll key={i} delay={i * 90}>
              <div
                className="atelier-card"
                style={{
                  height: '100%',
                  padding: '2.25rem 2rem',
                backgroundColor: 'var(--color-obsidian-card)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-obsidian-border)',
                borderTop: '2px solid var(--color-champagne)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  color: 'var(--color-champagne)',
                  display: 'inline-flex',
                }}
              >
                {v.icon}
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  color: 'var(--color-ivory)',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {v.title}
              </h3>

              <p
                style={{
                  color: 'var(--color-ivory-dim)',
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {v.description}
              </p>
            </div>
          </RevealOnScroll>
        ))}
        </div>
      </Container>
    </section>
  );
};
