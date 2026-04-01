import FadeIn from './FadeIn';
import TrackedLink from '@/src/components/TrackedLink';

export default function FinalCtaSection() {
  return (
    <section className="final-cta" id="contact">
      <FadeIn className="inner">
        <h2>まずは無料シミュレーションをお試しください</h2>
        <p>年収と会社情報をお伝えいただくだけで、具体的な削減額をシミュレーションいたします</p>
        <div className="cta-group">
          <TrackedLink href="/download/" className="btn btn-primary" eventParams={{ form_type: 'download', cta_location: 'final_cta' }}>まずは無料で資料請求</TrackedLink>
          <TrackedLink href="/contact/" className="btn btn-outline-blue hero-contact" eventParams={{ form_type: 'contact', cta_location: 'final_cta' }}>お問い合わせ</TrackedLink>
        </div>
      </FadeIn>
    </section>
  );
}
