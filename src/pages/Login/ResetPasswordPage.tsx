// src/pages/Login/ResetPasswordPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../../lib/supabase";
import { syncPassword } from "../../services/auth.service";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../../styles/pages/reset-password.module.css";

// SVG Icons
const LockIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const EyeOpenIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeClosedIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd" />
    </svg>
);

const XCircleIcon = () => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const token = hashParams.get("access_token");
        const type = hashParams.get("type");

        if (token && type === "recovery") {
            setAccessToken(token);
        } else {
            toast.error("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
            setTimeout(() => navigate("/login"), 2000);
        }
    }, [navigate]);

    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: "", color: "", width: "0%" };
        if (password.length < 6) return { strength: "Yếu", color: "#631b1b", width: "33%" };
        if (password.length < 10) return { strength: "Trung bình", color: "#d4b483", width: "66%" };
        return { strength: "Mạnh", color: "#3d4a3e", width: "100%" };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.warning("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        if (!accessToken) {
            toast.error("Phiên làm việc không hợp lệ. Vui lòng thử lại.");
            return;
        }

        try {
            setIsLoading(true);

            const { error: supabaseError } = await supabase.auth.updateUser({
                password: newPassword,
            });
            if (supabaseError) throw supabaseError;

            await syncPassword(accessToken, newPassword);
            await supabase.auth.signOut();

            toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
            setTimeout(() => navigate("/login"), 1500);
        } catch (error: any) {
            console.error("Reset password error:", error);

            if (error.response?.status === 400) {
                toast.error("Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.error(error.message || "Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <div className={styles.page}>
            <Header />

            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.card}>
                        <div className={styles.cardContent}>
                            {/* Icon */}
                            <div className={styles.iconCircle}>
                                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>

                            <h1 className={styles.title}>Đặt lại mật khẩu</h1>
                            <p className={styles.description}>Nhập mật khẩu mới cho tài khoản của bạn</p>

                            <form onSubmit={handleSubmit}>
                                {/* New Password */}
                                <div className={styles.fieldGroup}>
                                    <label htmlFor="newPassword" className={styles.label}>Mật khẩu mới</label>
                                    <div className={styles.inputWrapper}>
                                        <div className={styles.inputIcon}><LockIcon /></div>
                                        <input
                                            id="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className={styles.input}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={styles.toggleBtn}
                                        >
                                            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                        </button>
                                    </div>

                                    {/* Password strength indicator */}
                                    {newPassword && (
                                        <div className={styles.strengthContainer}>
                                            <div className={styles.strengthHeader}>
                                                <span className={styles.strengthLabel}>Độ mạnh mật khẩu:</span>
                                                <span className={styles.strengthValue} style={{ color: passwordStrength.color }}>
                                                    {passwordStrength.strength}
                                                </span>
                                            </div>
                                            <div className={styles.strengthTrack}>
                                                <div
                                                    className={styles.strengthBar}
                                                    style={{
                                                        width: passwordStrength.width,
                                                        backgroundColor: passwordStrength.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className={styles.fieldGroupLast}>
                                    <label htmlFor="confirmPassword" className={styles.label}>Xác nhận mật khẩu</label>
                                    <div className={styles.inputWrapper}>
                                        <div className={styles.inputIcon}><LockIcon /></div>
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className={styles.input}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className={styles.toggleBtn}
                                        >
                                            {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                        </button>
                                    </div>

                                    {/* Password match indicator */}
                                    {confirmPassword && (
                                        newPassword === confirmPassword ? (
                                            <div className={styles.matchSuccess}>
                                                <CheckCircleIcon /> Mật khẩu khớp
                                            </div>
                                        ) : (
                                            <div className={styles.matchError}>
                                                <XCircleIcon /> Mật khẩu không khớp
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Submit */}
                                <button type="submit" disabled={isLoading} className={styles.btnPrimary}>
                                    {isLoading ? (
                                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <svg className={styles.spinner} width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path style={{ opacity: 0.75 }} fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Đang xử lý...
                                        </span>
                                    ) : (
                                        "Đặt lại mật khẩu"
                                    )}
                                </button>

                                {/* Back to login */}
                                <div style={{ textAlign: "center" }}>
                                    <button type="button" onClick={() => navigate("/login")} className={styles.backLink}>
                                        <ArrowLeftIcon /> Quay lại đăng nhập
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className={styles.accentBar} />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ResetPasswordPage;
