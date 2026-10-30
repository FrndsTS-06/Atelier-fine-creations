import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Automatically resets the browser viewport scroll position to (0, 0)
 * whenever the user navigates to a new page route across public and admin suites.
 *
 * Preserves intentional in-page anchor links (e.g., #contact, #collections, #jewelry-assembly).
 * Coordinates smoothly with client-side React Router navigation.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If a hash fragment exists, navigate to the targeted anchor element
    if (hash) {
      const targetId = decodeURIComponent(hash.replace('#', ''));
      const element = document.getElementById(targetId);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // Retry briefly in case the target element is still mounting on the newly rendered route
      const timer = setTimeout(() => {
        const delayedEl = document.getElementById(targetId);
        if (delayedEl) {
          delayedEl.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto',
          });
        }
      }, 60);

      return () => clearTimeout(timer);
    }

    // Default: Reset viewport to the top (0, 0) instantly on route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
