import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import ThanksDownloadRedesign from '@/src/components/thanks/ThanksDownloadRedesign';
import ThanksPageView from '@/src/components/ThanksPageView';

export const metadata: Metadata = {
  title: '資料をお送りしました | PLEX 社保最適化',
  robots: 'noindex, nofollow',
};

export default function ThanksDownloadPage() {
  return (
    <>
      <Header variant="thanks-download" />
      <ThanksPageView formType="download" />
      <ThanksDownloadRedesign />
    </>
  );
}
