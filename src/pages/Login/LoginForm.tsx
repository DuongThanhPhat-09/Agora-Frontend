/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Login/LoginForm.tsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputGroup from "../../components/InputGroup";
import { supabase } from "../../lib/supabase";
import {
  checkEmailExists,
  loginToBackend,
  saveUserToStorage,
} from "../../services/auth.service";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  // State hiển thị Overlay (Màn hình che toàn bộ)
  const [showOverlay, setShowOverlay] = useState(false);

  // State nội dung chữ hiển thị trên Overlay
  const [overlayText, setOverlayText] = useState("Đang xử lý...");

  // --- LOGIC AUTHENTICATION ---
  useEffect(() => {
    // 1. Kiểm tra URL ngay lập tức để bật màn che TRƯỚC KHI giao diện kịp render
    if (window.location.hash && window.location.hash.includes("access_token")) {
      setOverlayText("Đang xác thực bảo mật...");
      setShowOverlay(true);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const userEmail = session.user.email;
          const accessToken = session.access_token;

          if (userEmail && accessToken) {
            // Có session -> Bắt đầu luồng xử lý
            await handleAuthFlow(userEmail, accessToken);
          }
        }
        // Không xử lý SIGNED_OUT ở đây để tránh tắt overlay quá sớm
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuthFlow = async (email: string, token: string) => {
    try {
      setShowOverlay(true);
      setOverlayText("Đang kiểm tra thông tin tài khoản...");
      console.log("🔍 Checking email:", email);

      // BƯỚC 1: Gọi API Check Email
      const userCheck = await checkEmailExists(email);

      if (userCheck && userCheck.content) {
        setOverlayText("Đang đăng nhập vào hệ thống...");

        // BƯỚC 2: Lấy Token đăng nhập
        const loginResponse = await loginToBackend(token, email);

        // 🔥 BƯỚC 3 (MỚI): GHÉP DỮ LIỆU & LƯU LOCAL STORAGE 🔥
        // Chúng ta lấy Profile từ Bước 1 + Token từ Bước 2
        const fullUserData = {
          ...userCheck.content, // Toàn bộ info: userid, fullname, role...
          accessToken: loginResponse.accessToken, // Nhét thêm token vào để dùng gọi API sau này
        };

        console.log("💾 Saving Full User Data:", fullUserData);
        saveUserToStorage(fullUserData);

        // Xong xuôi -> Chuyển trang
        toast.success(`Chào mừng ${userCheck.content.fullname} quay lại!`);
        navigate("/");
      } else {
        throw new Error("USER_NOT_FOUND");
      }
    } catch (error: any) {
      // === XỬ LÝ LỖI ===

      // Force Logout Supabase ngay lập tức để xóa session ảo
      await supabase.auth.signOut();

      const isUserNotFound =
        error.message === "USER_NOT_FOUND" ||
        (error.response && error.response.status === 404);

      if (isUserNotFound) {
        // Xử lý chuyển hướng mượt mà
        setOverlayText(
          "Tài khoản chưa tồn tại. Đang chuyển sang trang Đăng ký..."
        );
        toast.info("Vui lòng hoàn tất đăng ký để tiếp tục.");

        // Delay 1.5s để người dùng kịp đọc thông báo
        setTimeout(() => {
          navigate("/register", { state: { email: email } });
        }, 1500);
      } else {
        // Các lỗi kỹ thuật khác -> Tắt overlay để người dùng thử lại
        console.error("Login Error:", error);
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
        setShowOverlay(false);
      }
    }
  };

  // --- CÁC HÀM XỬ LÝ FORM THƯỜNG ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
  };

  const handleGoogleLogin = async () => {
    try {
      setShowOverlay(true);
      setOverlayText("Đang kết nối tới Google...");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/login",
          queryParams: {
            access_type: "offline",
            prompt: "consent select_account",
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.log(error);
      toast.error("Không thể kết nối với Google.");
      setShowOverlay(false);
    }
  };

  return (
    <div className="login-form relative">
      {/* 🔥 DÙNG PORTAL ĐỂ ĐẨY OVERLAY RA BODY (FIX LỖI HEADER) 🔥 */}
      {showOverlay &&
        createPortal(
          <div
            className="fixed inset-0 flex flex-col items-center justify-center transition-all duration-300"
            // zIndex cực cao và màu trắng đục để che Header
            style={{ zIndex: 99999, backgroundColor: "#ffffff" }}
          >
            {/* Spinner */}
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>

            {/* Text trạng thái */}
            <p className="text-gray-700 text-lg font-medium animate-pulse">
              {overlayText}
            </p>
          </div>,
          document.body // <-- Điểm mấu chốt: Render trực tiếp vào body
        )}

      {/* --- NỘI DUNG FORM CHÍNH --- */}
      <div className="login-form__header animate-fade-in-up">
        <h1 className="login-form__title">Chào mừng trở lại</h1>
        <p className="login-form__subtitle">
          Tiếp tục hành trình học thuật của bạn cùng Agora.
        </p>
      </div>

      <div className="login-form__body">
        <form onSubmit={handleSubmit} className="login-form__form">
          <div className="animate-fade-in-up delay-100">
            <InputGroup
              id="email"
              name="email"
              type="text"
              label="Email hoặc SĐT"
              placeholder="name@example.com"
              icon="mail"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="animate-fade-in-up delay-200">
            <InputGroup
              id="password"
              name="password"
              type="password"
              label="Mật khẩu"
              placeholder="••••••••"
              icon="lock"
              value={formData.password}
              onChange={handleChange}
              rightLink={{ text: "Quên mật khẩu?", href: "#" }}
            />
          </div>

          <div className="login-form__submit animate-fade-in-up delay-300">
            <button
              type="submit"
              className="login-form__button"
              disabled={showOverlay}
            >
              Đăng nhập
            </button>
          </div>

          <div className="login-form__divider animate-fade-in-up delay-300">
            <div className="login-form__divider-line"></div>
            <span className="login-form__divider-text">Hoặc</span>
            <div className="login-form__divider-line"></div>
          </div>

          <div className="login-form__social animate-fade-in-up delay-300">
            <button
              type="button"
              className="login-form__social-btn"
              onClick={handleGoogleLogin}
              disabled={showOverlay}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.71 16.69 5.84 14.04H2.17V16.9C3.98 20.48 7.69 23 12 23Z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.04C5.62 13.38 5.49 12.68 5.49 11.95C5.49 11.22 5.62 10.52 5.84 9.86V6.99H2.17C1.4 8.49 1 10.17 1 12C1 13.83 1.4 15.51 2.17 17.01L5.84 14.04Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.69 1 3.98 3.52 2.17 7.1L5.84 9.97C6.71 7.31 9.13 5.38 12 5.38Z"
                  fill="#EA4335"
                />
              </svg>
              <span>Tiếp tục với Google</span>
            </button>
          </div>

          <div className="login-form__register animate-fade-in-up delay-300">
            <p>
              Chưa có tài khoản?{" "}
              <a href="/register" className="login-form__register-link">
                Đăng ký ngay
              </a>
            </p>
          </div>
        </form>
      </div>
      <div className="login-form__accent"></div>
    </div>
  );
};

export default LoginForm;
