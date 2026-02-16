/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5166') + '/api';
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
 * Lấy thông tin user từ JWT token
 */
export const getUserInfoFromToken = () => {
  const user = getCurrentUser();
  if (!user || !user.accessToken) return null;

  const payload = decodeJWT(user.accessToken);
  if (!payload) return null;

  // Extract user info from JWT claims
  const emailClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
  const nameClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
  const givenNameClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
  const surnameClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";

  return {
    email: payload[emailClaim] || payload.email,
    fullname: payload[nameClaim] || payload.name,
    firstName: payload[givenNameClaim] || payload.given_name,
    lastName: payload[surnameClaim] || payload.family_name,
    userId: getUserIdFromToken(),
    role: getCurrentUserRole(),
    ...user // Include original user data (accessToken, etc.)
  };
};

/**
 * Xóa thông tin user (Dùng khi Logout)
 */
export const clearUserFromStorage = () => {
  localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
};

// --- ROLE MANAGEMENT FUNCTIONS ---

/**
 * Decode JWT token để lấy payload
 */
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Lấy role từ Backend JWT token
 */
export const getRoleFromToken = (token: string): string | null => {
  const payload = decodeJWT(token);
  if (!payload) return null;

  // Backend sử dụng Microsoft claim format
  const roleClaimKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  return payload[roleClaimKey] || null;
};

/**
 * Lấy role của user hiện tại từ JWT accessToken
 */
export const getCurrentUserRole = (): string | null => {
  const user = getCurrentUser();
  if (!user) return null;

  // Decode từ Backend JWT token
  if (user.accessToken) {
    return getRoleFromToken(user.accessToken);
  }

  return null;
};

/**
 * Lấy userId từ JWT token
 */
export const getUserIdFromToken = (): string | null => {
  const user = getCurrentUser();
  if (!user || !user.accessToken) return null;

  const payload = decodeJWT(user.accessToken);
  if (!payload) return null;

  // Backend sử dụng Microsoft claim format cho NameIdentifier (userId)
  const userIdClaimKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
  return payload[userIdClaimKey] || payload.sub || payload.userId || null;
};

/**
 * Kiểm tra user có role cụ thể không
 */
export const hasRole = (requiredRole: string): boolean => {
  const userRole = getCurrentUserRole();
  return userRole === requiredRole;
};

/**
 * Kiểm tra user có một trong các role được phép không
 */
export const hasAnyRole = (allowedRoles: string[]): boolean => {
  const userRole = getCurrentUserRole();
  return userRole ? allowedRoles.includes(userRole) : false;
};

/**
 * Kiểm tra user đã đăng nhập chưa
 */
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
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

export const loginToBackend = async (accessToken: string, password: string) => {
  try {
    console.log("Gửi yêu cầu đăng nhập thủ công Backend...");

    const response = await api.post("/auth/login-supabase", {
      accessToken: accessToken,
      password: password,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginWithOAuth = async (accessToken: string, email: string) => {
  try {
    console.log("Gửi yêu cầu đăng nhập OAuth Backend...");

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

export const registerUserToBackend = async (supabaseToken: string, password: string, role: string) => {
  try {
    console.log("🔐 Gửi yêu cầu đăng ký tới Backend...");
    console.log("📋 Token length:", supabaseToken?.length);
    console.log("📋 Token preview:", supabaseToken?.substring(0, 50) + "...");
    console.log("👤 Role:", role);

    const payload = {
      supabaseToken: supabaseToken,
      password: password,
      role: role
    };

    // Endpoint: /api/auth/register-supabase
    const response = await api.post("/auth/register-supabase", payload);
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

// --- USER PROFILE WITH EKYC ---

export const getUserProfile = async (userId: string) => {
  const user = getCurrentUser();
  const response = await api.get(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${user?.accessToken}` }
  });
  return response.data;
};

export const parseEKYCData = (ekycRawData: string | null) => {
  if (!ekycRawData) return null;
  try {
    return JSON.parse(ekycRawData);
  } catch (error) {
    return null;
  }
};

// --- PASSWORD MANAGEMENT ---

/**
 * Sync password with backend after Supabase password reset
 */
export const syncPassword = async (supabaseToken: string, newPassword: string) => {
  try {
    console.log("🔄 Syncing password with backend...");
    const response = await api.put("/passwords/sync", {
      supabaseToken,
      newPassword
    });
    console.log("✅ Password synced successfully");
    return response.data;
  } catch (error) {
    console.error("❌ Password sync error:", error);
    throw error;
  }
};

/**
 * Change password (requires old password)
 */
export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    console.log("🔄 Changing password...");
    const user = getCurrentUser();
    const response = await api.put("/passwords/change", {
      oldPassword,
      newPassword
    }, {
      headers: { Authorization: `Bearer ${user?.accessToken}` }
    });
    console.log("✅ Password changed successfully");
    return response.data;
  } catch (error) {
    console.error("❌ Password change error:", error);
    throw error;
  }
};

