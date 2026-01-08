import React, { useState } from 'react';
import InputGroup from '../../components/InputGroup';

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
        // Logic for login would go here
    };

    return (
        <div className="login-form">
            {/* Header Section */}
            <div className="login-form__header animate-fade-in-up">
                <h1 className="login-form__title">Chào mừng trở lại</h1>
                <p className="login-form__subtitle">
                    Tiếp tục hành trình học thuật của bạn cùng Agora.
                </p>
            </div>

            {/* Form Section */}
            <div className="login-form__body">
                <form onSubmit={handleSubmit} className="login-form__form">

                    <div className="animate-fade-in-up delay-100">
                        <InputGroup
                            id="email"
                            name="email"
                            type="text"
                            label="Email hoặc Số điện thoại"
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
                            rightLink={{
                                text: "Quên mật khẩu?",
                                href: "#"
                            }}
                        />
                    </div>

                    <div className="login-form__submit animate-fade-in-up delay-300">
                        <button type="submit" className="login-form__button">
                            Đăng nhập
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="login-form__divider animate-fade-in-up delay-300">
                        <div className="login-form__divider-line"></div>
                        <span className="login-form__divider-text">Hoặc</span>
                        <div className="login-form__divider-line"></div>
                    </div>

                    {/* Social Login */}
                    <div className="login-form__social animate-fade-in-up delay-300">
                        <button type="button" className="login-form__social-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.71 16.69 5.84 14.04H2.17V16.9C3.98 20.48 7.69 23 12 23Z" fill="#34A853" />
                                <path d="M5.84 14.04C5.62 13.38 5.49 12.68 5.49 11.95C5.49 11.22 5.62 10.52 5.84 9.86V6.99H2.17C1.4 8.49 1 10.17 1 12C1 13.83 1.4 15.51 2.17 17.01L5.84 14.04Z" fill="#FBBC05" />
                                <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.69 1 3.98 3.52 2.17 7.1L5.84 9.97C6.71 7.31 9.13 5.38 12 5.38Z" fill="#EA4335" />
                            </svg>
                            <span>Tiếp tục với Google</span>
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="login-form__register animate-fade-in-up delay-300">
                        <p>
                            Chưa có tài khoản?{' '}
                            <a href="/register" className="login-form__register-link">
                                Đăng ký ngay
                            </a>
                        </p>
                    </div>

                </form>
            </div>

            {/* Decorative Bottom Line */}
            <div className="login-form__accent"></div>
        </div>
    );
};

export default LoginForm;
