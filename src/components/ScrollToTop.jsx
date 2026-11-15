import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router preserves the window scroll position between routes, so a
// card you click while scrolled down the list can leave the next page
// sitting at the bottom. Reset scroll to the top on every navigation, and
// if a hash link was used (e.g. /#how-it-works) scroll to that section.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
