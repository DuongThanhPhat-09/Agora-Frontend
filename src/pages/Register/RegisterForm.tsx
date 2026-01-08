import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InputGroup from '../../components/InputGroup';

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        password: '',
        terms: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle registration logic here
    };

    return (
        <div className="register-form">
            {/* Header Section */}
            <div className="register-form__header animate-fade-in-up">
                <h2 className="register-form__title">Bắt đầu hành trình</h2>
                <p className="register-form__subtitle">
                    Tạo tài khoản để truy cập hệ thống Agora LMS.
                </p>
            </div>

            {/* Form Section */}
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
                        <p className="register-form__password-hint">
                            Ít nhất 8 ký tự, bao gồm chữ hoa và số.
                        </p>
                    </div>

                    {/* Terms Checkbox */}
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
                            Tôi đồng ý với{' '}
                            <a href="#" className="register-form__terms-link">Điều khoản dịch vụ</a>
                            {' '}và{' '}
                            <a href="#" className="register-form__terms-link">Chính sách bảo mật</a>
                            {' '}của Agora.
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="register-form__submit animate-fade-in-up delay-300">
                        <button type="submit" className="register-form__button">
                            Đăng ký ngay
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="register-form__divider animate-fade-in-up delay-300">
                        <div className="register-form__divider-line"></div>
                        <span className="register-form__divider-text">Hoặc</span>
                        <div className="register-form__divider-line"></div>
                    </div>

                    {/* Social Login */}
                    <div className="register-form__social animate-fade-in-up delay-300">
                        <button type="button" className="register-form__social-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.71 16.69 5.84 14.04H2.17V16.9C3.98 20.48 7.69 23 12 23Z" fill="#34A853" />
                                <path d="M5.84 14.04C5.62 13.38 5.49 12.68 5.49 11.95C5.49 11.22 5.62 10.52 5.84 9.86V6.99H2.17C1.4 8.49 1 10.17 1 12C1 13.83 1.4 15.51 2.17 17.01L5.84 14.04Z" fill="#FBBC05" />
                                <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.69 1 3.98 3.52 2.17 7.1L5.84 9.97C6.71 7.31 9.13 5.38 12 5.38Z" fill="#EA4335" />
                            </svg>
                            <span>Google</span>
                        </button>
                        <button type="button" className="register-form__social-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                            <span>Apple ID</span>
                        </button>
                    </div>

                    {/* Login Link */}
                    <div className="register-form__login animate-fade-in-up delay-300">
                        <p>
                            Đã có tài khoản?{' '}
                            <Link to="/login" className="register-form__login-link">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>

                </form>
            </div>

            {/* Decorative Bottom Line */}
            <div className="register-form__accent"></div>
        </div>
    );
};

export default RegisterForm;
