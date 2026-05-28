'use client';

import ContactForm from '@/src/components/ContactForm';
import FormStartTracker from '@/src/components/FormStartTracker';
import CalendarBookingClient from '@/src/components/calendar/CalendarBookingClient';
import { useABVariant } from '@/src/lib/use-ab-variant';

/**
 * /contact 配下のA/Bテスト振り分け（contact-direct-calendar）
 * - form (control)     : 既存お問い合わせフォーム。page-hero は「お問い合わせ」
 * - calendar (variant) : カレンダー直行。page-hero は「無料相談」
 *
 * Vercel の静的プリレンダリングを維持しつつ、各クライアントの Cookie を
 * useLayoutEffect で初回ペイント前に読んで variant を判定する。
 */
export default function ContactABRouter() {
  const variant = useABVariant('contact-direct-calendar');

  // 初回ハイドレーション前はレイアウトシフトを抑える最低限の高さだけ確保
  if (variant === null) {
    return <div style={{ minHeight: '60vh' }} aria-hidden="true" />;
  }

  if (variant === 'calendar') {
    return (
      <>
        <section className="page-hero">
          <div className="inner">
            <div className="page-hero-label">FREE CONSULTATION</div>
            <h1>無料相談</h1>
            <p className="page-hero-lead">下記からご都合の良いお日にちをお選びください</p>
            <div className="page-hero-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </div>
          </div>
        </section>
        <CalendarBookingClient service="shouyo" hideBenchmark />
      </>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="inner">
          <div className="page-hero-label">CONTACT</div>
          <h1>お問い合わせ</h1>
        </div>
      </section>
      <FormStartTracker formType="contact" />
      <ContactForm />
    </>
  );
}
