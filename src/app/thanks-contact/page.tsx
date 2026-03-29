import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import ThanksContactRedesign from '@/src/components/thanks/ThanksContactRedesign';
import ThanksPageView from '@/src/components/ThanksPageView';

export const metadata: Metadata = {
  title: 'お問い合わせありがとうございます | PLEX 社保最適化',
  robots: 'noindex, nofollow',
};

export default function ThanksContactPage() {
  return (
    <>
      <Header variant="thanks-contact" />
      <ThanksPageView formType="contact" />
      <ThanksContactRedesign />
    </>
  );
}
