import CalendarEmbed from '@/src/components/calendar/CalendarEmbed';

export default function ThanksDownloadRedesign() {
  return (
    <>
      {/* ===== 上段: お礼メッセージ（コンパクト・カレンダーへの導線） ===== */}
      <section className="thanks-section thanks-section--lead">
        <div className="thanks-inner fade-up">
          <div className="thanks-card thanks-card--compact">
            <div className="thanks-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>

            <h1 className="thanks-title">資料をお送りしました</h1>

            <p className="thanks-message">PLEX社保最適化は、役員報酬の構成を最適化し、<br />年収を変えずに社会保険料を<strong>平均50%削減</strong>するサービスです。</p>

            <p className="thanks-lead-cta">
              <strong>下記からご都合の良い日時をお選びください。</strong><br />
              <span>30分程度のオンライン説明で、サービスの全体像をお伝えします。</span>
            </p>
          </div>
        </div>
      </section>

      {/* ===== 中段: 商談予約カレンダー（直前フォーム送信内容をプリフィル） ===== */}
      <CalendarEmbed service="shouyo" />

      {/* ===== 下段: サービスの特徴 / 注意書き ===== */}
      <section className="thanks-section thanks-section--secondary">
        <div className="thanks-inner fade-up">
          <div className="thanks-card">
            <div className="thanks-features">
              <div className="thanks-feature-item">
                <div className="thanks-feature-number">会社負担削減</div>
                <div className="thanks-feature-desc">社保の会社負担と税金を削減</div>
              </div>
              <div className="thanks-feature-item">
                <div className="thanks-feature-number">複数リスクケア</div>
                <div className="thanks-feature-desc">複数観点の対策サンプルをご提供</div>
              </div>
              <div className="thanks-feature-item">
                <div className="thanks-feature-number">お手間なし</div>
                <div className="thanks-feature-desc">導入から運用まで雛形を一式ご提供</div>
              </div>
            </div>

            <div className="thanks-notice">
              <div className="thanks-notice-item">
                <span className="thanks-notice-icon">&#x1F4E9;</span>
                <span>フォームにご入力いただいたメールアドレス宛にサービス資料をお送りしています。届かない場合はお手数ですが、迷惑メールフォルダをご確認ください。</span>
              </div>
              <div className="thanks-notice-item">
                <span className="thanks-notice-icon">&#x1F4DE;</span>
                <span>翌営業日に担当者からお電話いたします。サービスについてのご質問もお気軽にどうぞ。</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
