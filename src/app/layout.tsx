import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Footer from '@/src/components/Footer';
import UtmCapture from '@/src/components/UtmCapture';

export const metadata: Metadata = {
  title: 'PLEX 社保最適化 | 年収を変えずに社会保険料を大幅削減するフルマネージドサービス',
  description: 'PLEX社保最適化は、役員報酬の構成を最適化し、年収を変えずに社会保険料を平均50%削減するフルマネージドSaaSです。シミュレーションから届出管理・否認リスク保証まで一括提供。',
  other: {
    'theme-color': '#1E3A8A',
  },
  icons: {
    icon: [{ url: '/favicon-32.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/favicon.png', sizes: '180x180' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-XXXXXXX');
        `}</Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        <UtmCapture />
        {children}
        <Footer />
      </body>
    </html>
  );
}
