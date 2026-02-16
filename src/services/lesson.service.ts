import axios from 'axios';
import { getAuthHeaders, type ApiResponse } from './tutorProfile.service';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LessonResponse {
  lessonId: number;
  bookingId?: number;
  scheduledStart: string;
  scheduledEnd: string;
  submittedAt?: string;
  confirmDeadline?: string;
  tutorName?: string;
  tutorAvatarUrl?: string;
  studentName?: string;
  subjectName?: string;
  lessonPrice?: number;
  lessonContent?: string;
  homework?: string;
  tutorNotes?: string;
}

export interface PagedList<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Get parent's lessons
 */
export const getParentLessons = async (
  page: number = 1,
  pageSize: number = 20,
  fromDate?: string,
  status?: string
): Promise<ApiResponse<PagedList<LessonResponse>>> => {
  try {
    const params: Record<string, any> = { page, pageSize };
    if (fromDate) params.fromDate = fromDate;
    if (status) params.status = status;

    const response = await api.get('/parent/lessons', {
      headers: getAuthHeaders(),
      params,
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching parent lessons:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

/**
 * Get upcoming lesson (next lesson)
 */
export const getNextLesson = async (): Promise<LessonResponse | null> => {
  try {
    const now = new Date().toISOString();
    const response = await getParentLessons(1, 1, now, 'upcoming');
    
    if (response.data && response.data.items && response.data.items.length > 0) {
      return response.data.items[0];
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error fetching next lesson:', error);
    return null;
  }
};
