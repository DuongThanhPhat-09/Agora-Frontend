/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import axios from "axios";

const API_BASE_URL = "http://localhost:5166/api";
const USER_LOCAL_STORAGE_KEY = "agora_user_data"; // Key để lưu thông tin user

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- CÁC HÀM TIỆN ÍCH LOCAL STORAGE ---

/**
 * Lưu thông tin user vào LocalStorage
 */
export const saveUserToStorage = (userData: any) => {
  if (userData) {
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(userData));
  }
};

/**
 * Lấy thông tin user hiện tại từ LocalStorage
 */
export const getCurrentUser = () => {
  const data = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Xóa thông tin user (Dùng khi Logout)
 */
export const clearUserFromStorage = () => {
  localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
};

// --- CÁC HÀM API ---

export const checkEmailExists = async (email: string) => {
  try {
    const response = await api.get(`/users/by-email/${email}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const loginToBackend = async (accessToken: string, email: string) => {
  try {
    console.log("Gửi yêu cầu đăng nhập Backend...");

    const response = await api.post("/auth/login-supabase", {
      accessToken: accessToken,
      email: email,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginManual = async (accessToken: string, password: string) => {
  try {
    console.log("Gửi yêu cầu đăng nhập thủ công tới Backend...");

    const payload = {
      accessToken: accessToken,
      password: password
    };

    const response = await api.post("/auth/login-supabase", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUserToBackend = async (supabaseToken: string, password: string) => {
  try {
    console.log("🔐 Gửi yêu cầu đăng ký tới Backend...");
    console.log("📋 Token length:", supabaseToken?.length);
    console.log("📋 Token preview:", supabaseToken?.substring(0, 50) + "...");

    const payload = {
      supabaseToken: supabaseToken,
      password: password
    };

    const response = await api.post("/registrations/register-supabase", payload);
    console.log("✅ Backend registration successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Backend registration error:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Full error:", error);
    throw error;
  }
};
