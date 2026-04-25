/**
 * Env abstraction cho Next app.
 *
 * Tương ứng với mapping trong plan §2.1 (Vite tương đương ở `src/services/zalo-env.ts`):
 *  - `VITE_BACKEND_URL`  → `NEXT_PUBLIC_BACKEND_URL`
 *  - `VITE_API_URL`      → `NEXT_PUBLIC_API_URL`
 *  - `VITE_SITE_URL`     → `NEXT_PUBLIC_SITE_URL` (mới; dùng cho canonical/OG/sitemap absolute URL)
 *
 * Server-only secrets KHÔNG đi qua đây — chúng dùng trực tiếp `process.env.*` trong
 * file có `import "server-only"`.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5166';
const API_URL = process.env.NEXT_PUBLIC_API_URL || `${BACKEND_URL}/api`;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const env = {
  BACKEND_URL,
  API_URL,
  SITE_URL,
} as const;

export type Env = typeof env;
