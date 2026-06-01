import axios from 'axios';
import { getAuthHeaders } from './tutorProfile.service';
import { setupAuthInterceptor } from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});
setupAuthInterceptor(api);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TRTCRoomInfo {
  roomId: number;
  userId: string;
  userSig: string;
  sdkAppId: number;
  expireAt: number;
  participantNames?: Record<string, string>;
}

export interface TRTCApiResponse {
  content: TRTCRoomInfo;
  message: string;
  statusCode: number;
}

// ── API calls ─────────────────────────────────────────────────────────────────

/**
 * Lấy thông tin phòng TRTC để join video call của một buổi học.
 * Cần phải là Tutor/Parent/Student thuộc buổi học đó.
 */
export const getTRTCRoomInfo = async (lessonId: number): Promise<TRTCRoomInfo> => {
  const response = await api.get<TRTCApiResponse>(`/trtc/room/${lessonId}`, {
    headers: getAuthHeaders(),
  });
  return response.data.content;
};
