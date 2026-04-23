import type { Metadata } from 'next';
import { Bricolage_Grotesque, Noto_Sans } from 'next/font/google';
import RootProviders from './providers';
import './globals.css';
import { env } from '@/lib/env';

/**
 * Root layout — Server Component.
 * Giữ mỏng: load fonts, set metadata defaults, bọc RootProviders.
 * Client-side interactivity (antd, toast) nằm trong providers.tsx.
 */

const bricolage = Bricolage_Grotesque({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

const notoSans = Noto_Sans({
  variable: '--font-noto',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: 'TUTORA — Nền tảng kết nối gia sư',
    template: '%s | TUTORA',
  },
  description:
    'TUTORA — nền tảng kết nối phụ huynh, học sinh với gia sư chất lượng. Tìm gia sư theo môn, cấp học, khu vực; đặt lịch và thanh toán an toàn.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'TUTORA',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${bricolage.variable} ${notoSans.variable}`}>
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
