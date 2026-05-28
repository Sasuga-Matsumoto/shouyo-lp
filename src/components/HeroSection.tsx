'use client';

import TrackedLink from '@/src/components/TrackedLink';
import { useABVariant } from '@/src/lib/use-ab-variant';

export default function HeroSection() {
  // contact-direct-calendar の calendar variant のみ「無料で相談する」CTAをヒーローに追加
  const abVariant = useABVariant('contact-direct-calendar');
  const showContactCta = abVariant === 'calendar';

  return (
    <section className="hero">
      <div className="hero-glow"></div>
      <div className="inner">
        <div className="hero-label">PLEX INSURANCE OPTIMIZATION</div>
        <h1 className="hero-title">年収を変えずに<br />社会保険料を年間142万円削減</h1>
        <div className="hero-sub-pitch">
          <span>会社負担削減</span>
          <span>複数リスクケア</span>
          <span>お手間なし</span>
        </div>
        <div className="cta-group">
          <TrackedLink href="/download/" className="btn btn-primary" eventParams={{ form_type: 'download', cta_location: 'hero' }}>まずは無料で資料請求</TrackedLink>
          {showContactCta && (
            <TrackedLink
              href="/contact/"
              className="btn btn-outline-blue hero-contact"
              eventParams={{ form_type: 'contact', cta_location: 'hero' }}
            >
              無料で相談する
            </TrackedLink>
          )}
        </div>
      </div>
    </section>
  );
}
