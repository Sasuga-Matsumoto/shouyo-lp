import FadeIn from './FadeIn';
import TrackedLink from '@/src/components/TrackedLink';

const services = [
  { num: '01', title: '最適配分シミュレーション', desc: '年収・役員構成から最適な月額/賞与バランスを自動算出。将来年金への影響も含めてシミュレーションします。', delay: 0 },
  { num: '02', title: '届出書類の自動生成', desc: '株主総会議事録、事前確定届出給与の届出、月額変更届など、必要書類を自動で作成します。', delay: 1 },
  { num: '03', title: 'e-Gov電子申請', desc: '届出の電子申請もお任せください。面倒な手続きを代わりに進めるので、お客様が役所に行く必要はありません。', delay: 2 },
  { num: '04', title: '年次サイクル管理', desc: '毎年1月に翌期の再シミュレーション。届出期限のリマインド、法改正への自動対応を行います。', delay: 0 },
  { num: '05', title: '否認リスク保証（SLA）', desc: '当社スキームに基づく運用で否認された場合、差額保険料＋延滞金を全額負担する損害賠償型SLAです。', delay: 1 },
];

export default function ServiceDetailSection() {
  return (
    <section className="section service-detail" id="service">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">SERVICE</div>
          <h2 className="section-title">契約1本・窓口1つで、すべてお任せ</h2>
          <p className="section-desc">シミュレーションから届出、電子申請、否認リスク保証まで。面倒な手続きはすべてお任せください。</p>
        </FadeIn>

        <div className="service-grid">
          {services.map((s) => (
            <FadeIn key={s.num} delay={s.delay}>
              <div className="service-card">
                <div className="service-card-num">{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mid-cta">
          <div className="cta-group">
            <TrackedLink href="/download/" className="btn btn-primary" eventParams={{ form_type: 'download', cta_location: 'service_detail' }}>まずは無料で資料請求</TrackedLink>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
