import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/routePaths';
import { Container } from '../components/common/Container';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { RevealOnScroll } from '../components/common/RevealOnScroll';
import { ParallaxImage } from '../components/common/ParallaxImage';
import { GlassOverlay } from '../components/common/GlassOverlay';
import { BrandStory } from '../components/about/BrandStory';
import { CraftsmanshipProcess } from '../components/about/CraftsmanshipProcess';
import { BrandValues } from '../components/about/BrandValues';
import { PageMetadata } from '../components/seo/PageMetadata';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-obsidian)',
        color: 'var(--color-ivory)',
        minHeight: '100vh',
      }}
    >
      <PageMetadata
        title="A Passion for Timeless Craftsmanship — Atelier Fine Creations"
        description="Discover the craftsmanship philosophy of Atelier Fine Creations: fine jewelry, bespoke mechanical horology, and artisan leather straps forged with generational mastery."
        canonicalPath="/about"
        ogType="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'A Passion for Timeless Craftsmanship',
          url: 'https://www.aurelien.gold/about',
          description: 'Generational craftsmanship in 18K/22K gold jewelry, bespoke mechanical horology, and hand-finished leather watch straps.',
          publisher: {
            '@type': 'Organization',
            name: 'Atelier Fine Creations',
            url: 'https://www.aurelien.gold',
            logo: 'https://www.aurelien.gold/favicon.svg',
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.aurelien.gold/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'About Us',
                item: 'https://www.aurelien.gold/about',
              },
            ],
          },
        }}
      />

      {/* Header & Introductory Hero */}
      <section
        style={{
          padding: '1.5rem 0 5rem',
          borderBottom: '1px solid var(--color-obsidian-border)',
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 50% 30%, rgba(196, 154, 90, 0.08) 0%, transparent 70%)',
        }}
      >
        <Container>
          {/* Section 1: Breadcrumb: Home / About Us */}
          <Breadcrumbs
            items={[
              { label: 'Home', path: ROUTES.HOME },
              { label: 'About Us' },
            ]}
          />

          {/* Section 2: Exact Heading: A Passion for Timeless Craftsmanship. */}
          <RevealOnScroll>
            <div style={{ maxWidth: '820px', margin: '2rem auto 0', textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  marginBottom: '1rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(196, 154, 90, 0.08)',
                  border: '1px solid rgba(196, 154, 90, 0.25)',
                }}
              >
                <Sparkles size={13} style={{ color: 'var(--color-champagne)' }} />
                <span className="eyebrow-badge" style={{ fontSize: '0.7rem' }}>
                  ATELIER HERITAGE & VISION
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
                  lineHeight: 1.12,
                  marginBottom: '1.5rem',
                  fontWeight: 600,
                  color: 'var(--color-ivory)',
                }}
              >
                A Passion for <span className="text-gold-gradient">Timeless Craftsmanship.</span>
              </h1>

              {/* Section 3: Brand Introduction */}
              <p
                className="text-subtle-serif"
                style={{
                  fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
                  lineHeight: 1.8,
                  color: 'var(--color-ivory-muted)',
                  margin: '0 auto',
                }}
              >
                Atelier Fine Creations unites the disciplines of haute joaillerie, bespoke watchmaking, and fine leathercraft. Guided by classical geometry and unhurried bench discipline, our studio creates enduring objects of beauty destined to become personal heirlooms.
              </p>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* Section 4: Workshop Photography and Craftsmanship Narrative */}
      <BrandStory />

      {/* Editorial Parallax Break: Paris Design Studio */}
      <section
        aria-label="Atelier Place Vendôme Studio Environment"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid var(--color-obsidian-border)',
        }}
      >
        <ParallaxImage
          src="/images/about/design-studio.jpg"
          alt="Atelier Fine Creations Paris Design Studio at Place Vendôme"
          aspectRatio="21/9"
          speed={0.25}
          overlay={
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 50% 50%, rgba(12, 11, 9, 0.35) 0%, rgba(12, 11, 9, 0.85) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
              }}
            >
              <GlassOverlay
                variant="gold-rim"
                style={{
                  padding: '1.75rem 2.5rem',
                  maxWidth: '680px',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.22em',
                    color: 'var(--color-champagne)',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  PLACE VENDÔME • 75001 PARIS
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                    color: 'var(--color-ivory)',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                  }}
                >
                  The Sanctum of Precision Horology & Fine Jewelry
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-ivory-dim)', margin: 0 }}>
                  A century of undisturbed mastery where every precious stone is handset and every balance wheel is regulated by hand.
                </p>
              </GlassOverlay>
            </div>
          }
        />
      </section>

      {/* Sections 5, 6, 7, 8: Design & Inspiration, Materials, Precision, Finishing */}
      <CraftsmanshipProcess />

      {/* Section 9: Brand Values */}
      <BrandValues />

      {/* Section 10: CTA to Gallery and Contact */}
      <section
        aria-label="Atelier Exploration and Consultation Inquiries"
        style={{
          padding: '6rem 0',
          backgroundColor: 'var(--color-obsidian-subtle)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Container>
          <RevealOnScroll>
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <span
                className="eyebrow-badge"
                style={{ display: 'inline-block', marginBottom: '0.85rem' }}
              >
                BEGIN YOUR COMMISSIONS
              </span>

              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  marginBottom: '1rem',
                  color: 'var(--color-ivory)',
                  fontWeight: 600,
                }}
              >
                Experience the <span className="text-gold-gradient">Atelier Creations</span>
              </h2>

              <p
                className="text-subtle-serif"
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  color: 'var(--color-ivory-muted)',
                  marginBottom: '2.5rem',
                }}
              >
                Explore our current repertoire of rings, chronometers, and leather straps in our gallery, or reserve a private consultation with our artisans.
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                }}
              >
                <Link to={ROUTES.GALLERY}>
                  <Button size="lg" icon={<ArrowRight size={18} />}>
                    Explore Masterpiece Gallery
                  </Button>
                </Link>

                <Link to={ROUTES.CONTACT}>
                  <Button variant="outline" size="lg" icon={<MessageSquare size={18} />}>
                    Schedule Private Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </section>
    </div>
  );
};
