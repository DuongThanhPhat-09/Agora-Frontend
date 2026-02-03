/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import axios from 'axios';
import { getCurrentUser } from './auth.service';
import type {
  // Dashboard
  DashboardMetrics,
  RevenueChartData,
  UserGrowthData,
  RecentActivity,
  // Vetting
  TutorForReview,
  TutorDetailForReview,
  ApproveTutorResponse,
  RejectTutorRequest,
  RejectTutorResponse,
  VerifyIdentityResponse,
  VerifyCredentialResponse,
  // Disputes
  DisputeListItem,
  DisputeDetail,
  ResolveDisputeRequest,
  IssueWarningRequest,
  SuspendUserRequest,
  // Financials
  FinancialMetrics,
  WithdrawalRequest,
  Transaction,
  // User Management
  UserListItem,
  UserDetail,
  // Settings
  Subject,
  PlatformConfig,
  // Common
  ApiResponse,
  PaginationParams,
  FilterParams,
} from '../types/admin.types';

const API_BASE_URL = 'http://192.168.1.246:5166/api';

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

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.error('Unauthorized - redirecting to login');
      // Optionally clear storage and redirect
      // clearUserFromStorage();
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// DASHBOARD APIs (ADM-01)
// ============================================

/**
 * Get dashboard metrics (8 KPIs)
 * Total Users, Pending Tutors, Active Bookings, Open Disputes,
 * Total GMV, Net Revenue, Escrow Balance, Pending Withdrawals
 */
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    const { data } = await api.get('/admin/dashboard/metrics');
    return data;
  } catch (error) {
    console.error('getDashboardMetrics error:', error);
    throw error;
  }
};

/**
 * Get revenue chart data (line chart)
 * @param days - Number of days to fetch (default: 30)
 */
export const getRevenueChart = async (
  days: number = 30
): Promise<RevenueChartData[]> => {
  try {
    const { data } = await api.get('/admin/dashboard/revenue-chart', {
      params: { days },
    });
    return data;
  } catch (error) {
    console.error('getRevenueChart error:', error);
    throw error;
  }
};

/**
 * Get user growth chart data (bar chart)
 * @param months - Number of months to fetch (default: 6)
 */
export const getUserGrowthChart = async (
  months: number = 6
): Promise<UserGrowthData[]> => {
  try {
    const { data } = await api.get('/admin/dashboard/user-growth', {
      params: { months },
    });
    return data;
  } catch (error) {
    console.error('getUserGrowthChart error:', error);
    throw error;
  }
};

/**
 * Get recent activities feed
 * @param limit - Number of activities to fetch (default: 10)
 */
export const getRecentActivities = async (
  limit: number = 10
): Promise<RecentActivity[]> => {
  try {
    const { data } = await api.get('/admin/dashboard/activities', {
      params: { limit },
    });
    return data;
  } catch (error) {
    console.error('getRecentActivities error:', error);
    throw error;
  }
};

// ============================================
// VETTING APIs (ADM-02)
// ============================================

/**
 * Get list of pending tutors for review
 */
export const getPendingTutors = async (): Promise<TutorForReview[]> => {
  try {
    const { data } = await api.get('/admin/vetting/pending');
    return data;
  } catch (error) {
    console.error('getPendingTutors error:', error);
    throw error;
  }
};

/**
 * Get detailed tutor information for review
 * Includes: user info, profile, subjects, availability, credentials
 */
export const getTutorDetailForReview = async (
  tutorId: string
): Promise<TutorDetailForReview> => {
  try {
    const { data } = await api.get(`/admin/vetting/${tutorId}`);
    return data;
  } catch (error) {
    console.error('getTutorDetailForReview error:', error);
    throw error;
  }
};

/**
 * Approve tutor profile
 * Updates: profilestatus = 'approved', ispublic = true, verifiedat, verifiedby
 */
export const approveTutor = async (
  tutorId: string
): Promise<ApproveTutorResponse> => {
  try {
    const { data } = await api.post(`/admin/vetting/${tutorId}/approve`);
    return data;
  } catch (error) {
    console.error('approveTutor error:', error);
    throw error;
  }
};

/**
 * Reject tutor profile with reason
 * @param tutorId - Tutor ID
 * @param rejectionNote - Rejection reason (min 20 chars)
 */
export const rejectTutor = async (
  tutorId: string,
  request: RejectTutorRequest
): Promise<RejectTutorResponse> => {
  try {
    const { data } = await api.post(`/admin/vetting/${tutorId}/reject`, request);
    return data;
  } catch (error) {
    console.error('rejectTutor error:', error);
    throw error;
  }
};

/**
 * Verify tutor identity (CCCD)
 * Updates: users.isidentityverified = true
 */
export const verifyTutorIdentity = async (
  tutorId: string
): Promise<VerifyIdentityResponse> => {
  try {
    const { data } = await api.post(`/admin/vetting/${tutorId}/verify-identity`);
    return data;
  } catch (error) {
    console.error('verifyTutorIdentity error:', error);
    throw error;
  }
};

