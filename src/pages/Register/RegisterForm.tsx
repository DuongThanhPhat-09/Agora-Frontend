/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputGroup from "../../components/InputGroup";
import { supabase } from "../../lib/supabase";
import {
    registerUserToBackend,
    saveUserToStorage,
    checkEmailExists
} from "../../services/auth.service";

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });

    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayText, setOverlayText] = useState("Đang xử lý...");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate Client-side
        if (
            !formData.fullname ||
            !formData.email ||
            !formData.password ||
            !formData.phone ||
            !formData.confirmPassword
        ) {
            toast.warning("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu nhập lại không khớp!");
            return;
        }

        if (!formData.terms) {
            toast.warning("Bạn phải đồng ý với điều khoản dịch vụ.");
            return;
        }
        if (formData.password.length < 6) {
            toast.warning("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        try {
            setShowOverlay(true);
            setOverlayText("Đang tạo tài khoản trên hệ thống...");

            // Đăng ký tài khoản trên Supabase
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullname,
                        phone: formData.phone,
                    },
                },
            });

            if (error) throw error;

            console.log("📊 Supabase signUp response:", {
                hasSession: !!data.session,
                hasUser: !!data.user,
                userId: data.user?.id,
                email: data.user?.email
            });

            if (data.session) {
                const accessToken = data.session.access_token;
                console.log("🎫 Session created successfully");
                console.log("🎫 Access token length:", accessToken?.length);
                setOverlayText("Đang đồng bộ dữ liệu người dùng...");

                try {
                    // Gọi API Backend để đăng ký
                    const backendResponse = await registerUserToBackend(accessToken, formData.password);

                    // Lấy thông tin user đầy đủ
                    let fullUserData = backendResponse;

                    // Kiểm tra nếu thiếu thông tin, fetch lại từ backend
                    if (!fullUserData.id || !fullUserData.fullname) {
                        const userProfile = await checkEmailExists(formData.email);
                        fullUserData = {
                            ...userProfile.content,
                            accessToken: backendResponse.accessToken || accessToken,
                        };
                    }

                    // Lưu thông tin user vào LocalStorage
                    console.log("💾 Registration Success. Saving Data:", fullUserData);
                    saveUserToStorage(fullUserData);

                    toast.success(`Chào mừng ${fullUserData.fullname || 'bạn'} đến với Agora!`);
                    setTimeout(() => {
                        navigate("/");
                    }, 1500);
                } catch (backendError: any) {
                    console.error("❌ Backend sync error:", backendError);

                    // Hiển thị lỗi chi tiết từ backend
                    const errorMessage = backendError.response?.data?.message?.errorMessage
                        || backendError.response?.data?.message
                        || backendError.message
                        || "Không thể đồng bộ với hệ thống backend";

                    toast.error(`Đăng ký thất bại: ${errorMessage}`);
                    setShowOverlay(false);

                    // Rollback: Xóa user khỏi Supabase nếu backend sync thất bại
                    console.log("⚠️ Rolling back Supabase registration...");
                    await supabase.auth.signOut();
                    return;
                }
            } else if (data.user && !data.session) {
                toast.info(
                    "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
                );
                navigate("/login");
            }
        } catch (error: any) {
            console.error("Register Error:", error);
            if (error.message.includes("User already registered")) {
                toast.error("Email này đã được sử dụng.");
            } else {
                toast.error("Đăng ký thất bại: " + error.message);
            }
            setShowOverlay(false);
        }
    };

    return (
        <div className="register-form relative">
            {/* --- OVERLAY LOADING --- */}
            {showOverlay &&
                createPortal(
                    <div
                        className="fixed inset-0 flex flex-col items-center justify-center transition-all duration-300"
                        style={{ zIndex: 99999, backgroundColor: "#ffffff" }}
                    >
                        <div className="relative w-16 h-16 mb-6">
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-100 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-gray-700 text-lg font-medium animate-pulse">
                            {overlayText}
                        </p>
                    </div>,
                    document.body
                )}

            <div className="register-form__header animate-fade-in-up">
                <h2 className="register-form__title">Bắt đầu hành trình</h2>
                <p className="register-form__subtitle">
                    Tạo tài khoản để truy cập hệ thống Agora LMS.
                </p>
            </div>

            <div className="register-form__body">
                <form onSubmit={handleSubmit} className="register-form__form">
                    <div className="animate-fade-in-up delay-100">
                        <InputGroup
                            id="fullname"
                            name="fullname"
                            type="text"
                            label="Họ và Tên"
                            placeholder="Nguyễn Văn A"
                            icon="person"
                            value={formData.fullname}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="animate-fade-in-up delay-100">
                        <InputGroup
                            id="email"
                            name="email"
                            type="email"
                            label="Email Học Thuật"
                            placeholder="student@example.com"
                            icon="mail"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="animate-fade-in-up delay-200">
                        <InputGroup
                            id="phone"
                            name="phone"
                            type="tel"
                            label="Số Điện Thoại"
                            placeholder="090 123 4567"
                            icon="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="animate-fade-in-up delay-200">
                        <InputGroup
                            id="password"
                            name="password"
                            type="password"
                            label="Mật Khẩu"
                            placeholder="••••••••"
                            icon="lock"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="animate-fade-in-up delay-200">
                        <InputGroup
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            label="Nhập lại Mật Khẩu"
                            placeholder="••••••••"
                            icon="lock"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <p className="register-form__password-hint">Ít nhất 6 ký tự.</p>
                    </div>

                    <div className="register-form__terms animate-fade-in-up delay-300">
                        <div className="register-form__checkbox-wrapper">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={formData.terms}
                                onChange={handleChange}
                                className="register-form__checkbox"
                            />
                        </div>
                        <label htmlFor="terms" className="register-form__terms-label">
                            Tôi đồng ý với{" "}
                            <a href="#" className="register-form__terms-link">
                                Điều khoản dịch vụ
                            </a>{" "}
                            và{" "}
                            <a href="#" className="register-form__terms-link">
                                Chính sách bảo mật
                            </a>{" "}
                            của Agora.
                        </label>
                    </div>

                    <div className="register-form__submit animate-fade-in-up delay-300">
                        <button
                            type="submit"
                            className="register-form__button"
                            disabled={showOverlay}
                        >
                            Đăng ký ngay
                        </button>
                    </div>

                    <div className="register-form__divider animate-fade-in-up delay-300">
                        <div className="register-form__divider-line"></div>
                        <span className="register-form__divider-text">Hoặc</span>
                        <div className="register-form__divider-line"></div>
                    </div>

                    <div className="register-form__social animate-fade-in-up delay-300">
                        <button type="button" className="register-form__social-btn">
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
                            <span>Google</span>
                        </button>
                    </div>

                    <div className="register-form__login animate-fade-in-up delay-300">
                        <p>
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="register-form__login-link">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
            <div className="register-form__accent"></div>
        </div>
    );
};

export default RegisterForm;
