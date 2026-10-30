import React from 'react';
import { Instagram, Facebook, MessageCircle, Mail } from 'lucide-react';

export interface SocialLinksProps {
  className?: string;
  variant?: 'minimal' | 'expanded';
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ className = '', variant = 'minimal' }) => {
  const links = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/atelierfinecreations',
      icon: <Instagram size={18} strokeWidth={1.5} />,
      handle: '@atelierfinecreations',
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/atelierfinecreations',
      icon: <Facebook size={18} strokeWidth={1.5} />,
      handle: 'Atelier Fine Creations',
    },
    {
      name: 'VIP Concierge WhatsApp',
      url: 'https://wa.me/18005554653',
      icon: <MessageCircle size={18} strokeWidth={1.5} />,
      handle: '+1 (800) 555-GOLD',
    },
    {
      name: 'Private Salon Inquiry',
      url: 'mailto:concierge@atelierfinecreations.gold',
      icon: <Mail size={18} strokeWidth={1.5} />,
      handle: 'concierge@atelierfinecreations.gold',
    },
  ];

  if (variant === 'expanded') {
    return (
      <div className={`social-links-expanded ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {links.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow Atelier Fine Creations on ${item.name}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--color-ivory-muted)',
              fontSize: '0.85rem',
              transition: 'color var(--transition-fast), transform var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-champagne)';
              e.currentTarget.style.transform = 'translateX(3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-ivory-muted)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ color: 'var(--color-champagne)' }}>{item.icon}</span>
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`social-links-minimal ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {links.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow Atelier Fine Creations on ${item.name}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-obsidian-subtle)',
            border: '1px solid var(--color-obsidian-border)',
            color: 'var(--color-ivory-muted)',
            transition: 'all var(--transition-normal)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-obsidian)';
            e.currentTarget.style.backgroundColor = 'var(--color-champagne)';
            e.currentTarget.style.borderColor = 'var(--color-champagne-light)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-ivory-muted)';
            e.currentTarget.style.backgroundColor = 'var(--color-obsidian-subtle)';
            e.currentTarget.style.borderColor = 'var(--color-obsidian-border)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
};
