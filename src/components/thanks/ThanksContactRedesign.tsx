import ScheduleButton from '@/src/components/ScheduleButton';

export default function ThanksContactRedesign() {
  return (
    <section className="thanks-section">
      <div className="thanks-inner fade-up">
        <div className="thanks-card">
          <div className="thanks-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>

          <h1 className="thanks-title">お問い合わせありがとうございます</h1>

          <p className="thanks-message">PLEX社保最適化は、役員報酬の構成を最適化し、<br />年収を変えずに社会保険料を<strong>平均50%削減</strong>するサービスです。</p>

          <div className="thanks-schedule">
            <p className="thanks-schedule-text">お問い合わせ内容を踏まえて、30分程度でご説明します</p>
            <ScheduleButton label="空き日程を見る" formType="contact" />
          </div>

          <div className="thanks-divider"></div>

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

          <div className="thanks-divider"></div>

          <div className="thanks-steps">
            <div className="thanks-steps-label">Next Steps</div>
            <div className="thanks-step">
              <div className="thanks-step-num">1</div>
              <div className="thanks-step-content">
                <div className="thanks-step-title">お電話でヒアリング</div>
                <div className="thanks-step-desc">翌営業日</div>
              </div>
            </div>
            <div className="thanks-step">
              <div className="thanks-step-num">2</div>
              <div className="thanks-step-content">
                <div className="thanks-step-title">無料シミュレーションのご提示</div>
                <div className="thanks-step-desc">具体的な削減額をお見せします</div>
              </div>
            </div>
            <div className="thanks-step">
              <div className="thanks-step-num">3</div>
              <div className="thanks-step-content">
                <div className="thanks-step-title">導入サポート</div>
                <div className="thanks-step-desc">雛形と導入サポートで安心スタート</div>
              </div>
            </div>
          </div>

          <div className="thanks-notice">
            <div className="thanks-notice-item">
              <span className="thanks-notice-icon">&#x1F4DE;</span>
              <span>翌営業日に担当者からお電話いたします。お問い合わせ内容について詳しくご案内いたします。</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