/**
 * Verify individual credential (certificate)
 * @param tutorId - Tutor ID
 * @param credentialIndex - Index of credential in JSONB array
 */
export const verifyCredential = async (
  tutorId: string,
  credentialIndex: number
): Promise<VerifyCredentialResponse> => {
  try {
    const { data } = await api.post(
      `/admin/vetting/${tutorId}/credentials/${credentialIndex}/verify`
    );
    return data;
  } catch (error) {
    console.error('verifyCredential error:', error);
    throw error;
  }
};

// ============================================
// DISPUTES APIs (ADM-03)
// ============================================

/**
 * Get list of disputes with optional filtering
 * @param filters - Status filter (pending, investigating, resolved)
 */
export const getDisputes = async (
  filters?: FilterParams
): Promise<DisputeListItem[]> => {
  try {
    const { data } = await api.get('/admin/disputes', { params: filters });
    return data;
  } catch (error) {
    console.error('getDisputes error:', error);
    throw error;
  }
};

/**
 * Get detailed dispute information
 * Includes: dispute info, booking, lesson, tutor warnings
 */
export const getDisputeDetail = async (
  disputeId: string
): Promise<DisputeDetail> => {
  try {
    const { data } = await api.get(`/admin/disputes/${disputeId}`);
    return data;
  } catch (error) {
    console.error('getDisputeDetail error:', error);
    throw error;
  }
};

/**
 * Resolve dispute with admin decision
 * Creates transaction, updates dispute status
 */
export const resolveDispute = async (
  disputeId: string,
  request: ResolveDisputeRequest
): Promise<ApiResponse<any>> => {
  try {
    const { data } = await api.post(`/admin/disputes/${disputeId}/resolve`, request);
    return data;
  } catch (error) {
    console.error('resolveDispute error:', error);
    throw error;
  }
};

/**
 * Issue warning to user
 * Creates entry in userwarnings table
 */
export const issueWarning = async (
  request: IssueWarningRequest
): Promise<ApiResponse<any>> => {
  try {
    const { data } = await api.post('/admin/users/warnings', request);
    return data;
  } catch (error) {
    console.error('issueWarning error:', error);
    throw error;
  }
};

/**
 * Suspend tutor profile
 * Updates profilestatus, creates suspensions entry
 */
export const suspendTutor = async (
  request: SuspendUserRequest
): Promise<ApiResponse<any>> => {
  try {
    const { data } = await api.post('/admin/users/suspend', request);
    return data;
  } catch (error) {
    console.error('suspendTutor error:', error);
    throw error;
  }
};

/**
 * Lock user account
 * Updates users.status = 'locked'
 */
export const lockAccount = async (
  userId: string,
  reason: string
): Promise<ApiResponse<any>> => {
  try {
    const { data } = await api.post(`/admin/users/${userId}/lock`, { reason });
    return data;
  } catch (error) {
    console.error('lockAccount error:', error);
    throw error;
  }
};

// ============================================
// FINANCIALS APIs (ADM-04)
// ============================================

/**
 * Get financial metrics
 * Total GMV, Net Revenue, Escrow Balance, Total Refunds, Pending Withdrawals
 */
export const getFinancialMetrics = async (): Promise<FinancialMetrics> => {
  try {
    const { data } = await api.get('/admin/financials/metrics');
    return data;
  } catch (error) {
    console.error('getFinancialMetrics error:', error);
    throw error;
  }
};

/**
 * Get list of withdrawal requests
 * @param status - Filter by status (pending, approved, rejected, completed)
 */
export const getWithdrawalRequests = async (
  status?: string
): Promise<WithdrawalRequest[]> => {
  try {
    const { data } = await api.get('/admin/financials/withdrawals', {
      params: status ? { status } : {},
    });
    return data;
  } catch (error) {
    console.error('getWithdrawalRequests error:', error);
    throw error;
  }
};

/**
 * Approve withdrawal request
 * Creates transaction, updates withdrawal status
 */
export const approveWithdrawal = async (
  withdrawalId: string
): Promise<ApiResponse<any>> => {
  try {
    const { data } = await api.post(
      `/admin/financials/withdrawals/${withdrawalId}/approve`
    );
    return data;
  } catch (error) {
    console.error('approveWithdrawal error:', error);
    throw error;
  }
};

/**
 * Reject withdrawal request
 * @param withdrawalId - Withdrawal ID
 * @param reason - Rejection reason
 */
export const rejectWithdrawal = async (
  withdrawalId: string,
  reason: string
): Promise<ApiResponse<any>> => {
  try {
    const { data } = await api.post(
      `/admin/financials/withdrawals/${withdrawalId}/reject`,
      { reason }
    );
    return data;
  } catch (error) {
    console.error('rejectWithdrawal error:', error);
    throw error;
  }
};

/**
 * Get transaction history with pagination and filters
 */
export const getTransactions = async (
  params?: PaginationParams & FilterParams
): Promise<{ transactions: Transaction[]; total: number }> => {
  try {
    const { data } = await api.get('/admin/financials/transactions', { params });
    return data;
  } catch (error) {
    console.error('getTransactions error:', error);
    throw error;
  }
};

