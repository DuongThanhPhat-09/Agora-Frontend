// ============================================================
// MOCK ADAPTER — custom axios adapter trả về mock data
// thay vì gửi HTTP request thật.
// ============================================================

import type { AxiosAdapter, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { resolveMockResponse } from './handlers';

// Delay nhẹ để UI không "flash" tức thì (giống latency thật)
const MOCK_DELAY_MS = 120;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockAdapter: AxiosAdapter = async (
  config: InternalAxiosRequestConfig
): Promise<AxiosResponse> => {
  await sleep(MOCK_DELAY_MS);

  const data = resolveMockResponse(config);

  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    config,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
};
