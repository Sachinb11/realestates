import { useEffect, useRef } from 'react';

/**
 * useScrollReveal
 * Adds 'visible' class to elements with className 'reveal'
 * when they enter the viewport.
 *
 * Usage:
 *   useScrollReveal();
 *   <div className="reveal delay-2">...</div>
 */
export function useScrollReveal(threshold = 0.12) {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);
}

/**
 * useRevealRef
 * Returns a ref + className string for a single element.
 * Useful when you need programmatic access to the element.
 *
 * Usage:
 *   const { ref, className } = useRevealRef('delay-2');
 *   <div ref={ref} className={className}>...</div>
 */
export function useRevealRef(delayClass = '') {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, className: `reveal ${delayClass}`.trim() };
}
