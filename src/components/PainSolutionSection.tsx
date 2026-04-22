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
              <p>社会保険料の負担が重いが<br />削減手段が限られている</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">!</div>
              <p>社保最適化を始めたいが<br />手間がかかりすぎて手が回らない</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">!</div>
              <p>最適化を検討しても<br />リスクが曖昧で踏み切れない</p>
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
              <h4>報酬設計から運用フローまで<br />フルサポート</h4>
              <p>報酬設計、議事録・届出書類、運用フロー、証拠管理まで網羅的に雛形提供。</p>
            </div>
            <div className="solution-card">
              <div className="solution-num">03</div>
              <h4>複数リスクをケア</h4>
              <p>報酬構成変更の目的設定、報酬額の設定背景、議事録の記載内容、運用時の留意点まで、複数観点の対策サンプルをパッケージで提供します。</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="mid-cta">
          <div className="cta-group">
            <TrackedLink href="/download/" className="btn btn-primary" eventParams={{ form_type: 'download', cta_location: 'pain_solution' }}>まずは無料で資料請求</TrackedLink>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
