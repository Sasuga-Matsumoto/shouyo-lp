import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import ContactABRouter from '@/src/components/ContactABRouter';

export const metadata: Metadata = {
  title: 'お問い合わせ | PLEX 社保最適化',
  description: 'PLEX社保最適化へのお問い合わせはこちら。無料シミュレーションのご依頼やサービスに関するご質問など、お気軽にお問い合わせください。',
};

// A/Bテスト contact-direct-calendar の variant 振り分けは ContactABRouter (Client) で実施。
// page-hero も variant 依存のため ContactABRouter 内に移動。
export default function ContactPage() {
  return (
    <>
      <Header variant="contact" />
      <ContactABRouter />
    </>
  );
}
