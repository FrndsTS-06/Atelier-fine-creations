import React, { useEffect } from 'react';

export interface PageMetadataProps {
  title: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  structuredData?: Record<string, any>;
}

const BASE_URL = 'https://www.aurelien.gold';
const DEFAULT_IMAGE = `${BASE_URL}/images/hero/hero-cinematic.jpg`;

function setMetaTag(selector: string, attribute: 'name' | 'property', attrValue: string, content: string) {
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export const PageMetadata: React.FC<PageMetadataProps> = ({
  title,
  description,
  canonicalPath,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  structuredData,
}) => {
  useEffect(() => {
    // 1. Dynamic Title
    const fullTitle = title.includes('ATELIER') || title.includes('AURÉLIEN')
      ? title
      : `${title} | ATELIER FINE CREATIONS`;
    document.title = fullTitle;

    // 2. Meta Description
    if (description) {
      setMetaTag('meta[name="description"]', 'name', 'description', description);
    }

    // 3. Canonical URL
    const pathname = canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
    const canonicalUrl = `${BASE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
    setCanonical(canonicalUrl);

    // 4. Open Graph Metadata
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    if (description) {
      setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    }
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'ATELIER FINE CREATIONS');

    // 5. Twitter Card
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    if (description) {
      setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    }
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // 6. Dynamic JSON-LD Structured Data
    const scriptId = 'page-jsonld-schema';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (structuredData) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = scriptId;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    } else if (scriptElement) {
      scriptElement.remove();
    }

    return () => {
      // Clean up injected structured data when component unmounts
      const elem = document.getElementById(scriptId);
      if (elem) {
        elem.remove();
      }
    };
  }, [title, description, canonicalPath, ogImage, ogType, structuredData]);

  return null;
};
