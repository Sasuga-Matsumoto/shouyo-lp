'use client';

import { useState, useEffect } from 'react';
import TrackedLink from '@/src/components/TrackedLink';

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`sticky-cta${visible ? ' sticky-cta--visible' : ''}`}>
      <TrackedLink
        href="/download/"
        className="btn btn-primary sticky-cta__btn"
        eventParams={{ form_type: 'download', cta_location: 'sticky' }}
      >
        まずは無料で資料請求
      </TrackedLink>
    </div>
  );
}
