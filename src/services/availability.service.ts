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
    dayofweek: number;  // 0=Sunday, 1=Monday, ..., 6=Saturday
    starttime: string;  // "HH:mm" format
    endtime: string;    // "HH:mm" format
    createdat: string;
    dayName: string;
}

export interface CreateAvailabilityData {
    dayofweek: number;  // 0=Sunday, 1=Monday, ..., 6=Saturday
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
// Backend uses: 0=Sunday, 1=Monday, 2=Tuesday, ..., 6=Saturday
export const DAY_OF_WEEK_MAP: Record<number, string> = {
    0: 'Chủ nhật',
    1: 'Thứ 2',
    2: 'Thứ 3',
    3: 'Thứ 4',
    4: 'Thứ 5',
    5: 'Thứ 6',
    6: 'Thứ 7',
};

export const DAY_OF_WEEK_MAP_EN: Record<number, string> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
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
