import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import ContactForm from '@/src/components/ContactForm';

export const metadata: Metadata = {
  title: 'お問い合わせ | PLEX 社保最適化',
  description: 'PLEX社保最適化へのお問い合わせはこちら。無料シミュレーションのご依頼やサービスに関するご質問など、お気軽にお問い合わせください。',
};

export default function ContactPage() {
  return (
    <>
      <Header variant="contact" />
      <ContactForm />
    </>
  );
}
