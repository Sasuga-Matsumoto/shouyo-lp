'use client';
import { useState, useRef, useCallback } from 'react';
import FadeIn from './FadeIn';

const faqs = [
  {
    q: '本当に年収は変わらないんですか？',
    a: '年収の総額は変わりません。月額報酬と賞与の配分を組み替えることで、社会保険料の計算構造の違いを活用して保険料を削減します。',
  },
  {
    q: 'PLEXのサポート範囲はどこまでですか？',
    a: 'ご状況ヒアリング → 最適化プラン作成 → 規程整備の雛形提供 → 運用フロー設計 → 証拠保管の雛形まで、各種雛形と情報を一気通貫でご提供します。規程整備や届出自体はお客様側でご対応いただきます。',
  },
  {
    q: '万が一、年金事務所から否認されたらどうなりますか？',
    a: '当社のスキームは、過去の事例と最新の運用実務をもとに否認リスクを最小化する設計となっています。議事録の記載方法、報酬設定の根拠、運用上の留意点など、否認リスクを下げるためのノウハウと雛形を網羅的にご提供します。',
  },
  {
    q: '顧問税理士は変える必要がありますか？',
    a: '変更不要です。顧問税理士の主務は申告・記帳で構造的に節税の能動提案が難しく、社保も守備範囲外となります。PLEXは節税スキームの設計と、規程整備に必要な雛形・情報の提供で補完する立て付けです。',
  },
  {
    q: '将来もらえる年金が減りませんか？',
    a: '標準報酬月額が下がるため、将来の厚生年金受給額は減少します。ただし、シミュレーションで損益分岐点を明示しており、多くの場合、保険料の削減額が将来の年金減少分を大きく上回ります。iDeCoや企業型DBなど別スキームでの補完もご案内できます。',
  },
  {
    q: '契約から導入までどのくらいかかりますか？',
    a: '契約書のご提出から最短1週間で利用開始が可能です（目安1週間〜1ヶ月）。契約書提出 → ヒアリング・プラン作成 → 規程整備の雛形提供・社内決議 → 運用開始 の流れで進みます。',
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
