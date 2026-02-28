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

// --- HELPER: Format phone to E.164 ---
const formatPhoneE164 = (phone: string): string => {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) {
        return "+84" + digits.substring(1);
    }
    if (digits.startsWith("84")) {
        return "+" + digits;
    }
    return "+84" + digits;
};

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();

    // --- FORM STATES ---
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "Student",
        terms: false,
    });

    // --- UI STATES ---
    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayText, setOverlayText] = useState("Đang xử lý...");

    // --- OTP VERIFICATION STATES ---
    const [waitingForOtp, setWaitingForOtp] = useState(false);
    const [otpInput, setOtpInput] = useState(["", "", "", "", "", ""]);
    const [otpLoading, setOtpLoading] = useState(false);
    const [formattedPhone, setFormattedPhone] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);

    // Refs for OTP input boxes
    const otpRefs = [
        React.useRef<HTMLInputElement>(null),
        React.useRef<HTMLInputElement>(null),
        React.useRef<HTMLInputElement>(null),
        React.useRef<HTMLInputElement>(null),
        React.useRef<HTMLInputElement>(null),
        React.useRef<HTMLInputElement>(null),
    ];

    // ========================================================================
    // FORM HANDLERS
    // ========================================================================
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ========================================================================
    // OTP INPUT HANDLERS
    // ========================================================================
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otpInput];
        newOtp[index] = value.slice(-1);
        setOtpInput(newOtp);

        if (value && index < 5) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otpInput[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otpInput];
        for (let i = 0; i < pasted.length; i++) {
            newOtp[i] = pasted[i];
        }
        setOtpInput(newOtp);
        const lastIndex = Math.min(pasted.length, 5);
        otpRefs[lastIndex].current?.focus();
    };

    // ========================================================================
    // RESEND OTP WITH COOLDOWN
    // ========================================================================
    const startResendCooldown = () => {
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        try {
            const { error } = await supabase.auth.signUp({
                phone: formattedPhone,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullname,
                        email: formData.email,
                        phone: formData.phone,
                        app_role: formData.role,
                    },
                },
            });
            if (error) throw error;
            toast.success("Đã gửi lại mã OTP!");
            startResendCooldown();
        } catch (error: any) {
            toast.error(error.message || "Không thể gửi lại OTP.");
        }
    };

    // ========================================================================
    // SUBMIT: SIGN UP WITH PHONE → SEND OTP
    // ========================================================================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullname || !formData.email || !formData.password || !formData.phone || !formData.confirmPassword) {
            toast.warning("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu nhập lại không khớp!");
            return;
        }
        if (!formData.terms) {
            toast.warning("Bạn phải đồng ý điều khoản dịch vụ.");
            return;
        }
        if (formData.password.length < 6) {
            toast.warning("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        // Validate phone number
        const phoneDigits = formData.phone.replace(/\D/g, "");
        if (phoneDigits.length < 9 || phoneDigits.length > 11) {
            toast.warning("Số điện thoại không hợp lệ!");
            return;
        }

        try {
            setShowOverlay(true);
            setOverlayText("Đang kiểm tra...");

            // Check if email already exists
            const existingUser = await checkEmailExists(formData.email);
            if (existingUser && existingUser.content) {
                toast.error("Email đã tồn tại. Vui lòng đăng nhập.");
                setShowOverlay(false);
                setTimeout(() => navigate("/login", { state: { email: formData.email } }), 2000);
                return;
            }

            setOverlayText("Đang gửi mã OTP...");

            // Format phone to E.164
            const phoneE164 = formatPhoneE164(formData.phone);
            setFormattedPhone(phoneE164);

            // Sign up with phone (sends OTP via SMS)
            const { data, error } = await supabase.auth.signUp({
                phone: phoneE164,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullname,
                        email: formData.email,
                        phone: formData.phone,
                        app_role: formData.role,
                    },
                },
            });

            if (error) throw error;

            console.log("📱 OTP sent to:", phoneE164);
            console.log("📦 SignUp response:", data);

            // Show OTP input modal
            setWaitingForOtp(true);
            setShowOverlay(false);
            startResendCooldown();
            toast.success("Mã OTP đã được gửi đến số điện thoại của bạn!");

        } catch (error: any) {
            console.error("SignUp error:", error);
            const msg = error.message?.includes("User already registered")
                ? "Số điện thoại đã được đăng ký."
                : error.message?.includes("rate limit")
                    ? "Gửi OTP quá nhiều lần. Vui lòng chờ và thử lại."
                    : `Lỗi: ${error.message}`;
            toast.error(msg);
            setShowOverlay(false);
        }
    };

    // ========================================================================
    // VERIFY OTP → REGISTER WITH BACKEND
    // ========================================================================
    const handleVerifyOtp = async () => {
        const otpCode = otpInput.join("");
        if (otpCode.length !== 6) {
            toast.warning("Vui lòng nhập đủ 6 chữ số!");
            return;
        }

        try {
            setOtpLoading(true);

            const { data, error } = await supabase.auth.verifyOtp({
                phone: formattedPhone,
                token: otpCode,
                type: "sms",
            });

            if (error) throw error;

            console.log("✅ OTP verified successfully:", data);

            if (data.session) {
                await handleInstantRegistration(data.session.access_token);
            } else {
                throw new Error("Không nhận được session sau xác thực OTP.");
            }

        } catch (error: any) {
            console.error("OTP verification error:", error);
            if (error.message?.includes("Token has expired or is invalid")) {
                toast.error("Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại.");
            } else {
                toast.error(error.message || "Xác thực OTP thất bại.");
            }
            setOtpInput(["", "", "", "", "", ""]);
            otpRefs[0].current?.focus();
        } finally {
            setOtpLoading(false);
        }
    };

    // ========================================================================
    // REGISTER WITH BACKEND (after OTP verified)
    // ========================================================================
    const handleInstantRegistration = async (token: string) => {
        try {
            setWaitingForOtp(false);
            setShowOverlay(true);
            setOverlayText("Đang đồng bộ tài khoản...");

            const backendResponse = await registerUserToBackend(token, formData.password, formData.role);
            let fullUserData = backendResponse;

            if (!fullUserData.id || !fullUserData.fullname) {
                const userProfile = await checkEmailExists(formData.email);
                fullUserData = { ...userProfile.content, accessToken: backendResponse.accessToken || token };
            }

            saveUserToStorage(fullUserData);
            toast.success(`Chào mừng ${fullUserData.fullname || 'bạn'} đến với Agora!`);
            setTimeout(() => navigate("/"), 1500);

        } catch (err: any) {
            console.error("Backend registration error:", err);
            toast.error("Không thể đồng bộ tài khoản. Vui lòng thử đăng nhập lại.");
            setShowOverlay(false);
            navigate("/login");
        }
    };

    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <div className="register-form relative">
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .agora-modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background-color: rgba(26, 34, 56, 0.9);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 99999; backdrop-filter: blur(5px);
                    animation: fadeIn 0.3s ease-out;
                }
                .agora-modal-box {
                    width: 90%; max-width: 400px;
                    background: white; border-radius: 12px;
                    overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex; flex-direction: column;
                }
                .agora-btn-primary {
                    width: 100%; padding: 14px;
                    background-color: #1a2238; color: white;
                    border: none; border-radius: 8px;
                    font-weight: bold; font-size: 14px;
                    cursor: pointer; transition: all 0.2s;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    margin-bottom: 15px;
                }
                .agora-btn-primary:hover { background-color: #2c3652; transform: translateY(-1px); }
                .agora-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
                .otp-input {
                    width: 48px; height: 56px;
                    text-align: center; font-size: 24px; font-weight: 700;
                    border: 2px solid #e0e0e0; border-radius: 10px;
                    outline: none; transition: all 0.2s;
                    color: #1a2238; background-color: #faf9f6;
                }
                .otp-input:focus {
                    border-color: #1a2238;
                    background-color: #fff;
                    box-shadow: 0 0 0 3px rgba(26, 34, 56, 0.1);
                }
                .otp-input:not(:placeholder-shown) {
                    border-color: #3d4a3e;
                    background-color: rgba(61, 74, 62, 0.05);
                }
            `}</style>

            {/* --- OVERLAY LOADING --- */}
            {showOverlay && createPortal(
                <div className="agora-modal-overlay" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '50px', height: '50px', margin: '0 auto 20px',
                            border: '4px solid #f3f3f3', borderTop: '4px solid #1a2238', borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ color: '#1a2238', fontWeight: '500' }}>{overlayText}</p>
                    </div>
                </div>,
                document.body
            )}

            {/* --- OTP VERIFICATION MODAL --- */}
            {waitingForOtp && createPortal(
                <div className="agora-modal-overlay">
                    <div className="agora-modal-box">
                        {/* Header */}
                        <div style={{ backgroundColor: '#1a2238', padding: '20px', textAlign: 'center', borderBottom: '3px solid #d4b483' }}>
                            <div style={{
                                width: '40px', height: '40px', margin: '0 auto 10px',
                                border: '1px solid #d4b483', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#d4b483', fontSize: '20px', fontWeight: 'bold', fontFamily: 'serif'
                            }}>A</div>
                            <h2 style={{ margin: 0, color: 'white', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>AGORA</h2>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '25px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                backgroundColor: 'rgba(61, 74, 62, 0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3d4a3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                            </div>

                            <h3 style={{ margin: '0 0 8px 0', color: '#1a2238', fontSize: '18px', fontWeight: 'bold' }}>
                                Xác thực số điện thoại
                            </h3>

                            <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '13px', textAlign: 'center' }}>
                                Nhập mã 6 chữ số đã gửi đến:
                            </p>

                            <div style={{
                                backgroundColor: '#f5f5f5', padding: '8px 16px', borderRadius: '6px',
                                marginBottom: '20px', textAlign: 'center', border: '1px solid #eee'
                            }}>
                                <span style={{ color: '#1a2238', fontWeight: 'bold', fontSize: '15px', letterSpacing: '1px' }}>
                                    {formattedPhone}
                                </span>
                            </div>

                            {/* OTP Input Boxes */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }} onPaste={handleOtpPaste}>
                                {otpInput.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={otpRefs[index]}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        className="otp-input"
                                        value={digit}
                                        placeholder="·"
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        autoFocus={index === 0}
                                        disabled={otpLoading}
                                    />
                                ))}
                            </div>

                            {/* Verify Button */}
                            <button
                                type="button"
                                className="agora-btn-primary"
                                onClick={handleVerifyOtp}
                                disabled={otpLoading || otpInput.join("").length !== 6}
                            >
                                {otpLoading ? (
                                    <>
                                        <div style={{
                                            width: '18px', height: '18px',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: '#fff', borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        Đang xác thực...
                                    </>
                                ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                        Xác nhận OTP
                                    </>
                                )}
                            </button>

                            {/* Resend OTP */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                                {resendCooldown > 0 ? (
                                    <span style={{ fontSize: '13px', color: '#999' }}>
                                        Gửi lại sau <strong style={{ color: '#1a2238' }}>{resendCooldown}s</strong>
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        style={{
                                            background: 'none', border: 'none',
                                            color: '#1a2238', fontSize: '13px', fontWeight: '600',
                                            textDecoration: 'underline', cursor: 'pointer'
                                        }}
                                    >
                                        Gửi lại mã OTP
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    setWaitingForOtp(false);
                                    setOtpInput(["", "", "", "", "", ""]);
                                }}
                                style={{ background: 'none', border: 'none', color: '#888', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}
                            >
                                Quay lại đăng ký
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* --- MAIN FORM --- */}
            {!waitingForOtp && (
                <>
                    <div className="register-form__header animate-fade-in-up">
                        <h2 className="register-form__title">Bắt đầu hành trình</h2>
                        <p className="register-form__subtitle">Tạo tài khoản Agora LMS.</p>
                    </div>

                    <div className="register-form__body">
                        <form onSubmit={handleSubmit} className="register-form__form">
                            <div className="space-y-3">
                                <div className="animate-fade-in-up delay-75">
                                    <InputGroup id="fullname" name="fullname" type="text" label="Họ và Tên" placeholder="Nguyễn Văn A" icon="person" value={formData.fullname} onChange={handleChange} />
                                </div>
                                <div className="animate-fade-in-up delay-100">
                                    <InputGroup id="email" name="email" type="email" label="Email" placeholder="student@example.com" icon="mail" value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="animate-fade-in-up delay-150">
                                    <InputGroup id="phone" name="phone" type="tel" label="Số Điện Thoại" placeholder="090..." icon="phone" value={formData.phone} onChange={handleChange} />
                                </div>
                                <div className="animate-fade-in-up delay-200">
                                    <InputGroup id="password" name="password" type="password" label="Mật Khẩu" placeholder="••••••••" icon="lock" value={formData.password} onChange={handleChange} showPasswordToggle={true} />
                                </div>
                                <div className="animate-fade-in-up delay-200">
                                    <InputGroup id="confirmPassword" name="confirmPassword" type="password" label="Nhập lại Mật Khẩu" placeholder="••••••••" icon="lock" value={formData.confirmPassword} onChange={handleChange} showPasswordToggle={true} />
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="animate-fade-in-up delay-175">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tôi là <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3">
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="role" value="Student" checked={formData.role === "Student"} onChange={handleChange} className="peer hidden" />
                                        <div className="border-2 border-gray-300 rounded-lg p-3 text-center transition-all peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-blue-400">
                                            <div className="text-2xl mb-1">🎓</div>
                                            <div className="text-sm font-medium text-gray-700 peer-checked:text-blue-600">Học sinh</div>
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="role" value="Parent" checked={formData.role === "Parent"} onChange={handleChange} className="peer hidden" />
                                        <div className="border-2 border-gray-300 rounded-lg p-3 text-center transition-all peer-checked:border-green-600 peer-checked:bg-green-50 hover:border-green-400">
                                            <div className="text-2xl mb-1">👨‍👩‍👧</div>
                                            <div className="text-sm font-medium text-gray-700 peer-checked:text-green-600">Phụ huynh</div>
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="role" value="Tutor" checked={formData.role === "Tutor"} onChange={handleChange} className="peer hidden" />
                                        <div className="border-2 border-gray-300 rounded-lg p-3 text-center transition-all peer-checked:border-purple-600 peer-checked:bg-purple-50 hover:border-purple-400">
                                            <div className="text-2xl mb-1">👨‍🏫</div>
                                            <div className="text-sm font-medium text-gray-700 peer-checked:text-purple-600">Gia sư</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="register-form__terms animate-fade-in-up delay-300 mt-3">
                                <div className="register-form__checkbox-wrapper">
                                    <input id="terms" name="terms" type="checkbox" checked={formData.terms} onChange={handleChange} className="register-form__checkbox" />
                                </div>
                                <label htmlFor="terms" className="register-form__terms-label text-xs">
                                    Đồng ý với <a href="#" className="register-form__terms-link">Điều khoản</a> & <a href="#" className="register-form__terms-link">Chính sách</a>.
                                </label>
                            </div>

                            <div className="register-form__submit animate-fade-in-up delay-300 mt-5">
                                <button type="submit" className="register-form__button" disabled={showOverlay}>Đăng ký ngay</button>
                            </div>

                            <div className="register-form__login animate-fade-in-up delay-300 mt-3">
                                <p>Đã có tài khoản? <Link to="/login" className="register-form__login-link">Đăng nhập</Link></p>
                            </div>
                        </form>
                    </div>
                    <div className="register-form__accent"></div>
                </>
            )}
        </div>
    );
};

export default RegisterForm;
