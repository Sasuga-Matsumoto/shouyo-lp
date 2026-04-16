import ScheduleButton from '@/src/components/ScheduleButton';

export default function ThanksDownloadRedesign() {
  return (
    <section className="thanks-section">
      <div className="thanks-inner fade-up">
        <div className="thanks-card">
          <div className="thanks-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>

          <h1 className="thanks-title">資料をお送りしました</h1>

          <p className="thanks-message">PLEX社保最適化は、役員報酬の構成を最適化し、<br />年収を変えずに社会保険料を<strong>平均50%削減</strong>するサービスです。</p>

          <div className="thanks-schedule">
            <p className="thanks-schedule-text">30分程度のオンライン説明で、サービスの全体像をお伝えします</p>
            <ScheduleButton label="空き日程を見る" formType="download" />
          </div>

          <div className="thanks-divider"></div>

          <div className="thanks-features">
            <div className="thanks-feature-item">
              <div className="thanks-feature-number"><span style={{ fontSize: '0.9rem' }}>平均</span>50<span style={{ fontSize: '0.9rem' }}>%</span></div>
              <div className="thanks-feature-label">社保料削減</div>
            </div>
            <div className="thanks-feature-item">
              <div className="thanks-feature-number">2~3<span style={{ fontSize: '0.9rem' }}>回</span></div>
              <div className="thanks-feature-label">年間の承認回数</div>
            </div>
            <div className="thanks-feature-item">
              <div className="thanks-feature-number">100<span style={{ fontSize: '0.9rem' }}>%</span></div>
              <div className="thanks-feature-label">否認リスク補償</div>
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
  );
}
