import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { Container } from '../common/Container';
import { SocialLinks } from '../common/SocialLinks';
import { Sparkles, ShieldCheck, Scale, MapPin, Phone, Mail, Clock } from 'lucide-react';

export const SiteFooter: React.FC = () => {
  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: 'var(--color-obsidian)',
        borderTop: '1px solid var(--color-obsidian-border)',
        paddingTop: '5rem',
        paddingBottom: '3rem',
        marginTop: 'auto',
        color: 'var(--color-ivory-muted)',
      }}
    >
      <Container>
        {/* Atelier Pillars & Guarantees */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '4rem',
            borderBottom: '1px solid rgba(196, 154, 90, 0.2)',
            marginBottom: '4rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div
              style={{
                color: 'var(--color-champagne)',
                backgroundColor: 'rgba(196, 154, 90, 0.08)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid rgba(196, 154, 90, 0.2)',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  color: 'var(--color-ivory)',
                  marginBottom: '0.35rem',
                  letterSpacing: '0.04em',
                }}
              >
                Government Assay Purity
              </h4>
              <p style={{ color: 'var(--color-ivory-dim)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Every creation carries certified 916 (22K) and 999 (24K) hallmark credentials with laser-engraved authenticity.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div
              style={{
                color: 'var(--color-champagne)',
                backgroundColor: 'rgba(196, 154, 90, 0.08)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid rgba(196, 154, 90, 0.2)',
                flexShrink: 0,
              }}
            >
              <Scale size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  color: 'var(--color-ivory)',
                  marginBottom: '0.35rem',
                  letterSpacing: '0.04em',
                }}
              >
                Transparent Valuation
              </h4>
              <p style={{ color: 'var(--color-ivory-dim)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Clear itemized breakdown of net gold weight, diamond specifications, and handcrafted artisan fees.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div
              style={{
                color: 'var(--color-champagne)',
                backgroundColor: 'rgba(196, 154, 90, 0.08)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid rgba(196, 154, 90, 0.2)',
                flexShrink: 0,
              }}
            >
              <Sparkles size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  color: 'var(--color-ivory)',
                  marginBottom: '0.35rem',
                  letterSpacing: '0.04em',
                }}
              >
                Bespoke Haute Joaillerie
              </h4>
              <p style={{ color: 'var(--color-ivory-dim)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Private bespoke commissions hand-forged in collaboration with master goldsmiths and certified gemologists.
              </p>
            </div>
          </div>
        </div>

        {/* 4-Column Footer Navigation */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {/* Brand & Manifesto */}
          <div>
            <Link
              to={ROUTES.HOME}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--color-champagne)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-champagne)',
                }}
              >
                <Sparkles size={16} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: 'var(--color-ivory)',
                }}
              >
                ATELIER <span style={{ color: 'var(--color-champagne)' }}>FINE CREATIONS</span>
              </span>
            </Link>

            <p
              style={{
                color: 'var(--color-ivory-dim)',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                marginBottom: '1.75rem',
              }}
            >
              Purveyors of museum-grade 22K and 24K pure gold heirlooms, bridal suites, and ethically sourced diamond masterworks.
            </p>

            {/* Social Links Integration */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-champagne)',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                }}
              >
                CONNECT WITH OUR ATELIER
              </span>
              <SocialLinks variant="minimal" />
            </div>
          </div>

          {/* Public Routes & Collections */}
          <div>
            <h4
              style={{
                fontSize: '0.825rem',
                letterSpacing: '0.18em',
                marginBottom: '1.5rem',
                color: 'var(--color-champagne)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
              }}
            >
              PUBLIC GALLERIES
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                fontSize: '0.875rem',
              }}
            >
              <li>
                <Link
                  to={ROUTES.HOME}
                  style={{ color: 'var(--color-ivory-dim)', transition: 'color var(--transition-fast)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory-dim)')}
                >
                  Flagship Boutique
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.GALLERY}
                  style={{ color: 'var(--color-ivory-dim)', transition: 'color var(--transition-fast)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory-dim)')}
                >
                  Collections & Vault
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.ABOUT}
                  style={{ color: 'var(--color-ivory-dim)', transition: 'color var(--transition-fast)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory-dim)')}
                >
                  Artisan Heritage & Craft
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CONTACT}
                  style={{ color: 'var(--color-ivory-dim)', transition: 'color var(--transition-fast)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory-dim)')}
                >
                  Private Concierge & Salons
                </Link>
              </li>
            </ul>
          </div>

          {/* Salons & Hours */}
          <div>
            <h4
              style={{
                fontSize: '0.825rem',
                letterSpacing: '0.18em',
                marginBottom: '1.5rem',
                color: 'var(--color-champagne)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
              }}
            >
              SALON APPOINTMENTS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--color-champagne)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--color-ivory)', display: 'block' }}>Paris Flagship Salon</strong>
                  <span style={{ color: 'var(--color-ivory-dim)' }}>12 Place Vendôme, 75001 Paris, France</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--color-champagne)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--color-ivory)', display: 'block' }}>New York Salon</strong>
                  <span style={{ color: 'var(--color-ivory-dim)' }}>680 Fifth Avenue, New York, NY 10019</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Clock size={18} style={{ color: 'var(--color-champagne)', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: 'var(--color-ivory-dim)' }}>
                  Monday – Saturday: 10:00 – 19:00<br />
                  Sunday: By Private Invitation Only
                </span>
              </div>
            </div>
          </div>

          {/* Concierge Contact */}
          <div>
            <h4
              style={{
                fontSize: '0.825rem',
                letterSpacing: '0.18em',
                marginBottom: '1.5rem',
                color: 'var(--color-champagne)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
              }}
            >
              VIP CONCIERGE
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <a
                href="tel:+18005554653"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  color: 'var(--color-ivory-dim)',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory-dim)')}
              >
                <Phone size={16} style={{ color: 'var(--color-champagne)' }} />
                <span>+1 (800) 555-GOLD</span>
              </a>

              <a
                href="mailto:concierge@atelierfinecreations.gold"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  color: 'var(--color-ivory-dim)',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory-dim)')}
              >
                <Mail size={16} style={{ color: 'var(--color-champagne)' }} />
                <span>concierge@atelierfinecreations.gold</span>
              </a>

              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  backgroundColor: 'var(--color-espresso)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(196, 154, 90, 0.25)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem',
                    color: 'var(--color-ivory)',
                    marginBottom: '0.35rem',
                  }}
                >
                  Custom Goldsmithing
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-warm-beige)', margin: 0, lineHeight: 1.5 }}>
                  Bespoke 3D wax carving and custom CAD blueprints available with 48h turnaround.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Subfooter */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(196, 154, 90, 0.15)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--color-ivory-dim)',
            gap: '1rem',
          }}
        >
          <p>© {new Date().getFullYear()} ATELIER FINE CREATIONS S.A. All rights reserved. Registered Haute Joaillerie House.</p>
          <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
            <Link
              to={ROUTES.ABOUT}
              style={{ color: 'var(--color-ivory-dim)', transition: 'color var(--transition-fast)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory-dim)')}
            >
              Heritage
            </Link>
            <Link
              to={ROUTES.CONTACT}
              style={{ color: 'var(--color-ivory-dim)', transition: 'color var(--transition-fast)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory-dim)')}
            >
              Concierge
            </Link>
            <Link
              to={ROUTES.ADMIN.LOGIN}
              style={{
                color: 'var(--color-warm-beige)',
                letterSpacing: '0.08em',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-warm-beige)')}
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
