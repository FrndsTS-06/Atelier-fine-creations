/**
 * Approved HTTPS domains for luxury acquisitions and checkout dispatch.
 * Prevents navigation to arbitrary, untrusted, or non-HTTPS URLs.
 */
const APPROVED_CHECKOUT_DOMAINS: readonly string[] = [
  'checkout.atelierfinecreations.gold',
  'boutique.atelierfinecreations.gold',
  'store.atelierfinecreations.gold',
  'atelierfinecreations.gold',
  'buy.stripe.com',
  'stripe.com',
  'wa.me',
];

/**
 * Validates whether an external acquisition URL is well-formed, uses HTTPS,
 * and belongs to an approved Maison destination.
 */
export function isValidCheckoutUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Must strictly begin with https://
  if (!url.startsWith('https://')) {
    return false;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    return APPROVED_CHECKOUT_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Safely opens an external checkout URL in a new tab with noopener and noreferrer.
 * Returns true if allowed and opened, false if rejected.
 */
export function openExternalCheckout(url: string | undefined | null): boolean {
  if (!isValidCheckoutUrl(url)) {
    console.warn('[Atelier Security] Blocked unapproved checkout URL destination:', url);
    return false;
  }

  window.open(url as string, '_blank', 'noopener,noreferrer');
  return true;
}
