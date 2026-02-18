import axios from 'axios';
import { getAuthHeaders } from './tutorProfile.service';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5166') + '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// DTO matching backend NotificationResponse
export interface NotificationDTO {
    notificationid: number;
    userid: string;
    title: string;
    message: string;
    isread: boolean | null;
    createdat: string | null;
    username?: string;
    userfullname?: string;
}

export interface ApiResponse<T> {
    statusCode: number;
    status: string;
    message: string;
    content: T;
}

/**
 * Get all notifications for current user
 */
export const getMyNotifications = async (): Promise<NotificationDTO[]> => {
    try {
        const response = await api.get('/notifications/my-notifications', {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

/**
 * Get unread notifications only
 */
export const getUnreadNotifications = async (): Promise<NotificationDTO[]> => {
    try {
        const response = await api.get('/notifications/my-notifications/unread', {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching unread notifications:', error);
        throw error;
    }
};

/**
 * Get count of unread notifications
 */
export const getUnreadCount = async (): Promise<number> => {
    try {
        const response = await api.get('/notifications/my-notifications/unread-count', {
            headers: getAuthHeaders(),
        });
        // Backend returns: { unreadCount: number }
        return response.data.unreadCount || 0;
    } catch (error: any) {
        console.error('Error fetching unread count:', error);
        // Return 0 on error to prevent UI breaking
        return 0;
    }
};

/**
 * Mark a specific notification as read
 */
export const markAsRead = async (notificationId: number): Promise<void> => {
    try {
        await api.put(`/notifications/${notificationId}/mark-read`, null, {
            headers: getAuthHeaders(),
        });
    } catch (error: any) {
        console.error(`Error marking notification ${notificationId} as read:`, error);
        throw error;
    }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<void> => {
    try {
        await api.put('/notifications/mark-all-read', null, {
            headers: getAuthHeaders(),
        });
    } catch (error: any) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
};

/**
 * Delete a specific notification
 */
export const deleteNotification = async (notificationId: number): Promise<void> => {
    try {
        await api.delete(`/notifications/${notificationId}`, {
            headers: getAuthHeaders(),
        });
    } catch (error: any) {
        console.error(`Error deleting notification ${notificationId}:`, error);
        throw error;
    }
};

/**
 * Delete all notifications for current user
 */
export const deleteAllMyNotifications = async (): Promise<void> => {
    try {
        await api.delete('/notifications/my-notifications', {
            headers: getAuthHeaders(),
        });
    } catch (error: any) {
        console.error('Error deleting all notifications:', error);
        throw error;
    }
};
