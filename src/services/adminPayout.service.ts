/* eslint-disable no-useless-catch */
import axios from 'axios';
import { getCurrentUser } from './auth.service';
import type {
    PayoutOverview,
    PendingReviewResponse,
    AdminWithdrawalDetail,
    FraudLogResponse,
    SystemAlertResponse,
    ApproveResult,
    RejectResult,
    AdminPayoutSummary,
    WithdrawalRequestListResponse
} from '../types/adminPayout.types';
import type { WithdrawalListResponse } from '../types/finance.types';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5166') + '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
    (config) => {
        const user = getCurrentUser();
        if (user?.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Get payout dashboard overview
 */
export const getPayoutOverview = async (): Promise<PayoutOverview> => {
    try {
        const { data } = await api.get('/admin/payout/overview');
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Get simplified payout summary for dashboard cards
 */
export const getPayoutSummary = async (): Promise<AdminPayoutSummary> => {
    try {
        const { data } = await api.get('/admin/payout/overview');
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Get paged list of requests pending manual review
 */
export const getPendingReview = async (page: number = 1, pageSize: number = 20): Promise<PendingReviewResponse> => {
    try {
        const { data } = await api.get('/admin/payout/pending-review', {
            params: { page, pageSize },
        });
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Get filtered withdrawal requests for admin list
 */
export const getWithdrawalRequests = async (
    page: number = 1,
    pageSize: number = 10,
    status?: string
): Promise<WithdrawalRequestListResponse> => {
    try {
        const { data } = await api.get('/admin/payout/requests', {
            params: { page, pageSize, status },
        });
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Get all payout requests with filters
 */
export const getAllPayoutRequests = async (params: {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
    from?: string;
    to?: string;
}): Promise<WithdrawalListResponse> => {
    try {
        const { data } = await api.get('/admin/payout/requests', { params });
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Get detailed request info for admin review
 */
export const getPayoutRequestDetail = async (id: number): Promise<AdminWithdrawalDetail> => {
    try {
        const { data } = await api.get(`/admin/payout/requests/${id}`);
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Manually approve a flagged request
 */
export const approvePayoutRequest = async (id: number, note?: string): Promise<ApproveResult> => {
    try {
        const { data } = await api.post(`/admin/payout/requests/${id}/approve`, { note });
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Manually reject a flagged request
 */
export const rejectPayoutRequest = async (id: number, reason: string): Promise<RejectResult> => {
    try {
        const { data } = await api.post(`/admin/payout/requests/${id}/reject`, { reason });
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Get current PayOS balance and alert levels
 */
export const getPayOSBalance = async (): Promise<{ balance: number; currency: string; alertLevel: string }> => {
    const { data } = await api.get('/admin/payout/payos-balance');
    return data.content;
};

/**
 * Get system fraud logs
 */
export const getFraudLogs = async (params: {
    page?: number;
    pageSize?: number;
    tutorId?: string;
    ruleName?: string;
    passed?: boolean;
    from?: string;
    to?: string;
}): Promise<FraudLogResponse> => {
    try {
        const { data } = await api.get('/admin/payout/fraud-logs', { params });
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Get system integrity alerts
 */
export const getSystemAlerts = async (params: {
    page?: number;
    pageSize?: number;
    resolved?: boolean;
}): Promise<SystemAlertResponse> => {
    try {
        const { data } = await api.get('/admin/payout/system-alerts', { params });
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Resolve a system alert
 */
export const resolveSystemAlert = async (id: number): Promise<void> => {
    try {
        await api.post(`/admin/payout/system-alerts/${id}/resolve`);
    } catch (error) {
        throw error;
    }
};
