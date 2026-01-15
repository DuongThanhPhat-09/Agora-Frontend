/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
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

    // --- FORM STATES ---
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "Student", // Default role
        terms: false,
    });

    // --- UI STATES ---
    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayText, setOverlayText] = useState("Đang xử lý...");

    // --- VERIFICATION STATES ---
    const [waitingForEmailVerification, setWaitingForEmailVerification] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [pendingUserData, setPendingUserData] = useState<any>(null);

    // 🔥 Ref để ngăn chặn race condition
    const isProcessingEmailConfirmation = useRef(false);

    // ========================================================================
    // LOGIC: LẮNG NGHE SỰ KIỆN EMAIL VERIFICATION (GIỮ NGUYÊN)
    // ========================================================================
    useEffect(() => {
        if (!waitingForEmailVerification) return;

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === "SIGNED_IN" && session && !isProcessingEmailConfirmation.current) {
                    isProcessingEmailConfirmation.current = true;
                    try {
                        setWaitingForEmailVerification(false);
                        setShowOverlay(true);
                        setOverlayText("Xác thực thành công! Đang khởi tạo...");

                        const accessToken = session.access_token;
                        const backendResponse = await registerUserToBackend(
                            accessToken,
                            pendingUserData?.password || "",
                            pendingUserData?.role || "Student"
                        );

                        let fullUserData = backendResponse;
                        if (!fullUserData.id || !fullUserData.fullname) {
                            const userProfile = await checkEmailExists(userEmail);
                            fullUserData = {
                                ...userProfile.content,
                                accessToken: backendResponse.accessToken || accessToken,
                            };
                        }

                        saveUserToStorage(fullUserData);
                        toast.success(`Chào mừng ${fullUserData.fullname || 'bạn'} đến với Agora!`);

                        setTimeout(() => navigate("/"), 1500);

                    } catch (error: any) {
                        toast.error("Lỗi đồng bộ dữ liệu. Vui lòng thử đăng nhập lại.");
                        setShowOverlay(false);
                        isProcessingEmailConfirmation.current = false;
                        navigate("/login");
                    }
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [waitingForEmailVerification, navigate, userEmail, pendingUserData]);

    // ========================================================================
    // FORM HANDLERS (GIỮ NGUYÊN)
    // ========================================================================
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

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

        try {
            setShowOverlay(true);
            setOverlayText("Đang kiểm tra...");

            const existingUser = await checkEmailExists(formData.email);
            if (existingUser && existingUser.content) {
                toast.error("Email đã tồn tại. Vui lòng đăng nhập.");
                setShowOverlay(false);
                setTimeout(() => navigate("/login", { state: { email: formData.email } }), 2000);
                return;
            }

            setOverlayText("Đang kết nối hệ thống...");

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullname,
                        phone: formData.phone,
                        app_role: formData.role, // Application role: Admin/Tutor/Student/Parent
                    },
                },
            });

            if (error) throw error;

            if (data.user && data.user.identities && data.user.identities.length === 0) {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                if (currentSession && currentSession.user.email === formData.email) {
                    await handleInstantRegistration(currentSession.access_token);
                    return;
                }
            }

            if (data.session) {
                await handleInstantRegistration(data.session.access_token);
            } else if (data.user && !data.session) {
                setUserEmail(formData.email);
                setPendingUserData({
                    fullname: formData.fullname,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    role: formData.role
                });
                setWaitingForEmailVerification(true);
                setShowOverlay(false);
                toast.success("Vui lòng kiểm tra email!");
            }

        } catch (error: any) {
            const msg = error.message?.includes("User already registered") ? "Email đã được đăng ký." : `Lỗi: ${error.message}`;
            toast.error(msg);
            setShowOverlay(false);
        }
    };

    const handleInstantRegistration = async (token: string) => {
        try {
            setOverlayText("Đang đồng bộ...");
            const backendResponse = await registerUserToBackend(token, formData.password, formData.role);
            let fullUserData = backendResponse;
            if (!fullUserData.id || !fullUserData.fullname) {
                const userProfile = await checkEmailExists(formData.email);
                fullUserData = { ...userProfile.content, accessToken: backendResponse.accessToken || token };
            }
            saveUserToStorage(fullUserData);
            toast.success("Đăng ký hoàn tất!");
            navigate("/");
        } catch (err: any) {
            toast.error("Không thể đồng bộ tài khoản.");
            setShowOverlay(false);
        }
    }

    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <div className="register-form relative">
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
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
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                        <p style={{ color: '#1a2238', fontWeight: '500' }}>{overlayText}</p>
                    </div>
                </div>,
                document.body
            )}

            {/* --- EMAIL VERIFICATION MODAL (FAILSAFE VERSION) --- */}
            {waitingForEmailVerification && createPortal(
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
                            <h3 style={{ margin: '0 0 10px 0', color: '#1a2238', fontSize: '18px', fontWeight: 'bold' }}>Xác thực Email</h3>

                            <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '13px', textAlign: 'center' }}>
                                Chúng tôi đã gửi email xác thực đến:
                            </p>

                            <div style={{
                                backgroundColor: '#f5f5f5', padding: '10px 15px', borderRadius: '6px',
                                marginBottom: '20px', width: '100%', textAlign: 'center',
                                border: '1px solid #eee'
                            }}>
                                <span style={{ color: '#1a2238', fontWeight: 'bold', fontSize: '14px', wordBreak: 'break-all' }}>{userEmail}</span>
                            </div>

                            {/* 🔥 NÚT BẤM DÙNG STYLE TRỰC TIẾP ĐỂ CHỐNG LỖI CSS 🔥 */}
                            <button
                                type="button"
                                onClick={() => window.open('https://mail.google.com', '_blank')}
                                className="agora-btn-primary"
                                style={{ display: 'flex', visibility: 'visible', height: '48px', opacity: 1 }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                Mở Gmail ngay
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                                <div style={{ width: '12px', height: '12px', border: '2px solid #d4b483', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                <span style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>Đang chờ bạn xác nhận...</span>
                            </div>

                            <button
                                onClick={() => setWaitingForEmailVerification(false)}
                                style={{ background: 'none', border: 'none', color: '#888', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}
                            >
                                Quay về trang đăng nhập
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* --- MAIN FORM --- */}
            {!waitingForEmailVerification && (
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
                                        <input
                                            type="radio"
                                            name="role"
                                            value="Student"
                                            checked={formData.role === "Student"}
                                            onChange={handleChange}
                                            className="peer hidden"
                                        />
                                        <div className="border-2 border-gray-300 rounded-lg p-3 text-center transition-all peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-blue-400">
                                            <div className="text-2xl mb-1">🎓</div>
                                            <div className="text-sm font-medium text-gray-700 peer-checked:text-blue-600">Học sinh</div>
                                        </div>
                                    </label>

                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="Parent"
                                            checked={formData.role === "Parent"}
                                            onChange={handleChange}
                                            className="peer hidden"
                                        />
                                        <div className="border-2 border-gray-300 rounded-lg p-3 text-center transition-all peer-checked:border-green-600 peer-checked:bg-green-50 hover:border-green-400">
                                            <div className="text-2xl mb-1">👨‍👩‍👧</div>
                                            <div className="text-sm font-medium text-gray-700 peer-checked:text-green-600">Phụ huynh</div>
                                        </div>
                                    </label>

                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="Tutor"
                                            checked={formData.role === "Tutor"}
                                            onChange={handleChange}
                                            className="peer hidden"
                                        />
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