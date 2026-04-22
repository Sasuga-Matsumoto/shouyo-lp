import FadeIn from './FadeIn';
import TrackedLink from '@/src/components/TrackedLink';

const services: { num: string; title: string; desc: string; delay: number }[] = [
  {
    num: '01',
    title: '借上社宅の導入・運用支援',
    desc: '会社が住居を借上げ、役員・従業員へ社宅として貸与。社保等級・所得税負担を最適化します。',
    delay: 0,
  },
  {
    num: '02',
    title: '出張旅費日当の最大化',
    desc: '出張旅費規程の雛形と運用フローをご提供し、日当・宿泊費の非課税枠を最大限活用できる状態をサポートします。',
    delay: 1,
  },
  {
    num: '03',
    title: '役員報酬の構成最適化',
    desc: '給与／賞与／退職金の構成を見直し、社保・税負担を合法的に軽減します。',
    delay: 2,
  },
  {
    num: '04',
    title: '残業食事規程の整備支援',
    desc: '残業時の食事支給を非課税で運用するための規程の雛形と運用フローをご提供します。',
    delay: 0,
  },
  {
    num: '05',
    title: '食事補助の導入・運用支援',
    desc: 'チケット型・現物支給型の福利厚生で、月3,500円までの非課税枠を活用します。',
    delay: 1,
  },
  {
    num: '06',
    title: '企業型DBの導入・運用支援',
    desc: 'はぐくみ等の選択制企業年金を導入。社保等級下げ＋退職金準備を同時に実現します。',
    delay: 2,
  },
];

export default function ServiceDetailSection() {
  return (
    <section className="section service-detail" id="service">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">SERVICE</div>
          <h2 className="section-title">導入から運用まで、網羅的にサポート</h2>
          <p className="section-desc">規程整備、決議書類、各種届出、月次運用、証拠保管まで、必要な雛形一式をPLEXがご提供します。</p>
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
