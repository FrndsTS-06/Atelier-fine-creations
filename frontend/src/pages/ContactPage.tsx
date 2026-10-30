import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ROUTES } from '../routes/routePaths';
import { Container } from '../components/common/Container';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SectionHeading } from '../components/common/SectionHeading';
import { ContactForm } from '../components/contact/ContactForm';
import { RevealOnScroll } from '../components/common/RevealOnScroll';
import { SocialLinks } from '../components/common/SocialLinks';
import { PageMetadata } from '../components/seo/PageMetadata';
import { GlassOverlay, GoldParticleLayer } from '../components/common';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product') || undefined;
  const productName = searchParams.get('name') || undefined;

  // Verified Maison details
  const verifiedContact = {
    phone: '+1 (800) 555-GOLD',
    email: 'concierge@atelierfinecreations.gold',
    hours: {
      standard: 'Monday – Saturday: 10:00 – 19:00 CET',
      sunday: 'Sunday: By Private Invitation Only',
    },
    salons: [
      {
        city: 'Paris Flagship Salon',
        address: '12 Place Vendôme, 75001 Paris, France',
      },
      {
        city: 'New York Fifth Avenue Suite',
        address: '680 Fifth Avenue, Suite 1400, New York, NY 10019',
      },
    ],
  };

  return (
    <div
      style={{
        padding: '1.5rem 0 6rem',
        backgroundColor: 'var(--color-obsidian)',
        color: 'var(--color-ivory)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gold particle ambient atmosphere */}
      <GoldParticleLayer
        particleCount={20}
        color="rgba(212, 175, 55, 0.45)"
        style={{
          position: 'absolute',
          inset: 0,
          height: '600px',
          pointerEvents: 'none',
          opacity: 0.5,
          zIndex: 0,
        }}
      />
      <PageMetadata
        title="Private Concierge & Salon Consultation — Atelier Fine Creations"
        description="Schedule a private appointment at our Place Vendôme or Fifth Avenue salons for bespoke gold jewelry, horology commissions, and price valuations."
        canonicalPath="/contact"
        ogType="website"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Private Concierge & Salon Consultation',
          url: 'https://www.aurelien.gold/contact',
          description: 'Schedule a private appointment at our Place Vendôme or Fifth Avenue salons.',
          mainEntity: {
            '@type': 'JewelryStore',
            name: 'Atelier Fine Creations',
            telephone: '+1-800-555-GOLD',
            email: 'concierge@atelierfinecreations.gold',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '12 Place Vendôme',
              addressLocality: 'Paris',
              postalCode: '75001',
              addressCountry: 'FR',
            },
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
                name: 'Private Concierge',
                item: 'https://www.aurelien.gold/contact',
              },
            ],
          },
        }}
      />

      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Home', path: ROUTES.HOME },
            { label: 'Private Concierge' },
          ]}
        />

        {/* Section Heading */}
        <RevealOnScroll>
          <SectionHeading
            eyebrow="BESPOKE CLIENTELING"
            title="Private Salon Consultation"
            subtitle="Experience customized haute joaillerie consultations in our private viewing suites or arrange personal courier delivery worldwide."
            centered
          />
        </RevealOnScroll>

        {/* Two-Column Form & Verified Details Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: '3.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Accessible Form */}
          <RevealOnScroll>
            <ContactForm
              initialProductId={productId}
              initialProductName={productName}
            />
          </RevealOnScroll>

          {/* Right Column: Verified Salon Directory & Direct Channels */}
          <RevealOnScroll delay={120}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Paris Salon Atelier Preview Card */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: '1px solid rgba(196, 154, 90, 0.3)',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65)',
                  maxHeight: '200px',
                }}
              >
                <img
                  src="/images/about/design-studio.jpg"
                  alt="Place Vendôme Salon Private Consultation Suite"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    objectPosition: 'center 40%',
                    filter: 'brightness(0.85) contrast(1.05)',
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(12, 11, 9, 0.9) 0%, rgba(12, 11, 9, 0.2) 60%, transparent 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1.25rem',
                    right: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--color-champagne)',
                        fontWeight: 600,
                        display: 'block',
                        marginBottom: '0.2rem',
                      }}
                    >
                      Flagship Address
                    </span>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-ivory)', fontFamily: 'var(--font-heading)' }}>
                      12 Place Vendôme, Paris
                    </p>
                  </div>
                  <GlassOverlay variant="badge" blur={8} style={{ padding: '0.3rem 0.65rem' }}>
                    <span style={{ fontSize: '0.68rem', letterSpacing: '0.08em', color: 'var(--color-champagne-light)' }}>
                      PRIVATE SUITE
                    </span>
                  </GlassOverlay>
                </div>
              </div>

              {/* Salon Locations Card */}
              {verifiedContact.salons && verifiedContact.salons.length > 0 && (
                <div
                  className="atelier-card glass-panel"
                  style={{
                    padding: '2.25rem',
                    backgroundColor: 'rgba(22, 20, 16, 0.78)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(196, 154, 90, 0.25)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
                    <MapPin size={20} style={{ color: 'var(--color-champagne)' }} />
                    <h4
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.35rem',
                        color: 'var(--color-ivory)',
                        margin: 0,
                      }}
                    >
                      Atelier Salons
                    </h4>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.5rem',
                      fontSize: '0.9rem',
                      color: 'var(--color-ivory-dim)',
                    }}
                  >
                    {verifiedContact.salons.map((salon) => (
                      <div
                        key={salon.city}
                        style={{
                          paddingBottom: '1rem',
                          borderBottom: '1px solid rgba(196, 154, 90, 0.12)',
                        }}
                      >
                        <strong
                          style={{
                            color: 'var(--color-champagne-light)',
                            display: 'block',
                            marginBottom: '0.35rem',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.95rem',
                          }}
                        >
                          {salon.city}
                        </strong>
                        <span style={{ lineHeight: 1.6 }}>{salon.address}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Concierge Contacts & Opening Hours */}
              <div
                className="atelier-card glass-panel"
                style={{
                  padding: '2.25rem',
                  backgroundColor: 'rgba(22, 20, 16, 0.78)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(196, 154, 90, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
                  <Sparkles size={20} style={{ color: 'var(--color-champagne)' }} />
                  <h4
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.35rem',
                      color: 'var(--color-ivory)',
                      margin: 0,
                    }}
                  >
                    Direct Concierge Channels
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
                {verifiedContact.phone && (
                  <a
                    href={`tel:${verifiedContact.phone.replace(/[^+\d]/g, '')}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      color: 'var(--color-ivory)',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory)')}
                  >
                    <div
                      style={{
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'rgba(196, 154, 90, 0.08)',
                        color: 'var(--color-champagne)',
                      }}
                    >
                      <Phone size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-ivory-dim)', display: 'block', textTransform: 'uppercase' }}>
                        Telephone Concierge
                      </span>
                      <strong>{verifiedContact.phone}</strong>
                    </div>
                  </a>
                )}

                {verifiedContact.email && (
                  <a
                    href={`mailto:${verifiedContact.email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      color: 'var(--color-ivory)',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory)')}
                  >
                    <div
                      style={{
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'rgba(196, 154, 90, 0.08)',
                        color: 'var(--color-champagne)',
                      }}
                    >
                      <Mail size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-ivory-dim)', display: 'block', textTransform: 'uppercase' }}>
                        Direct Inquiries
                      </span>
                      <strong>{verifiedContact.email}</strong>
                    </div>
                  </a>
                )}

                {verifiedContact.hours && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid rgba(196, 154, 90, 0.12)',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'rgba(196, 154, 90, 0.08)',
                        color: 'var(--color-champagne)',
                        marginTop: '2px',
                      }}
                    >
                      <Clock size={18} />
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--color-ivory-dim)', lineHeight: 1.6 }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-champagne)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                        Salon Viewing Hours
                      </span>
                      <span>{verifiedContact.hours.standard}</span>
                      <br />
                      <span>{verifiedContact.hours.sunday}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Verified Social Links */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(196, 154, 90, 0.15)' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-champagne)',
                    marginBottom: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  Verified Salon Networks
                </span>
                <SocialLinks variant="minimal" />
              </div>
            </div>

            {/* White-Glove Security Guarantee */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem 1.5rem',
                backgroundColor: 'rgba(53, 35, 24, 0.4)',
                border: '1px solid rgba(196, 154, 90, 0.2)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <ShieldCheck size={28} style={{ color: 'var(--color-champagne)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.78rem', color: 'var(--color-warm-beige)', margin: 0, lineHeight: 1.5 }}>
                All consultations are conducted in complete privacy. Insured worldwide courier transport available upon commission finalization.
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
      </Container>
    </div>
  );
};
