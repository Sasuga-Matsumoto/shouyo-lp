import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import DownloadForm from '@/src/components/DownloadForm';

export const metadata: Metadata = {
  title: '資料ダウンロード | PLEX 社保最適化',
  description: 'PLEX社保最適化のサービス資料をダウンロードいただけます。社会保険料の最適化の仕組み、削減効果の概算例、導入イメージをご確認ください。',
};

export default function DownloadPage() {
  return (
    <>
      <Header variant="download" />
      <DownloadForm />
    </>
  );
}