// ============================================
// USER MANAGEMENT APIs (ADM-05)
// ============================================

/**
 * Get list of all users with filtering
 * @param filters - Role, status, search filters
 */
export const getAllUsers = async (
  filters?: FilterParams & PaginationParams
): Promise<{ users: UserListItem[]; total: number }> => {
  try {
    const { data } = await api.get('/admin/users', { params: filters });
    return data;
  } catch (error) {
    console.error('getAllUsers error:', error);
    throw error;
  }
};

/**
 * Get detailed user information
 * Includes: user info, wallet, warnings, suspensions, stats
 */
export const getUserDetail = async (userId: string): Promise<UserDetail> => {
  try {
    const { data } = await api.get(`/admin/users/${userId}`);
    return data;
  } catch (error) {
    console.error('getUserDetail error:', error);
    throw error;
  }
};

/**
 * Block user account
 * Updates users.status = 'blocked'
 */
export const blockUser = async (
  userId: string,
  reason: string
): Promise<ApiResponse<any>> => {
  try {
    const { data } = await api.post(`/admin/users/${userId}/block`, { reason });
    return data;
  } catch (error) {
    console.error('blockUser error:', error);
    throw error;
  }
};

/**
 * Unblock user account
 * Updates users.status = 'active'
 */
export const unblockUser = async (userId: string): Promise<ApiResponse<any>> => {
  try {
    const { data } = await api.post(`/admin/users/${userId}/unblock`);
    return data;
  } catch (error) {
    console.error('unblockUser error:', error);
    throw error;
  }
};

/**
 * Reset user password
 * Sends reset email to user
 */
export const resetUserPassword = async (
  userId: string
): Promise<ApiResponse<any>> => {
  try {
    const { data } = await api.post(`/admin/users/${userId}/reset-password`);
    return data;
  } catch (error) {
    console.error('resetUserPassword error:', error);
    throw error;
  }
};

// ============================================
// SETTINGS APIs (ADM-06)
// ============================================

/**
 * Get list of subjects
 */
export const getSubjects = async (): Promise<Subject[]> => {
  try {
    const { data } = await api.get('/admin/settings/subjects');
    return data;
  } catch (error) {
    console.error('getSubjects error:', error);
    throw error;
  }
};

/**
 * Create new subject
 */
export const createSubject = async (
  subject: Partial<Subject>
): Promise<ApiResponse<Subject>> => {
  try {
    const { data } = await api.post('/admin/settings/subjects', subject);
    return data;
  } catch (error) {
    console.error('createSubject error:', error);
    throw error;
  }
};

/**
 * Update existing subject
 */
export const updateSubject = async (
  subjectId: string,
  subject: Partial<Subject>
): Promise<ApiResponse<Subject>> => {
  try {
    const { data } = await api.put(`/admin/settings/subjects/${subjectId}`, subject);
    return data;
  } catch (error) {
    console.error('updateSubject error:', error);
    throw error;
  }
};

/**
 * Delete subject (soft delete)
 * Updates isactive = false
 */
export const deleteSubject = async (
  subjectId: string
): Promise<ApiResponse<any>> => {
  try {
    const { data } = await api.delete(`/admin/settings/subjects/${subjectId}`);
    return data;
  } catch (error) {
    console.error('deleteSubject error:', error);
    throw error;
  }
};

/**
 * Get platform configuration
 */
export const getPlatformConfig = async (): Promise<PlatformConfig> => {
  try {
    const { data } = await api.get('/admin/settings/platform-config');
    return data;
  } catch (error) {
    console.error('getPlatformConfig error:', error);
    throw error;
  }
};

/**
 * Update platform configuration
 */
export const updatePlatformConfig = async (
  config: Partial<PlatformConfig>
): Promise<ApiResponse<PlatformConfig>> => {
  try {
    const { data } = await api.put('/admin/settings/platform-config', config);
    return data;
  } catch (error) {
    console.error('updatePlatformConfig error:', error);
    throw error;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Export data to CSV
 * Generic function for exporting any data
 */
export const exportToCSV = async (
  endpoint: string,
  filename: string
): Promise<void> => {
  try {
    const { data } = await api.get(endpoint, {
      responseType: 'blob',
    });

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('exportToCSV error:', error);
    throw error;
  }
};

/**
 * Get chat history for dispute
 * @param bookingId - Booking ID related to dispute
 */
export const getDisputeChatHistory = async (
  bookingId: string
): Promise<any[]> => {
  try {
    const { data } = await api.get(`/admin/disputes/chat/${bookingId}`);
    return data;
  } catch (error) {
    console.error('getDisputeChatHistory error:', error);
    throw error;
  }
};

/**
 * Upload evidence file for dispute
 * @param disputeId - Dispute ID
 * @param file - File to upload
 */
export const uploadDisputeEvidence = async (
  disputeId: string,
  file: File
): Promise<ApiResponse<string>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post(
      `/admin/disputes/${disputeId}/evidence`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  } catch (error) {
    console.error('uploadDisputeEvidence error:', error);
    throw error;
  }
};
