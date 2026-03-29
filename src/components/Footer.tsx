import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-logo">
              <img src="/logo.png" alt="PLEX" className="footer-logo-img" />
              <span className="footer-logo-text">PLEX 社保最適化</span>
            </div>
            <div className="footer-company">株式会社プレックス</div>
            <div className="footer-address">〒103-0021 東京都中央区日本橋本石町3-2-4 共同ビル（日銀前）6階</div>
          </div>
          <div>
            <ul className="footer-nav">
              <li><a href="https://plex.co.jp/" target="_blank" rel="noopener">運営会社情報</a></li>
              <li><Link href="/privacy/">個人情報保護方針</Link></li>
              <li><Link href="/contact/">お問い合わせ</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2026 株式会社プレックス All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
