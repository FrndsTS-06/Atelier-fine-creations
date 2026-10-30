import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { DepthImageCard } from '../common/DepthImageCard';
import { ArrowRight } from 'lucide-react';

export const CollectionHighlights: React.FC = () => {
  const collectionPanels = [
    {
      id: 'rings',
      title: 'Designer Rings',
      category: 'rings',
      description: 'Hand-forged 18K and 22K sculptural bands, bespoke diamond solitaires, and engraved signet crowns.',
      image: '/images/collections/designer-rings.jpg',
      alt: 'Atelier Fine Creations Designer Rings - 22K Gold and Cushion Diamond Halo Solitaire',
      tag: 'Haute Joaillerie',
    },
    {
      id: 'watches',
      title: 'Bespoke Watches',
      category: 'watches',
      description: 'Swiss-caliber mechanical chronometers featuring solid 18K gold casing and open tourbillon mechanics.',
      image: '/images/collections/bespoke-watches.jpg',
      alt: 'Atelier Fine Creations Bespoke Watches - 18K Solid Gold Open Skeleton Tourbillon Chronometer',
      tag: 'Haute Horlogerie',
    },
    {
      id: 'straps',
      title: 'Leather Watch Straps',
      category: 'straps',
      description: 'Saddle-stitched French calfskin and alligator leather straps fitted with hand-polished 18K solid gold hardware.',
      image: '/images/collections/leather-straps.jpg',
      alt: 'Atelier Fine Creations Leather Watch Straps - Handcrafted Cognac and Espresso Alligator Leather with Solid Gold Buckle',
      tag: 'Artisan Maroquinerie',
    },
  ];

  return (
    <section
      aria-label="Signature Collections"
      style={{
        padding: '6rem 0',
        backgroundColor: 'var(--color-obsidian-subtle)',
        borderTop: '1px solid var(--color-obsidian-border)',
        borderBottom: '1px solid var(--color-obsidian-border)',
      }}
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="DISTINCT CHAPTERS"
            title="Signature Collections"
            subtitle="Three disciplines of rare craftsmanship, united by precious noble materials and meticulous hand-finishing."
            centered
          />
        </RevealOnScroll>

        {/* Three 2.5D Depth Image Panels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '2.5rem',
          }}
        >
          {collectionPanels.map((panel, idx) => (
            <RevealOnScroll key={panel.id} delay={idx * 110} style={{ display: 'flex' }}>
              <Link
                to={`${ROUTES.GALLERY}?category=${panel.category}`}
                style={{ textDecoration: 'none', width: '100%', display: 'flex' }}
                aria-label={`Explore ${panel.title} in our collection gallery`}
              >
                <DepthImageCard
                  imageSrc={panel.image}
                  imageAlt={panel.alt}
                  badge={panel.tag}
                  title={panel.title}
                  description={panel.description}
                  aspectRatio="4/3"
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--color-champagne)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginTop: '1.25rem',
                    }}
                  >
                    <span>Explore {panel.title}</span>
                    <ArrowRight size={16} />
                  </div>
                </DepthImageCard>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
};
