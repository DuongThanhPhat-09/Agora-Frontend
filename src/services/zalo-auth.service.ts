import { isZaloMiniApp } from './zalo-env';
import { storageAdapter } from './storage.adapter';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5166') + '/api';

export interface ZaloLoginResult {
  accessToken: string;
  refreshToken: string;
  userId: string;
  fullname: string;
  role: string;
}

/**
 * Thực hiện Zalo OAuth flow:
 * 1. Authorize + lấy access token từ Zalo SDK
 * 2. Lấy user info từ Zalo
 * 3. Exchange lấy Tutora JWT từ backend
 * 4. Lưu vào storage adapter
 */
export const loginWithZalo = async (): Promise<ZaloLoginResult> => {
  if (!isZaloMiniApp()) {
    throw new Error('loginWithZalo chỉ chạy được trong Zalo Mini App');
  }

  const { authorize, getAccessToken, getUserInfo } = await import('zmp-sdk/apis');

  // 1. Authorize user (prompt nếu chưa grant)
  await authorize({});

  // 2. Lấy Zalo access token
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tokenResult = await getAccessToken({}) as any;
  const zaloToken: string = tokenResult?.accessToken ?? tokenResult;

  // 3. Lấy Zalo user info
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userInfoResult = await getUserInfo({}) as any;
  const userInfo = userInfoResult?.userInfo ?? userInfoResult;

  // 4. Exchange với backend Tutora
  const response = await fetch(`${API_BASE_URL}/auth/login-zalo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      zaloAccessToken: zaloToken,
      zaloUserId: userInfo.id,
      name: userInfo.name,
      avatar: userInfo.avatar?.small || userInfo.avatar,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.message || `Zalo auth failed: ${response.status}`);
  }

  const result = await response.json();
  const { token, refreshToken } = result.content;

  // 5. Lưu JWT vào storage
  const userData = {
    accessToken: token,
    refreshToken,
  };
  await storageAdapter.set('TUTORA_user_data', JSON.stringify(userData));

  return {
    accessToken: token,
    refreshToken,
    userId: result.content.userId || '',
    fullname: result.content.fullname || userInfo.name || '',
    role: result.content.role || 'Parent',
  };
};

/**
 * Kiểm tra user đã login Zalo chưa, nếu chưa thì trigger login flow
 */
export const ensureZaloAuth = async (): Promise<boolean> => {
  if (!isZaloMiniApp()) return true;

  const cached = storageAdapter.getCachedUser();
  if (cached?.accessToken) return true;

  try {
    await loginWithZalo();
    return true;
  } catch (err) {
    console.error('[ZaloAuth] ensureZaloAuth failed:', err);
    return false;
  }
};
