// src/services/auth.service.ts
const API_URL = "/api/auth/login-supabase";

export const loginToBackend = async (accessToken: string) => {
  try {
    console.log("🔵 Đang gửi Token xuống Backend:", accessToken); // Log để kiểm tra

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Bắt buộc phải có dòng này
      },
      body: JSON.stringify({
        // 👇 Kiểm tra kỹ xem Backend của bạn tên biến là 'accessToken' hay 'token' hay 'idToken'
        accessToken: accessToken,
      }),
    });

    if (!response.ok) {
      // Đọc lỗi chi tiết từ Backend trả về
      const errorData = await response.json().catch(() => ({}));
      console.error("🔴 Backend từ chối:", response.status, errorData);
      throw new Error(
        errorData.message || `Backend login failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in to backend:", error);
    throw error;
  }
};
