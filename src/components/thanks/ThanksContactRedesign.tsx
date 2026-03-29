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

          <div className="thanks-divider"></div>

          <div className="thanks-features">
            <div className="thanks-feature-item">
              <div className="thanks-feature-number"><span style={{ fontSize: '0.9rem' }}>最大</span>55<span style={{ fontSize: '0.9rem' }}>%</span></div>
              <div className="thanks-feature-label">社保料削減</div>
            </div>
            <div className="thanks-feature-item">
              <div className="thanks-feature-number">2~3<span style={{ fontSize: '0.9rem' }}>回</span></div>
              <div className="thanks-feature-label">年間の承認回数</div>
            </div>
            <div className="thanks-feature-item">
              <div className="thanks-feature-number">100<span style={{ fontSize: '0.9rem' }}>%</span></div>
              <div className="thanks-feature-label">否認リスク保証</div>
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
                <div className="thanks-step-desc">届出から運用開始まで全てお任せ</div>
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
