/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getCurrentUser } from './auth.service';

const API_BASE_URL = 'http://localhost:5166/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request/Response Types for Tutor Profile API
 */
export interface UpdateBasicInfoRequest {
    headline: string;
    bio: string;
    hourlyRate: number;
}

export interface TutorProfileResponse {
    success: boolean;
    message?: string;
    content?: TutorProfile;
    statusCode?: number;
}

export interface TutorProfile {
    tutorId?: string;  // Added tutorId from backend
    headline: string;
    bio: string;
    hourlyRate: number;
    // Add other fields as needed when backend provides more data
}

/**
 * Update tutor basic information (Headline, Bio, Hourly Rate)
 * PUT /api/users/{id}/tutor-profile
 * 
 * @param userId - User ID of the tutor
 * @param data - Basic info data to update
 * @returns API response with updated profile
 */
export const updateBasicInfo = async (
    userId: string,
    data: UpdateBasicInfoRequest
): Promise<TutorProfileResponse> => {
    try {
        const user = getCurrentUser();

        // Debug logging
        console.log('🔍 UPDATE DEBUG:', {
            userId,
            endpoint: `/users/${userId}/tutor-profile`,
            payload: data,
            token: user?.accessToken?.substring(0, 20) + '...'
        });

        const response = await api.put(`/users/${userId}/tutor-profile`, data, {
            headers: {
                Authorization: `Bearer ${user?.accessToken}`
            }
        });

        console.log('✅ UPDATE SUCCESS:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ UPDATE ERROR Details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers
        });

        // Print full error data as string
        console.error('❌ FULL ERROR DATA:', JSON.stringify(error.response?.data, null, 2));

        console.error('Error updating tutor basic info:', error);
        throw error;
    }
};

/**
 * Get tutor profile information
 * GET /api/users/{id}/tutor-profile-info
 * 
 * @param userId - User ID of the tutor (decoded from JWT token)
 * @returns Tutor profile data
 */
export const getTutorProfile = async (userId: string): Promise<TutorProfileResponse> => {
    try {
        const user = getCurrentUser();
        const response = await api.get(`/users/${userId}/tutor-profile-info`, {
            headers: {
                Authorization: `Bearer ${user?.accessToken}`
            }
        });

        // Backend returns { content, statusCode, message }
        // Transform to our expected format
        return {
            success: response.data.statusCode === 200,
            message: response.data.message,
            content: response.data.content
        };
    } catch (error: any) {
        console.error('Error fetching tutor profile:', error);
        throw error;
    }
};
