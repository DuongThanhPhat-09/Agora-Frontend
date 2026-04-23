import path from 'node:path';
import type { NextConfig } from 'next';

/**
 * Rewrites cho các route Vite app đảm nhận.
 * Khi cutover (Phase 5): Project A (Next này) nhận domain `tutora.vn`,
 * proxy các route dưới đây sang Project B (Vite) tại `app.tutora.vn`.
 *
 * Dev: override `VITE_APP_ORIGIN=http://localhost:5173` để rewrite về Vite dev server.
 * Prod: mặc định `https://app.tutora.vn`.
 *
 * Chọn `rewrites` (KHÔNG `redirects`) để browser thấy cùng origin → localStorage
 * `TUTORA_user_data` share được giữa Next home page và Vite portal pages.
 */

const VITE_ORIGIN = process.env.VITE_APP_ORIGIN || 'https://app.tutora.vn';

const nextConfig: NextConfig = {
  // Next 16 + Turbopack auto-detect lockfile. Root repo có 1 lockfile cho Vite,
  // apps/web-next/ có 1 lockfile riêng. Chỉ định rõ root = apps/web-next/ tránh
  // Next đoán nhầm vào user home.
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      { source: '/login', destination: `${VITE_ORIGIN}/login` },
      { source: '/register', destination: `${VITE_ORIGIN}/register` },
      { source: '/reset-password', destination: `${VITE_ORIGIN}/reset-password` },
      { source: '/admin-portal/:path*', destination: `${VITE_ORIGIN}/admin-portal/:path*` },
      { source: '/tutor-portal/:path*', destination: `${VITE_ORIGIN}/tutor-portal/:path*` },
      { source: '/parent-portal/:path*', destination: `${VITE_ORIGIN}/parent-portal/:path*` },
      { source: '/student-portal/:path*', destination: `${VITE_ORIGIN}/student-portal/:path*` },
      { source: '/payment/:path*', destination: `${VITE_ORIGIN}/payment/:path*` },
      { source: '/zapps/:path*', destination: `${VITE_ORIGIN}/zapps/:path*` },
    ];
  },
  images: {
    // Cho phép Next/Image optimize từ backend Tutora (avatar tutor, cover, v.v.)
    remotePatterns: [
      { protocol: 'https', hostname: 'api.tutora.vn' },
      { protocol: 'http', hostname: 'localhost' },
      // Supabase storage (avatar / cover đã upload)
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
