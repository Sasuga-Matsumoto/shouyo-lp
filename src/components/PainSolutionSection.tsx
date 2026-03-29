import FadeIn from './FadeIn';
import TrackedLink from '@/src/components/TrackedLink';

export default function PainSolutionSection() {
  return (
    <section className="section pain-solution" id="pain">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">SOLUTION</div>
          <h2 className="section-title">こんなお悩みありませんか？</h2>
        </FadeIn>

        <FadeIn>
          <div className="pain-cards">
            <div className="pain-card">
              <div className="pain-icon">!</div>
              <p>社会保険料が高すぎて<br />手取りが少ないと感じている</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">!</div>
              <p>最適化したいが自分で<br />調整するのは面倒で不安</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">!</div>
              <p>コンサルに頼んでも<br />否認リスクは自己責任</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="solution-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </div>
        </FadeIn>

        <FadeIn className="section-center">
          <h3 className="section-title" style={{ fontSize: '1.3rem' }}>PLEX社保最適化がすべて解決します</h3>
        </FadeIn>

        <FadeIn>
          <div className="solution-cards">
            <div className="solution-card">
              <div className="solution-num">01</div>
              <h4>報酬構成の最適化で<br />平均50%削減</h4>
              <p>月額報酬を下げて賞与に振り替え。年収総額を変えずに社会保険料の賞与キャップを活用して保険料を大幅削減します。</p>
            </div>
            <div className="solution-card">
              <div className="solution-num">02</div>
              <h4>年収と会社情報を<br />渡すだけ</h4>
              <p>シミュレーションから届出、電子申請、年次管理まですべてお任せ。お客様の手間はほぼゼロです。</p>
            </div>
            <div className="solution-card">
              <div className="solution-num">03</div>
              <h4>業界唯一の<br />否認リスク保証</h4>
              <p>万が一年金事務所から否認された場合、差額保険料と延滞金を全額当社が負担します。</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="mid-cta">
          <div className="cta-group">
            <TrackedLink href="/contact/" className="btn btn-primary" eventParams={{ form_type: 'contact', cta_location: 'pain_solution' }}>まずは問い合わせする</TrackedLink>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
