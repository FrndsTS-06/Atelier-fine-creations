import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/routePaths';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { DiamondIcon } from '../assets/icons';
import { PageMetadata } from '../components/seo/PageMetadata';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1rem',
      }}
    >
      <PageMetadata
        title="404 — Chamber Not Found | Atelier Fine Creations"
        description="The requested atelier chamber or jewelry masterpiece was not found in our active vault."
        canonicalPath="/404"
      />
      <Container style={{ textAlign: 'center', maxWidth: '580px' }}>
        <div style={{ color: 'var(--color-gold-antique)', marginBottom: '1.5rem', opacity: 0.6 }}>
          <DiamondIcon width="64" height="64" style={{ margin: '0 auto' }} />
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-gold-light)' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Vault Chamber Undiscovered</h2>
        <p className="text-subtle-serif" style={{ marginBottom: '2.5rem' }}>
          The atelier suite or piece you are searching for is unavailable or has been archived in our heritage private vault.
        </p>
        <Link to={ROUTES.HOME}>
          <Button size="lg">Return to Flagship Salon</Button>
        </Link>
      </Container>
    </div>
  );
};
