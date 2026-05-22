// ============================================================
// MOCK SETUP — patch axios toàn cục trước khi bất kỳ service
// nào gọi axios.create(). Import file này ĐẦU TIÊN ở main.tsx.
//
// Chiến lược:
//   1. Gán mockAdapter vào axios.defaults.adapter  → bắt mọi
//      call trực tiếp qua instance gốc (vd: LoginForm dùng
//      `axios.post(...)` không qua axios.create).
//   2. Override axios.create → mọi instance mới tạo ra cũng
//      tự động nhận mockAdapter làm default adapter.
// ============================================================

import axios from 'axios';
import { mockAdapter } from './mockAdapter';

if (import.meta.env.VITE_USE_MOCK === 'true') {
  // 1. Patch default axios instance
  axios.defaults.adapter = mockAdapter;

  // 2. Patch axios.create so every new instance inherits mockAdapter
  const originalCreate = axios.create.bind(axios);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (axios as any).create = function (config?: Parameters<typeof axios.create>[0]) {
    const instance = originalCreate(config);
    instance.defaults.adapter = mockAdapter;
    return instance;
  };

  console.info(
    '%c[MOCK MODE ON] Mọi API call sẽ dùng dữ liệu giả lập. Chạy `npm run dev` để dùng BE thật.',
    'background:#f59e0b;color:#1a1a1a;font-weight:bold;padding:4px 8px;border-radius:4px'
  );
}
