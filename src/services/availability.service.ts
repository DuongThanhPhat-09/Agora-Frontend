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

// ============================================
// Types for Availability API
// ============================================

export interface AvailabilitySlot {
    availabilityid: number;
    tutorid: string;
    dayofweek: number;  // 2=T2, 3=T3, 4=T4, 5=T5, 6=T6, 7=T7, 8=CN
    starttime: string;  // "HH:mm" format
    endtime: string;    // "HH:mm" format
    createdat: string;
    dayName: string;
}

export interface CreateAvailabilityData {
    dayofweek: number;  // 2=T2, 3=T3, 4=T4, 5=T5, 6=T6, 7=T7, 8=CN
    starttime: string;  // "HH:mm" format
    endtime: string;    // "HH:mm" format
}

export interface ApiResponse<T = any> {
    content: T;
    statusCode: number;
    message: string;
    error: string | null;
}

// ============================================
// Helper Functions
// ============================================

const getAuthHeaders = () => {
    const user = getCurrentUser();
    return {
        Authorization: `Bearer ${user?.accessToken}`
    };
};

// Day mapping constants
export const DAY_OF_WEEK_MAP: Record<number, string> = {
    2: 'Thứ 2',
    3: 'Thứ 3',
    4: 'Thứ 4',
    5: 'Thứ 5',
    6: 'Thứ 6',
    7: 'Thứ 7',
    8: 'Chủ nhật',
};

export const DAY_OF_WEEK_MAP_EN: Record<number, string> = {
    2: 'Monday',
    3: 'Tuesday',
    4: 'Wednesday',
    5: 'Thursday',
    6: 'Friday',
    7: 'Saturday',
    8: 'Sunday',
};

// ============================================
// API Functions
// ============================================

/**
 * Get all availability slots for a tutor
 * GET /api/tutor/availability/{tutorId}
 *
 * @param tutorId - Tutor ID
 * @returns List of availability slots
 */
export const getAvailability = async (tutorId: string): Promise<ApiResponse<AvailabilitySlot[]>> => {
    const response = await api.get(`/tutor/availability/${tutorId}`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

/**
 * Create a new availability slot
 * POST /api/tutor/availability
 *
 * @param data - Availability slot data
 * @returns Created availability slot
 */
export const createAvailability = async (
    data: CreateAvailabilityData
): Promise<ApiResponse<AvailabilitySlot>> => {
    const response = await api.post(
        '/tutor/availability',
        data,
        {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};

/**
 * Update an availability slot
 * PUT /api/tutor/availability/{id}
 *
 * @param availabilityId - Availability slot ID
 * @param data - Updated availability slot data
 * @returns Updated availability slot
 */
export const updateAvailability = async (
    availabilityId: number,
    data: CreateAvailabilityData
): Promise<ApiResponse<AvailabilitySlot>> => {
    const response = await api.put(
        `/tutor/availability/${availabilityId}`,
        data,
        {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};

/**
 * Delete an availability slot
 * DELETE /api/tutor/availability/{id}
 *
 * @param availabilityId - Availability slot ID
 * @returns API response
 */
export const deleteAvailability = async (
    availabilityId: number
): Promise<ApiResponse> => {
    const response = await api.delete(`/tutor/availability/${availabilityId}`, {
        headers: getAuthHeaders()
    });
    return response.data;
};
