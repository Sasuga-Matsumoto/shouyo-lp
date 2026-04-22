'use client';
import { useState, useRef, useCallback } from 'react';
import FadeIn from './FadeIn';

const faqs = [
  {
    q: '本当に年収は変わらないんですか？',
    a: 'はい、年収の総額は一切変わりません。月額報酬と賞与の配分を組み替えるだけです。受け取る総額は同じで、社会保険料の計算構造の違いを活用して保険料を削減します。',
  },
  {
    q: '手続きで自分がやることはありますか？',
    a: 'お客様には、雛形と手順書に沿って書類作成・届出を進めていただきます。記載例や注意点まで網羅した雛形をご提供するため、専門知識がなくても迷わず対応でき、工数を最小限に抑えられます。導入期は当社が個別にサポートいたします。',
  },
  {
    q: '万が一、年金事務所から否認されたらどうなりますか？',
    a: '当社のスキームは、過去の事例と最新の運用実務をもとに否認リスクを最小化する設計となっています。議事録の記載方法、報酬設定の根拠、運用上の留意点など、否認リスクを下げるためのノウハウと雛形を網羅的にご提供します。',
  },
  {
    q: '将来もらえる年金が減りませんか？',
    a: '標準報酬月額が下がるため、将来の厚生年金受給額は減少します。ただし、シミュレーションで損益分岐点を明示しており、多くの場合、保険料の削減額が将来の年金減少分を大きく上回ります。iDeCoなど民間年金での補完もご案内します。',
  },
  {
    q: 'どんな会社・役員が対象ですか？',
    a: '法人の役員（取締役・代表取締役）で、年収600万円以上の方が対象です。個人事業主は対象外となります。',
  },
  {
    q: '申し込みから効果が出るまでどのくらいかかりますか？',
    a: 'シミュレーション後、最短で翌月の定時株主総会のタイミングから報酬構成の変更が可能です。届出期限に応じた最適なスケジュールをご案内いたします。',
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = useCallback((i: number) => {
    setActiveIndex(prev => prev === i ? null : i);
  }, []);

  return (
    <section className="section faq" id="faq">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">FAQ</div>
          <h2 className="section-title">よくあるご質問</h2>
        </FadeIn>

        <FadeIn>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item${activeIndex === i ? ' active' : ''}`}>
                <button
                  className="faq-question"
                  aria-expanded={activeIndex === i}
                  aria-controls={`faq-a${i + 1}`}
                  onClick={() => toggle(i)}
                >
                  Q. {faq.q}
                </button>
                <div
                  className="faq-answer"
                  id={`faq-a${i + 1}`}
                  role="region"
                  ref={el => { answerRefs.current[i] = el; }}
                  style={{ maxHeight: activeIndex === i ? `${answerRefs.current[i]?.scrollHeight || 200}px` : '0' }}
                >
                  <div className="faq-answer-inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
