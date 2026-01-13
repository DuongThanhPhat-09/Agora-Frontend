import React, { useState } from 'react';
import './InputGroup.css';

interface InputGroupProps {
    id: string;
    name: string;
    type: string;
    label: string;
    placeholder: string;
    icon: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    rightLink?: {
        text: string;
        href: string;
    };
    showPasswordToggle?: boolean; // Prop để bật/tắt chức năng toggle password
}

const InputGroup: React.FC<InputGroupProps> = ({
    id,
    name,
    type,
    label,
    placeholder,
    icon,
    value,
    onChange,
    rightLink,
    showPasswordToggle = false
}) => {
    // State để quản lý việc hiển thị password
    const [showPassword, setShowPassword] = useState(false);

    // Xác định type thực tế của input
    // Nếu type ban đầu là "password" và showPasswordToggle = true, cho phép toggle
    const actualType = (type === 'password' && showPasswordToggle && showPassword) ? 'text' : type;

    return (
        <div className="input-group">
            <div className="input-group__header">
                <label htmlFor={id} className="input-group__label">
                    {label}
                </label>
                {rightLink && (
                    <a href={rightLink.href} className="input-group__link">
                        {rightLink.text}
                    </a>
                )}
            </div>

            <div className="input-group__field" style={{ position: 'relative' }}>
                <span className="input-group__icon material-symbols-outlined">
                    {icon}
                </span>
                <input
                    id={id}
                    name={name}
                    type={actualType}
                    className="input-group__input"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />

                {/* Nút toggle password - chỉ hiển thị khi type='password' và showPasswordToggle=true */}
                {type === 'password' && showPasswordToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6B7280',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#1F2937'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputGroup;
