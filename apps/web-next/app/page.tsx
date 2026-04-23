import { Button } from 'antd';

/**
 * Phase 1 stub — validate:
 *  - Server Component render được
 *  - antd Button SSR ra HTML đúng (inline cssinjs style) — không FOUC khi hydrate
 *  - Tailwind class `min-h-screen flex items-center justify-center` hoạt động
 *  - Font Bricolage load được (variable --font-sans)
 *
 * Phase 2 sẽ replace file này bằng Home SSR thật.
 */

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-zinc-50">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
        TUTORA <span className="text-blue-600">·</span> Next.js scaffold
      </h1>
      <p className="text-zinc-600 max-w-md text-center">
        Nếu bạn thấy nút xanh bên dưới đã được styled <strong>ngay lần render đầu</strong> (không flash
        trắng), antd SSR + cssinjs đang chạy đúng.
      </p>
      <Button type="primary" size="large">
        Hello TUTORA
      </Button>
      <p className="text-xs text-zinc-400 mt-4">Phase 1 foundation — ready for Phase 2 (Home port)</p>
    </main>
  );
}
