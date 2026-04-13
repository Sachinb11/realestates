import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse   = useRef({ x: 0, y: 0 });
  const ring    = useRef({ x: 0, y: 0 });
  const rafRef  = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const circle = ringRef.current;
    if (!dot || !circle) return;

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.13);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.13);
      circle.style.left = ring.current.x + 'px';
      circle.style.top  = ring.current.y + 'px';
      rafRef.current = requestAnimationFrame(animate);
    };

    // Hover listeners — expand cursor on interactive elements
    const addHover = () => document.body.classList.add('cursor-hover');
    const rmHover  = () => document.body.classList.remove('cursor-hover');
    const targets  = 'a, button, [role="button"], .prop-card, .cat-card, input, select, textarea, label';

    const bindHover = () => {
      document.querySelectorAll(targets).forEach(el => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', rmHover);
      });
    };

    // Re-bind on DOM changes (for dynamic content)
    const observer = new MutationObserver(bindHover);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(animate);
    bindHover();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}   className={styles.dot}  aria-hidden="true" />
      <div ref={ringRef}  className={styles.ring} aria-hidden="true" />
    </>
  );
}
