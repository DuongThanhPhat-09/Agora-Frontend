import React from 'react';
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
    rightLink
}) => {
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

            <div className="input-group__field">
                <span className="input-group__icon material-symbols-outlined">
                    {icon}
                </span>
                <input
                    id={id}
                    name={name}
                    type={type}
                    className="input-group__input"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default InputGroup;
