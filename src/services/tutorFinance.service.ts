/* eslint-disable no-useless-catch */
import axios from 'axios';
import { getCurrentUser } from './auth.service';
import type {
    FinanceSummary,
    EarningsResponse,
    TransactionPagedResponse,
    TutorTransaction,
    BankInfo,
    WithdrawalListResponse,
    WithdrawalDetail,
    CreateWithdrawalRequest
} from '../types/finance.types';

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
 * Get financial summary (balances, total earned)
 */
export const getFinanceSummary = async (): Promise<FinanceSummary> => {
    try {
        const { data } = await api.get('/tutor/finance/summary');
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Get earnings history for charts
 * @param period - 'week', 'month', 'year'
 */
export const getEarnings = async (
    period: string = 'month',
    from?: string,
    to?: string
): Promise<EarningsResponse> => {
    try {
        const { data } = await api.get('/tutor/finance/earnings', {
            params: { period, from, to },
        });
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Get paged transaction history
 */
export const getTransactions = async (params: {
    page?: number;
    pageSize?: number;
    type?: string;
    from?: string;
    to?: string;
}): Promise<TransactionPagedResponse> => {
    try {
        const { data } = await api.get('/tutor/finance/transactions', { params });
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Get transaction detail
 */
export const getTransactionDetail = async (id: number): Promise<TutorTransaction> => {
    try {
        const { data } = await api.get(`/tutor/finance/transactions/${id}`);
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Get current bank info
 */
export const getBankInfo = async (): Promise<BankInfo> => {
    try {
        const { data } = await api.get('/tutor/bank-info');
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Update bank info
 */
export const updateBankInfo = async (request: Partial<BankInfo>): Promise<BankInfo> => {
    const { data } = await api.put('/tutor/bank-info', request);
    return data.content;
};

/**
 * Create a withdrawal request
 */
export const createWithdrawal = async (request: CreateWithdrawalRequest): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.post('/tutor/withdrawals', request);
    return data;
};

/**
 * Get paged list of withdrawals
 */
export const getWithdrawals = async (page: number = 1, pageSize: number = 20): Promise<WithdrawalListResponse> => {
    try {
        const { data } = await api.get('/tutor/withdrawals', {
            params: { page, pageSize },
        });
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Get withdrawal details
 */
export const getWithdrawalDetail = async (id: number): Promise<WithdrawalDetail> => {
    try {
        const { data } = await api.get(`/tutor/withdrawals/${id}`);
        return data.content;
    } catch (error) {
        throw error;
    }
};

/**
 * Cancel a pending/delayed withdrawal
 */
export const cancelWithdrawal = async (id: number): Promise<void> => {
    try {
        await api.delete(`/tutor/withdrawals/${id}`);
    } catch (error) {
        throw error;
    }
};
