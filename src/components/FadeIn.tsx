'use client';
import { useEffect, useRef, ReactNode } from 'react';

export default function FadeIn({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const delayClass = delay > 0 ? ` delay-${delay}` : '';
  return <div ref={ref} className={`fade-in${delayClass} ${className}`}>{children}</div>;
}
