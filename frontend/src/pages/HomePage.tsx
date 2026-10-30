import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { JewelryAssemblyScene } from '../components/home/JewelryAssemblyScene';
import { CollectionHighlights } from '../components/home/CollectionHighlights';
import { BrandBenefits } from '../components/home/BrandBenefits';
import { CraftsmanshipSection } from '../components/home/CraftsmanshipSection';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { PageMetadata } from '../components/seo/PageMetadata';

export const HomePage: React.FC = () => {
  return (
    <>
      <PageMetadata
        title="ATELIER FINE CREATIONS — Jewelry, Watches, Leather Straps"
        description="Discover Atelier Fine Creations: Masterpiece 18K and 22K gold rings, bespoke mechanical chronometers, handcrafted leather watch straps, and bespoke Parisian craftsmanship."
        canonicalPath="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'JewelryStore',
          name: 'Atelier Fine Creations',
          alternateName: 'AURÉLIEN Haute Joaillerie',
          url: 'https://www.aurelien.gold/',
          logo: 'https://www.aurelien.gold/favicon.svg',
          image: 'https://www.aurelien.gold/images/hero/hero-cinematic.jpg',
          description: 'Haute Joaillerie, bespoke mechanical timepieces, and artisan leather watch straps.',
          priceRange: '$$$$',
          telephone: '+1-800-555-GOLD',
          email: 'concierge@atelierfinecreations.gold',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '12 Place Vendôme',
            addressLocality: 'Paris',
            postalCode: '75001',
            addressCountry: 'FR',
          },
        }}
      />
      <HeroSection />
      <JewelryAssemblyScene />
      <CollectionHighlights />
      <BrandBenefits />
      <CraftsmanshipSection />
      <FeaturedProducts />
    </>
  );
};
