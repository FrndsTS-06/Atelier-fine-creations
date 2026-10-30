import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routePaths';
import { Container } from '../components/common/Container';
import { SectionHeading } from '../components/common/SectionHeading';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { RevealOnScroll } from '../components/common/RevealOnScroll';
import { ProductGallery } from '../components/products/ProductGallery';
import { PageMetadata } from '../components/seo/PageMetadata';
import { Product } from '../types/product';

export const GalleryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || undefined;
  const navigate = useNavigate();

  const handleInquire = (product: Product) => {
    navigate(`${ROUTES.CONTACT}?product=${product.id}&name=${encodeURIComponent(product.name)}`);
  };

  return (
    <div
      style={{
        backgroundColor: '#FAF7F2',
        color: '#0C0B09',
        minHeight: '100vh',
        padding: '1.5rem 0 6rem',
        borderBottom: '1px solid rgba(196, 154, 90, 0.25)',
      }}
    >
      <PageMetadata
        title="Exquisite Pieces for Every Moment — Atelier Fine Creations"
        description="Explore the curated repertoire of Atelier Fine Creations: sculptural 18K and 22K gold rings, bespoke mechanical chronometers, and artisan leather watch straps."
        canonicalPath="/gallery"
        ogType="website"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Exquisite Pieces for Every Moment',
          url: 'https://www.aurelien.gold/gallery',
          description: 'Sculptural 18K and 22K gold rings, bespoke mechanical chronometers, and artisan leather watch straps.',
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
                name: 'Gallery',
                item: 'https://www.aurelien.gold/gallery',
              },
            ],
          },
        }}
      />

      <Container>
        {/* Breadcrumb Navigation: Home / Gallery */}
        <Breadcrumbs
          items={[
            { label: 'Home', path: ROUTES.HOME },
            { label: 'Gallery' },
          ]}
          theme="light"
        />

        {/* Ivory Canvas Section Heading */}
        <RevealOnScroll>
          <SectionHeading
            eyebrow="ATELIER REPERTOIRE"
            title="Exquisite Pieces for Every Moment."
            subtitle="Explore our curated collection of masterwork creations. From sculptural 18K and 22K gold rings to hand-finished mechanical chronometers and saddle-stitched French leather straps, each piece embodies the unhurried discipline of our Parisian ateliers."
            centered
            theme="light"
          />
        </RevealOnScroll>

        {/* Gallery Suite: Search, Sort, Category Tabs, Grid, Lightbox */}
        <ProductGallery
          initialCategory={categoryParam}
          onInquire={handleInquire}
        />
      </Container>
    </div>
  );
};
