/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type { VerificationRequest, VerificationResponse } from '../types/verification.types';
import { getCurrentUser } from './auth.service';

const API_BASE_URL = 'http://localhost:5166/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const user = getCurrentUser();
    if (user && user.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
});

/**
 * Submit CCCD verification to backend
 * @param frontImagePath - Path to front image in Supabase (e.g., "u123/cccd_front.jpg")
 * @param backImagePath - Path to back image in Supabase (e.g., "u123/cccd_back.jpg")
 * @returns Verification response
 */
export const submitVerification = async (
    frontImagePath: string,
    backImagePath: string
): Promise<VerificationResponse> => {
    try {
        // Backend expects PascalCase field names: FrontImgPath and BackImgPath
        const payload: VerificationRequest = {
            FrontImgPath: frontImagePath,
            BackImgPath: backImagePath
        };

        const response = await api.post('/tutor-verification/submit', payload);

        return {
            success: true,
            message: response.data.message || 'Gửi xác thực thành công',
            verificationId: response.data.verificationId,
            status: response.data.status || 'pending'
        };

    } catch (error: any) {
        console.error('❌ Verification submission error:', error);
        console.error('📄 Error response data:', error.response?.data);
        console.error('📊 Error response status:', error.response?.status);
        console.error('📋 Error response headers:', error.response?.headers);

        // Log validation errors in detail
        if (error.response?.data?.errors) {
            console.error('🔍 Validation errors:', JSON.stringify(error.response.data.errors, null, 2));
        }

        const errorMessage = error.response?.data?.message
            || error.response?.data?.Message
            || error.response?.data?.title
            || error.message
            || 'Có lỗi xảy ra khi gửi xác thực';

        return {
            success: false,
            message: errorMessage
        };
    }
};

/**
 * Get current verification status (if backend provides this endpoint)
 * @returns Verification status
 */
export const getVerificationStatus = async (): Promise<VerificationResponse | null> => {
    try {
        const response = await api.get('/tutor-verification/status');
        return response.data;
    } catch (error: any) {
        console.error('❌ Error getting verification status:', error);
        return null;
    }
};
