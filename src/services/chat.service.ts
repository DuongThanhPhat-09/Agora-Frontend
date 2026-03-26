/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getAuthHeaders, type ApiResponse } from './tutorProfile.service';
import { setupAuthInterceptor } from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
setupAuthInterceptor(api);

export interface ChatChannel {
  channelId: number;
  bookingId: number;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatarUrl: string;
  status: string;
  lastMessageAt: string;
  lastMessagePreview: string;
}

export interface ChatMessageQuery {
  page: number;
  pageSize: number;
  search?: string;
}

export interface ChatMessage {
  messageId: number;
  channelId: number;
  senderId: string;
  senderName?: string;
  senderAvatarUrl?: string;
  content: string;
  messageType: string;
  createdAt: string;
  metadata?: any;
  isRead?: boolean;
  readAt?: string;
}

export const getChats = async (): Promise<ApiResponse<ChatChannel[]>> => {
  try {
    const response = await api.get(`/chat/channels`, {
      headers: getAuthHeaders(),
    });

    console.log('✅ Chat channels fetched:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching chat channels:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const getChatMessages = async (
  channelId: number,
  query: ChatMessageQuery = { page: 1, pageSize: 50 },
): Promise<ApiResponse<ChatMessage[]>> => {
  try {
    const params: any = { page: query.page, pageSize: query.pageSize };
    if (query.search) params.search = query.search;

    const response = await api.get(`/chat/channels/${channelId}/messages`, {
      headers: getAuthHeaders(),
      params,
    });

    console.log('✅ Chat messages fetched:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching chat messages:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

/** POST /api/chat/channels/:id/messages — Send message via REST API (supports messageType + metadata) */
export const sendMessageREST = async (
  channelId: number,
  content: string,
  messageType: string = 'text',
  metadata?: any,
): Promise<ApiResponse<ChatMessage>> => {
  try {
    const response = await api.post(
      `/chat/channels/${channelId}/messages`,
      { content, messageType, metadata },
      { headers: getAuthHeaders() },
    );

    console.log('✅ Message sent via REST:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error sending message via REST:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

/** POST /api/chat/channels/:id/upload-image — Upload image and send as chat message */
export const uploadChatImage = async (channelId: number, file: File): Promise<ApiResponse<ChatMessage>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const authHeaders = getAuthHeaders();
    const response = await api.post(`/chat/channels/${channelId}/upload-image`, formData, {
      headers: {
        ...authHeaders,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ Image sent via chat:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error uploading chat image:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

/** PUT /api/chat/channels/:id/read — Mark all unread messages in channel as read */
export const markMessagesAsRead = async (channelId: number): Promise<void> => {
  try {
    await api.put(`/chat/channels/${channelId}/read`, {}, { headers: getAuthHeaders() });
  } catch (error: any) {
    console.error('❌ Error marking messages as read:', error.message);
  }
};

/**
 * POST /api/chat/channels — Create or get existing channel with a tutor.
 * Used by "CHAT TƯ VẤN" on TutorDetailPage (no booking required).
 */
export const createChannel = async (
  tutorId: string,
): Promise<ApiResponse<{ channelId: number }>> => {
  try {
    const response = await api.post(
      `/chat/channels`,
      { tutorId },
      { headers: getAuthHeaders() },
    );

    console.log('✅ Channel created/retrieved:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error creating channel:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};
