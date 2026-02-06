/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getAuthHeaders, type ApiResponse } from './tutorProfile.service';
import type { StudentType } from '../types/student.type';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStudents = async (): Promise<ApiResponse<StudentType[]>> => {
  try {
    const response = await api.get(`/parent/students`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching verification progress:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};
