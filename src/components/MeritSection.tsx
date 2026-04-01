import FadeIn from './FadeIn';
import TrackedLink from '@/src/components/TrackedLink';

export default function MeritSection() {
  return (
    <section className="section merit" id="merit">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">MERIT</div>
          <h2 className="section-title">経営者にも会社にも大きなメリット</h2>
        </FadeIn>

        <div className="merit-grid" style={{ marginTop: '36px' }}>
          <FadeIn delay={1}>
            <div className="merit-block-label">経営者のメリット</div>
            <div className="merit-card card-employee">
              <h3>年収そのまま、<br />手取りが年間100万円増える</h3>
              <p>月額報酬と賞与の構成を最適化するだけで、総額は同じなのに社会保険料が大幅に下がります。年収1,200万円の役員なら年間約143万円の保険料削減が見込めます。</p>
            </div>
          </FadeIn>
          <FadeIn delay={2}>
            <div className="merit-block-label">会社のメリット</div>
            <div className="merit-card card-company">
              <h3>会社負担の社会保険料も<br />同額削減</h3>
              <p>社会保険料は労使折半のため、経営者分の保険料削減は会社負担分にも同額のコスト削減効果があります。経営者の手取りアップと会社のコスト削減を同時に実現します。</p>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mid-cta">
          <div className="cta-group">
            <TrackedLink href="/download/" className="btn btn-primary" eventParams={{ form_type: 'download', cta_location: 'merit' }}>まずは無料で資料請求</TrackedLink>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
