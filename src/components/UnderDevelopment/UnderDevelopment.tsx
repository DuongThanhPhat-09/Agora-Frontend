import React from 'react';
import './UnderDevelopment.css';

interface UnderDevelopmentProps {
    /** Feature name for description (e.g. "quản lý buổi học") */
    featureName?: string;
}

const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({ featureName = 'này' }) => {
    return (
        <div className="under-dev-overlay">
            <div className="under-dev-card">
                <div className="under-dev-icon">
                    🚀
                </div>
                <h2 className="under-dev-title">
                    Chức năng đang được phát triển
                </h2>
                <p className="under-dev-description">
                    Tính năng {featureName} đang được hoàn thiện và sẽ sớm được cập nhật. Cảm ơn bạn đã kiên nhẫn chờ đợi!
                </p>
                <div className="under-dev-badge">
                    <span className="under-dev-badge-dot"></span>
                    ĐANG PHÁT TRIỂN
                </div>
            </div>
        </div>
    );
};

export default UnderDevelopment;
