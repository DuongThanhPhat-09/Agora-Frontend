// src/components/ForgotPasswordModal.tsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase";

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.warning("Vui lòng nhập email của bạn!");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Email không hợp lệ!");
            return;
        }

        try {
            setIsLoading(true);

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setEmailSent(true);
            toast.success("Email đặt lại mật khẩu đã được gửi!");
        } catch (error: any) {
            console.error("Forgot password error:", error);
            toast.error(error.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setEmail("");
        setEmailSent(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
            style={{ animation: "fadeIn 0.2s ease-out" }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-sm"
                style={{ backgroundColor: "rgba(26, 34, 56, 0.5)" }}
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div
                className="relative bg-white w-full max-w-md overflow-hidden flex flex-col"
                style={{
                    animation: "scaleIn 0.3s ease-out",
                    borderRadius: "42px",
                    boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)",
                }}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 transition-colors z-10"
                    style={{ color: "rgba(26, 34, 56, 0.4)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#1a2238")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(26, 34, 56, 0.4)")}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Content */}
                <div
                    style={{
                        padding: "clamp(32px, 5vh, 40px) clamp(32px, 5vw, 40px) clamp(24px, 4vh, 32px)",
                        flex: 1
                    }}
                >
                    {!emailSent ? (
                        <div>
                            {/* Icon */}
                            <div className="flex justify-center mb-5">
                                <div
                                    className="flex items-center justify-center"
                                    style={{
                                        height: "56px",
                                        width: "56px",
                                        backgroundColor: "rgba(99, 27, 27, 0.1)",
                                        borderRadius: "9999px",
                                    }}
                                >
                                    <svg
                                        className="h-7 w-7"
                                        fill="none"
                                        stroke="#631b1b"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Title */}
                            <h2
                                className="text-center mb-2"
                                style={{
                                    fontFamily: "'IBM Plex Serif', Georgia, serif",
                                    fontSize: "clamp(24px, 4vw, 28px)",
                                    fontWeight: 600,
                                    color: "#1a2238",
                                    lineHeight: 1.3,
                                }}
                            >
                                Quên mật khẩu?
                            </h2>

                            {/* Description */}
                            <p
                                className="text-center mb-6"
                                style={{
                                    fontSize: "clamp(13px, 1.8vw, 14px)",
                                    color: "rgba(26, 34, 56, 0.6)",
                                    lineHeight: 1.6,
                                }}
                            >
                                Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
                            </p>

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                {/* Email Input */}
                                <div style={{ marginBottom: "24px" }}>
                                    <label
                                        htmlFor="forgot-email"
                                        className="block mb-2"
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: "#1a2238",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, paddingLeft: "14px", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                                            <svg
                                                style={{ height: "20px", width: "20px", color: "rgba(26, 34, 56, 0.4)" }}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            id="forgot-email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            style={{
                                                width: "100%",
                                                padding: "clamp(10px, 1.8vh, 14px) clamp(10px, 1.8vh, 14px) clamp(10px, 1.8vh, 14px) 40px",
                                                fontSize: "clamp(13px, 1.6vw, 15px)",
                                                color: "#1a2238",
                                                backgroundColor: "#faf9f6",
                                                border: "2px solid transparent",
                                                borderRadius: "14px",
                                                outline: "none",
                                                transition: "all 0.2s ease",
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.backgroundColor = "#ffffff";
                                                e.currentTarget.style.borderColor = "rgba(26, 34, 56, 0.05)";
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.backgroundColor = "#faf9f6";
                                                e.currentTarget.style.borderColor = "transparent";
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{
                                        width: "100%",
                                        padding: "clamp(10px, 1.8vh, 16px) clamp(16px, 3vw, 24px)",
                                        fontSize: "clamp(11px, 1.6vw, 14px)",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        color: "#ffffff",
                                        backgroundColor: isLoading ? "rgba(61, 74, 62, 0.5)" : "#3d4a3e",
                                        border: "none",
                                        borderRadius: "14px",
                                        cursor: isLoading ? "not-allowed" : "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isLoading) {
                                            e.currentTarget.style.backgroundColor = "#631b1b";
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 27, 27, 0.25)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isLoading) {
                                            e.currentTarget.style.backgroundColor = "#3d4a3e";
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        if (!isLoading) {
                                            e.currentTarget.style.transform = "translateY(0) scale(0.99)";
                                        }
                                    }}
                                    onMouseUp={(e) => {
                                        if (!isLoading) {
                                            e.currentTarget.style.transform = "translateY(-1px) scale(1)";
                                        }
                                    }}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5"
                                                style={{ color: "#ffffff" }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Đang gửi...
                                        </span>
                                    ) : (
                                        "Gửi link đặt lại mật khẩu"
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        // Success state
                        <div className="text-center">
                            <div
                                style={{
                                    margin: "0 auto 20px auto",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "56px",
                                    width: "56px",
                                    backgroundColor: "#3d4a3e",
                                    borderRadius: "9999px",
                                }}
                            >
                                <svg
                                    className="h-7 w-7"
                                    fill="none"
                                    stroke="#ffffff"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                                    />
                                </svg>
                            </div>

                            <h3
                                style={{
                                    fontFamily: "'IBM Plex Serif', Georgia, serif",
                                    fontSize: "clamp(20px, 4vw, 24px)",
                                    fontWeight: 600,
                                    color: "#1a2238",
                                    marginBottom: "12px",
                                    lineHeight: 1.3,
                                }}
                            >
                                Kiểm tra email của bạn!
                            </h3>
                            <p
                                className="mb-5"
                                style={{
                                    fontSize: "clamp(13px, 1.8vw, 14px)",
                                    color: "rgba(26, 34, 56, 0.6)",
                                    lineHeight: 1.6,
                                }}
                            >
                                Chúng tôi đã gửi link đặt lại mật khẩu đến{" "}
                                <span style={{ fontWeight: 600, color: "#1a2238" }}>{email}</span>
                            </p>

                            <div
                                style={{
                                    marginBottom: "20px",
                                    backgroundColor: "rgba(212, 180, 131, 0.1)",
                                    border: "1px solid rgba(212, 180, 131, 0.3)",
                                    borderRadius: "10.5px",
                                    padding: "12px 16px",
                                }}
                            >
                                <p style={{ fontSize: "13px", color: "#631b1b", lineHeight: 1.5 }}>
                                    💡 Nếu bạn không thấy email, vui lòng kiểm tra trong thư mục spam.
                                </p>
                            </div>

                            {/* Open Gmail Button */}
                            <a
                                href="https://mail.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    width: "100%",
                                    padding: "clamp(10px, 1.8vh, 16px) clamp(16px, 3vw, 24px)",
                                    marginBottom: "12px",
                                    fontSize: "clamp(11px, 1.6vw, 14px)",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    color: "#ffffff",
                                    backgroundColor: "#3d4a3e",
                                    border: "none",
                                    borderRadius: "14px",
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    boxSizing: "border-box",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#631b1b";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 27, 27, 0.25)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#3d4a3e";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <span style={{ fontSize: "16px", lineHeight: 1 }}>📧</span>
                                <span>Mở Gmail</span>
                            </a>

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                style={{
                                    width: "100%",
                                    padding: "clamp(10px, 1.8vh, 16px) clamp(16px, 3vw, 24px)",
                                    fontSize: "clamp(11px, 1.6vw, 14px)",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    color: "#1a2238",
                                    backgroundColor: "transparent",
                                    border: "2px solid rgba(26, 34, 56, 0.2)",
                                    borderRadius: "14px",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    marginBottom: "12px",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#1a2238";
                                    e.currentTarget.style.backgroundColor = "rgba(26, 34, 56, 0.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(26, 34, 56, 0.2)";
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                Đóng
                            </button>

                            <button
                                onClick={() => setEmailSent(false)}
                                style={{
                                    fontSize: "13px",
                                    color: "rgba(26, 34, 56, 0.6)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "color 0.2s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#1a2238")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(26, 34, 56, 0.6)")}
                            >
                                Không nhận được email? Gửi lại
                            </button>
                        </div>
                    )}
                </div>

                {/* Decorative Accent Bar - Always at bottom */}
                <div
                    style={{
                        height: "6px",
                        width: "100%",
                        background: "linear-gradient(90deg, #631b1b 0%, #3d4a3e 50%, #d4b483 100%)",
                    }}
                ></div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
};

export default ForgotPasswordModal;
