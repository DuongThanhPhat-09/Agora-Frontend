/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getAuthHeaders, type ApiResponse } from './tutorProfile.service';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ===== TYPES =====

export interface ScheduleItemPayload {
    dayOfWeek: number;  // 0 (Sunday) - 6 (Saturday)
    startTime: string;  // HH:mm
    endTime: string;    // HH:mm
}

/**
 * Matches backend CreateBookingDTO exactly.
 * Backend auto-calculates: sessionCount, price, finalPrice, fees.
 */
export interface CreateBookingPayload {
    studentId: string;
    tutorId: string;
    subjectId: number;
    teachingMode: 'online' | 'offline' | 'hybrid';
    schedule: ScheduleItemPayload[];
    locationCity?: string;
    locationDistrict?: string;
    locationWard?: string;
    locationDetail?: string;
    promotionCode?: string;
}

export interface BookingResponseDTO {
    bookingId: number;
    student: { studentId: string; fullName: string; gradeLevel: string };
    tutor: { tutorId: string; fullName: string; avatarUrl: string; hourlyRate: number };
    subject: { subjectId: number; subjectName: string };
    packageType: string;
    sessionCount: number;
    price: number;
    discountApplied: number;
    finalPrice: number;
    platformFee: number;
    status: string;
    paymentStatus: string;
    paymentCode: string;
    schedule: ScheduleItemPayload[];
    createdAt: string;
    paymentDueAt: string | null;
}

export interface PromotionValidateResult {
    valid: boolean;
    code?: string;
    discountType?: string;      // "percentage" | "fixed"
    discountValue?: number;
    maxDiscountAmount?: number;
    minOrderValue?: number;
    message?: string;
}

// ===== API FUNCTIONS =====

/** POST /api/bookings — Create a new booking */
export const createBooking = async (payload: CreateBookingPayload): Promise<ApiResponse<BookingResponseDTO>> => {
    try {
        const response = await api.post('/bookings', payload, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error: any) {
        console.error('❌ Error creating booking:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        throw error;
    }
};

/** GET /api/promotions/validate — Validate a promotion code */
export const validatePromotion = async (code: string, orderValue: number): Promise<ApiResponse<PromotionValidateResult>> => {
    try {
        const response = await api.get('/promotions/validate', {
            headers: getAuthHeaders(),
            params: { code, orderValue },
        });
        return response.data;
    } catch (error: any) {
        console.error('❌ Error validating promotion:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        throw error;
    }
};

/** GET /api/bookings/:id — Get booking detail */
export const getBookingById = async (id: number): Promise<ApiResponse<BookingResponseDTO>> => {
    try {
        const response = await api.get(`/bookings/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error: any) {
        console.error('❌ Error fetching booking:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        throw error;
    }
};

/** POST /api/bookings/:id/apply-promotion — Apply promotion to existing booking */
export const applyPromotion = async (bookingId: number, promotionCode: string): Promise<ApiResponse<BookingResponseDTO>> => {
    try {
        const response = await api.post(`/bookings/${bookingId}/apply-promotion`, { promotionCode }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error: any) {
        console.error('❌ Error applying promotion:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        throw error;
    }
};

/** DELETE /api/bookings/:id — Cancel a pending booking */
export const cancelBooking = async (bookingId: number): Promise<ApiResponse<string>> => {
    try {
        const response = await api.delete(`/bookings/${bookingId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error: any) {
        console.error('❌ Error cancelling booking:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        throw error;
    }
};
