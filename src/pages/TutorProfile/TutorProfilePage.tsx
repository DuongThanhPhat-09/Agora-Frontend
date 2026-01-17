<<<<<<< HEAD
import React from 'react';
=======
import React, { useState, useEffect } from 'react'; // Add useEffect
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
>>>>>>> e8acb344551b5d2048e3d9225a8f07810184fa45
import '../../styles/pages/tutor-profile.css';
import IdCardUploader from '../../components/IdCardUploader';
import { uploadIdCard } from '../../services/supabase.service';
import { submitVerification } from '../../services/verification.service';
import { getUserProfile, parseEKYCData } from '../../services/user.service';
import { getUserIdFromToken } from '../../services/auth.service';
import type { IdCardUploadState, UserWithEKYC, EKYCContent } from '../../types/verification.types';

const TutorProfilePage: React.FC = () => {
<<<<<<< HEAD
    return (
        <div className="tutor-profile-page">
            <div className="profile-content">
                {/* Profile Status Banner */}
                <div className="profile-status-banner">
                    <div className="status-icon">⏳</div>
                    <div className="status-text">
                        <h3 className="status-title">Cập nhật đang chờ duyệt</h3>
                        <p className="status-description">Bạn vừa cập nhật hồ sơ. Admin đang xét duyệt (dự kiến 24h). Phụ huynh vẫn sẽ thấy thông tin cũ cho đến khi được duyệt.</p>
                        <button className="status-button">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 4V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Xem so sánh thay đổi
                        </button>
=======
    const navigate = useNavigate();

    // State for KYC Upload Modal
    const [showKYCModal, setShowKYCModal] = useState(false);
    const [uploadState, setUploadState] = useState<IdCardUploadState>({
        frontImage: null,
        backImage: null,
        frontPath: null,
        backPath: null,
        frontPreview: null,
        backPreview: null,
        isUploading: false,  // Keep for backward compatibility
        uploadProgress: 0
    });
    // Separate loading states for each image
    const [isFrontUploading, setIsFrontUploading] = useState(false);
    const [isBackUploading, setIsBackUploading] = useState(false);
    // Image lightbox state
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userData, setUserData] = useState<UserWithEKYC | null>(null);
    const [ekycData, setEkycData] = useState<EKYCContent | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoadingProfile(true);
                const userId = getUserIdFromToken();
                if (userId) {
                    const response = await getUserProfile(userId);
                    if (response.content) {
                        console.log('🔍 DEBUG - Full API Response:', response);
                        console.log('🔍 DEBUG - User Data:', response.content);
                        console.log('🔍 DEBUG - isidentityverified (lowercase):', response.content.isidentityverified);
                        console.log('🔍 DEBUG - IsIdentityVerified (PascalCase):', response.content.IsIdentityVerified);
                        console.log('🔍 DEBUG - isIdentityVerified (camelCase):', response.content.isIdentityVerified);
                        console.log('🔍 DEBUG - All keys:', Object.keys(response.content));

                        setUserData(response.content);

                        // Parse eKYC data if exists
                        if (response.content.ekycRawData) {
                            const parsed = parseEKYCData(response.content.ekycRawData);
                            console.log('🔍 DEBUG - Parsed eKYC Data:', parsed);
                            setEkycData(parsed);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                toast.error('Không thể tải thông tin profile');
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchUserProfile();
    }, []);

    // Handle front image upload
    const handleFrontSelected = async (file: File, preview: string) => {
        setUploadState(prev => ({
            ...prev,
            frontImage: file,
            frontPreview: preview
        }));
        setIsFrontUploading(true);

        const result = await uploadIdCard(file, 'front');

        if (result.error) {
            toast.error(result.error);
            setUploadState(prev => ({
                ...prev,
                frontImage: null,
                frontPreview: null
            }));
            setIsFrontUploading(false);
            return;
        }

        toast.success('Upload ảnh mặt trước thành công!');
        setUploadState(prev => ({
            ...prev,
            frontPath: result.publicUrl || result.path
        }));
        setIsFrontUploading(false);
    };

    // Handle back image upload
    const handleBackSelected = async (file: File, preview: string) => {
        setUploadState(prev => ({
            ...prev,
            backImage: file,
            backPreview: preview
        }));
        setIsBackUploading(true);

        const result = await uploadIdCard(file, 'back');

        if (result.error) {
            toast.error(result.error);
            setUploadState(prev => ({
                ...prev,
                backImage: null,
                backPreview: null
            }));
            setIsBackUploading(false);
            return;
        }

        toast.success('Upload ảnh mặt sau thành công!');
        setUploadState(prev => ({
            ...prev,
            backPath: result.publicUrl || result.path // Store signed URL
        }));
        setIsBackUploading(false);
    };

    const handleRemoveFront = () => {
        setUploadState(prev => ({
            ...prev,
            frontImage: null,
            frontPath: null,
            frontPreview: null
        }));
    };

    const handleRemoveBack = () => {
        setUploadState(prev => ({
            ...prev,
            backImage: null,
            backPath: null,
            backPreview: null
        }));
    };

    const handleSubmitVerification = async () => {
        if (!uploadState.frontPath || !uploadState.backPath) {
            toast.warning('Vui lòng upload đầy đủ ảnh CCCD cả 2 mặt!');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await submitVerification(
                uploadState.frontPath,
                uploadState.backPath
            );



            if (response.success) {
                toast.success('Xác thực danh tính thành công!');
                setShowKYCModal(false);

                // Reset upload state
                setUploadState({
                    frontImage: null,
                    backImage: null,
                    frontPath: null,
                    backPath: null,
                    frontPreview: null,
                    backPreview: null,
                    isUploading: false,
                    uploadProgress: 0
                });

                // Wait a bit for backend to commit changes
                await new Promise(resolve => setTimeout(resolve, 500));

                // IMPORTANT: Refresh user profile to show updated verification status
                try {
                    const userId = getUserIdFromToken();
                    if (userId) {
                        const profileResponse = await getUserProfile(userId);
                        if (profileResponse.content) {
                            setUserData(profileResponse.content);

                            // Parse eKYC data if exists
                            if (profileResponse.content.ekycRawData) {
                                const parsed = parseEKYCData(profileResponse.content.ekycRawData);
                                setEkycData(parsed);
                            }
                        }
                    }
                } catch (refreshError) {
                    console.error('❌ Error refreshing profile:', refreshError);
                    toast.error('Không thể tải lại thông tin profile. Vui lòng refresh trang.');
                }
            } else {
                toast.error(response.message || 'Có lỗi xảy ra khi gửi xác thực');
            }
        } catch (error) {
            console.error('Submit verification error:', error);
            toast.error('Không thể kết nối với server. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isReadyToSubmit = uploadState.frontPath && uploadState.backPath && !uploadState.isUploading;

    return (
        <div className="tutor-profile-page">
            {/* Sidebar */}
            <aside className="workspace-sidebar">
                <div className="sidebar-header">
                    <h1 className="sidebar-logo">AGORA</h1>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-item" onClick={() => navigate('/tutor-workspace')}>
                        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 4C3 3.44772 3.44772 3 4 3H7C7.55228 3 8 3.44772 8 4V7C8 7.55228 7.55228 8 7 8H4C3.44772 8 3 7.55228 3 7V4Z" />
                            <path d="M3 13C3 12.4477 3.44772 12 4 12H7C7.55228 12 8 12.4477 8 13V16C8 16.5523 7.55228 17 7 17H4C3.44772 17 3 16.5523 3 16V13Z" />
                            <path d="M12 4C12 3.44772 12.4477 3 13 3H16C16.5523 3 17 3.44772 17 4V7C17 7.55228 16.5523 8 16 8H13C12.4477 8 12 7.55228 12 7V4Z" />
                            <path d="M13 12C12.4477 12 12 12.4477 12 13V16C12 16.5523 12.4477 17 13 17H16C16.5523 17 17 16.5523 17 16V13C17 12.4477 16.5523 12 16 12H13Z" />
                        </svg>
                        <span className="nav-text">Tổng quan</span>
                    </div>

                    <div className="nav-item" onClick={() => navigate('/tutor-schedule')}>
                        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 2C5.44772 2 5 2.44772 5 3V4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V6C18 4.89543 17.1046 4 16 4H15V3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3V4H7V3C7 2.44772 6.55228 2 6 2Z" />
                        </svg>
                        <span className="nav-text">Lịch dạy</span>
                    </div>

                    <div className="nav-item" onClick={() => navigate('/tutor-classes')}>
                        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9Z" />
                            <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18H3Z" />
                        </svg>
                        <span className="nav-text">Lớp học</span>
                    </div>

                    <div className="nav-item" onClick={() => navigate('/tutor-messages')}>
                        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5C2 4.44772 2.44772 4 3 4H17C17.5523 4 18 4.44772 18 5V15C18 15.5523 17.5523 16 17 16H3C2.44772 16 2 15.5523 2 15V5Z" />
                            <path d="M2 5L10 10L18 5" stroke="white" strokeWidth="1.5" />
                        </svg>
                        <span className="nav-text">Tin nhắn</span>
                        <span className="nav-badge">3</span>
                    </div>

                    <div className="nav-item" onClick={() => navigate('/tutor-wallet')}>
                        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 4C4 2.89543 4.89543 2 6 2H14C15.1046 2 16 2.89543 16 4V18L10 15L4 18V4Z" />
                        </svg>
                        <span className="nav-text">Ví của tôi</span>
                    </div>

                    <div className="nav-item nav-item-active" onClick={() => navigate('/tutor-profile')}>
                        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9Z" />
                            <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18H3Z" />
                        </svg>
                        <span className="nav-text">Hồ sơ</span>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="upgrade-card">
                        <p className="upgrade-title">👑 Nâng cấp Unlimited</p>
                        <p className="upgrade-subtitle">Mở khóa công cụ thuế</p>
                        <button className="upgrade-button">Nâng cấp ngay</button>
                    </div>

                    <div className="user-profile">
                        <div className="user-avatar">M</div>
                        <div className="user-info">
                            <p className="user-name">Minh</p>
                            <p className="user-role">Gia sư</p>
                        </div>
                        <svg className=" user-menu-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
>>>>>>> e8acb344551b5d2048e3d9225a8f07810184fa45
                    </div>
                </div>

                {/* Profile Header */}
                <div className="profile-header-section">
                    <div className="profile-title-group">
                        <h1 className="profile-main-title">Hồ sơ gia sư</h1>
                        <p className="profile-subtitle">Quản lý thông tin cá nhân và chuyên môn của bạn</p>
                    </div>
                    <div className="profile-actions">
                        <button className="profile-action-btn btn-preview">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" />
                                <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" />
                            </svg>
                            Xem với tư cách Phụ huynh
                        </button>
                        <div className="toggle-container">
                            <span className="toggle-label">Nhận lớp mới</span>
                            <button className="toggle-switch toggle-on">
                                <span className="toggle-knob"></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Grid */}
                <div className="profile-grid">
                    {/* Left Column - Profile Card */}
                    <div className="profile-left-column">
                        <div className="profile-card">
                            <div className="profile-avatar-section">
                                <div className="avatar-large">M</div>
                                <button className="avatar-edit-btn">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                            </div>
                            <h2 className="profile-name">Nguyễn Văn Minh</h2>
                            <div className="profile-badges">
                                <span className="badge badge-verified">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Đã xác thực
                                </span>
                                <span className="badge badge-certified">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Bằng cấp đã duyệt
                                </span>
                            </div>
                        </div>

                        {/* Video Section */}
                        <div className="video-section">
                            <div className="video-placeholder">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                    <circle cx="24" cy="24" r="20" fill="#E4DED5" />
                                    <path d="M20 16L32 24L20 32V16Z" fill="#6B7280" />
                                </svg>
                                <p className="video-hint">Video giới thiệu giúp tăng 3x cơ hội được chọn</p>
                            </div>
                            <button className="btn-upload-video">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Cập nhật Video
                            </button>
                        </div>

                        {/* Trust Score */}
                        <div className="trust-score-card">
                            <div className="trust-header">
                                <div className="trust-title">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 2L9 6L13 6L10 9L11 13L8 11L5 13L6 9L3 6L7 6L8 2Z" />
                                    </svg>
                                    Độ tin cậy
                                </div>
                                <span className="trust-percentage">85%</span>
                            </div>
                            <div className="trust-progress">
                                <div className="trust-progress-fill" style={{ width: '85%' }}></div>
                            </div>
                            <div className="trust-details">
                                <div className="trust-suggestion">
                                    <p className="suggestion-label">💡 Gợi ý tăng điểm</p>
                                    <p className="suggestion-text">Thêm 1 chứng chỉ IELTS để đạt 100%</p>
                                </div>
                                <div className="trust-completed">
                                    <p className="completed-label">Đã hoàn thành</p>
                                    <div className="completed-list">
                                        <div className="completed-item">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span>Xác thực CCCD</span>
                                        </div>
                                        <div className="completed-item">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span>Xác thực bằng cấp</span>
                                        </div>
                                        <div className="completed-item">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span>Thêm video giới thiệu</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Information */}
                    <div className="profile-right-column">
                        {/* Basic Info Block */}
                        <div className="info-block">
                            <div className="block-header">
                                <h3 className="block-title">Thông tin hiển thị</h3>
                                <button className="btn-edit">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M11.586 2.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM9.379 4.793L1 13.172V16h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Sửa
                                </button>
                            </div>
                            <div className="info-fields">
                                <div className="info-field">
                                    <label className="field-label">TÊN HIỂN THỊ</label>
                                    <p className="field-value">Nguyễn Văn Minh</p>
                                </div>
                                <div className="info-field">
                                    <label className="field-label">TIÊU ĐỀ (HEADLINE)</label>
                                    <p className="field-value">Gia sư Toán tâm huyết, chuyên luyện thi vào 10</p>
                                </div>
                                <div className="info-field">
                                    <label className="field-label">GIỚI THIỆU BẢN THÂN</label>
                                    <p className="field-value field-value-multiline">Tôi có 5 năm kinh nghiệm giảng dạy Toán THCS và THPT. Chuyên giúp học sinh nắm vững kiến thức nền tảng và tự tin với kỳ thi. Phương pháp giảng dạy của tôi tập trung vào việc hiểu bản chất bài toán thay vì học vẹt công thức.</p>
                                </div>
                            </div>
                        </div>

                        {/* Education Block */}
                        <div className="info-block">
                            <div className="block-header">
                                <h3 className="block-title">Học vấn & Chứng chỉ</h3>
                                <button className="btn-edit">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M11.586 2.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM9.379 4.793L1 13.172V16h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Sửa
                                </button>
                            </div>
                            <div className="education-list">
                                <div className="education-item">
                                    <div className="education-icon">🎓</div>
                                    <div className="education-content">
                                        <div className="education-info">
                                            <h4 className="education-school">ĐH Sư Phạm Hà Nội</h4>
                                            <p className="education-degree">Cử nhân - Sư phạm Toán</p>
                                        </div>
                                        <span className="status-badge status-verified">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                                <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Đã xác thực
                                        </span>
                                    </div>
                                </div>
                                <div className="education-item education-pending">
                                    <div className="education-icon">📜</div>
                                    <div className="education-content">
                                        <div className="education-info">
                                            <h4 className="education-school">British Council</h4>
                                            <p className="education-degree">Chứng chỉ - IELTS 7.5</p>
                                        </div>
                                        <span className="status-badge status-pending">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                            Đang chờ duyệt
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Services Block */}
                        <div className="info-block">
                            <div className="block-header">
                                <h3 className="block-title">Dịch vụ & Học phí</h3>
                                <button className="btn-edit">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M11.586 2.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM9.379 4.793L1 13.172V16h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Sửa
                                </button>
                            </div>
                            <div className="services-content">
                                <div className="services-section">
                                    <label className="services-label">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 2L9 6H13L10 9L11 13L8 11L5 13L6 9L3 6H7L8 2Z" />
                                        </svg>
                                        MÔN HỌC GIẢNG DẠY
                                    </label>
                                    <div className="subject-tags">
                                        <span className="subject-tag">Toán 9</span>
                                        <span className="subject-tag">Toán 10</span>
                                        <span className="subject-tag">Luyện thi vào 10</span>
                                    </div>
                                </div>
                                <div className="services-section">
                                    <label className="services-label">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M4 4C2.89543 4 2 4.89543 2 6V10C2 11.1046 2.89543 12 4 12H12C13.1046 12 14 11.1046 14 10V6C14 4.89543 13.1046 4 12 4H4Z" />
                                        </svg>
                                        HỌC PHÍ
                                    </label>
                                    <div className="fee-card">
                                        <div className="fee-amount">
                                            <span className="fee-number">200,000</span>
                                            <span className="fee-currency">đ</span>
                                            <span className="fee-unit">/ buổi</span>
                                        </div>
                                        <div className="fee-note">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                                <path d="M8 4V8M8 11V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
<<<<<<< HEAD
                                            <p><strong>Lưu ý:</strong> Giá mới sẽ chỉ áp dụng cho lớp mới. Lớp cũ giữ nguyên giá đã thỏa thuận.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KYC Block */}
                        <div className="kyc-block">
                            <div className="kyc-header">
                                <div className="kyc-icon">🔒</div>
                                <div className="kyc-title-group">
                                    <h3 className="block-title">
                                        Xác thực danh tính
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            <path d="M8 4V8M8 11V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </h3>
                                    <p className="kyc-subtitle">Chỉ Admin được xem thông tin này</p>
=======
                                        </h3>
                                        <p className="kyc-subtitle">Chỉ Admin được xem thông tin này</p>
                                    </div>
                                </div>

                                {loadingProfile ? (
                                    <div className="kyc-loading">Đang tải...</div>
                                ) : (userData?.isidentityverified || (userData as any)?.IsIdentityVerified || (userData as any)?.isIdentityVerified) ? (
                                    <>
                                        {/* Verification Success Banner */}
                                        <div className="kyc-success-banner">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 2L2 6v5c0 4 3 7 8 10 5-3 8-6 8-10V6l-8-4z" />
                                                <path d="M7 10L9 12L13 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div>
                                                <h4>Đã xác thực danh tính</h4>
                                                <p>Thông tin của bạn đã được xác thực và phê duyệt</p>
                                            </div>
                                        </div>

                                        {/* CCCD Images */}
                                        <div className="id-cards">
                                            <div className="id-card">
                                                <div className="id-card-header">
                                                    <h4 className="id-card-title">CCCD Mặt trước</h4>
                                                    {userData?.idcardfronturl && (
                                                        <button
                                                            className="eye-icon-btn"
                                                            onClick={() => setLightboxImage(userData.idcardfronturl!)}
                                                            title="Xem ảnh"
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                                {userData?.idcardfronturl ? (
                                                    <img
                                                        src={userData.idcardfronturl}
                                                        alt="CCCD mặt trước"
                                                        className="id-card-image-real"
                                                    />
                                                ) : (
                                                    <div className="id-card-image">📄</div>
                                                )}
                                                <span className="id-status status-approved">✅ Đã duyệt</span>
                                            </div>

                                            <div className="id-card">
                                                <div className="id-card-header">
                                                    <h4 className="id-card-title">CCCD Mặt sau</h4>
                                                    {userData?.idcardbackurl && (
                                                        <button
                                                            className="eye-icon-btn"
                                                            onClick={() => setLightboxImage(userData.idcardbackurl!)}
                                                            title="Xem ảnh"
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                                {userData?.idcardbackurl ? (
                                                    <img
                                                        src={userData.idcardbackurl}
                                                        alt="CCCD mặt sau"
                                                        className="id-card-image-real"
                                                    />
                                                ) : (
                                                    <div className="id-card-image">📄</div>
                                                )}
                                                <span className="id-status status-approved">✅ Đã duyệt</span>
                                            </div>
                                        </div>

                                        {/* eKYC Extracted Information */}
                                        {ekycData && (
                                            <div className="ekyc-info-grid">
                                                <h4 className="ekyc-info-title">Thông tin từ CCCD</h4>
                                                <div className="ekyc-fields">
                                                    <div className="ekyc-field">
                                                        <label>Họ và tên:</label>
                                                        <span>{ekycData.name}</span>
                                                    </div>
                                                    <div className="ekyc-field">
                                                        <label>Số CCCD:</label>
                                                        <span>{ekycData.id}</span>
                                                    </div>
                                                    <div className="ekyc-field">
                                                        <label>Ngày sinh:</label>
                                                        <span>{ekycData.dob}</span>
                                                    </div>
                                                    <div className="ekyc-field">
                                                        <label>Giới tính:</label>
                                                        <span>{ekycData.sex}</span>
                                                    </div>
                                                    <div className="ekyc-field">
                                                        <label>Quê quán:</label>
                                                        <span>{ekycData.home}</span>
                                                    </div>
                                                    <div className="ekyc-field full-width">
                                                        <label>Địa chỉ:</label>
                                                        <span>{ekycData.address}</span>
                                                    </div>
                                                    <div className="ekyc-field">
                                                        <label>Độ chính xác:</label>
                                                        <span className="confidence-score">{ekycData.id_prob}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <button className="btn-update-kyc" onClick={() => setShowKYCModal(true)}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            Cập nhật giấy tờ
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/* Not Verified State */}
                                        <div className="kyc-warning">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 2L2 18H18L10 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                                <path d="M10 8V12M10 14V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                            <div className="kyc-warning-content">
                                                <p className="kyc-warning-title">⚠️ Chưa xác thực danh tính</p>
                                                <p className="kyc-warning-text">
                                                    Bạn cần upload CCCD để xác thực danh tính và được phép nhận lớp.
                                                </p>
                                            </div>
                                        </div>

                                        <button className="btn-update-kyc" onClick={() => setShowKYCModal(true)}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            Upload CCCD để xác thực
                                        </button>
                                    </>
                                )}

                                <div className="kyc-footer">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                        <path d="M6 3V6M6 8V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <p className="kyc-footer-text">Thông tin này được mã hóa và chỉ Admin có quyền truy cập. AGORA cam kết bảo mật tuyệt đối thông tin cá nhân của bạn.</p>
>>>>>>> e8acb344551b5d2048e3d9225a8f07810184fa45
                                </div>
                            </div>

                            <div className="kyc-warning">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2L2 18H18L10 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                    <path d="M10 8V12M10 14V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <div className="kyc-warning-content">
                                    <p className="kyc-warning-title">⚠️ Cảnh báo quan trọng</p>
                                    <p className="kyc-warning-text">
                                        Việc thay đổi giấy tờ sẽ khiến tài khoản bị <strong>tạm khóa nhận lớp</strong> cho đến khi Admin duyệt lại.
                                    </p>
                                </div>
                            </div>

                            <div className="id-cards">
                                <div className="id-card">
                                    <div className="id-card-header">
                                        <h4 className="id-card-title">CCCD Mặt trước</h4>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" />
                                            <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" />
                                        </svg>
                                    </div>
                                    <div className="id-card-image">📄</div>
                                    <span className="id-status status-approved">Đã duyệt</span>
                                </div>
                                <div className="id-card">
                                    <div className="id-card-header">
                                        <h4 className="id-card-title">CCCD Mặt sau</h4>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" />
                                            <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" />
                                        </svg>
                                    </div>
                                    <div className="id-card-image">📄</div>
                                    <span className="id-status status-approved">Đã duyệt</span>
                                </div>
                            </div>

                            <button className="btn-update-kyc">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Cập nhật giấy tờ
                            </button>

                            <div className="kyc-footer">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                    <path d="M6 3V6M6 8V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <p className="kyc-footer-text">Thông tin này được mã hóa và chỉ Admin có quyền truy cập. AGORA cam kết bảo mật tuyệt đối thông tin cá nhân của bạn.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* KYC Upload Modal */}
            {showKYCModal && (
                <div className="kyc-modal-overlay" onClick={() => setShowKYCModal(false)}>
                    <div className="kyc-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="kyc-modal-header">
                            <h2>Cập nhật CCCD</h2>
                            <button className="close-btn" onClick={() => setShowKYCModal(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="kyc-modal-body">
                            <div className="instructions-box">
                                <div className="instruction-icon">💡</div>
                                <div>
                                    <h4>Hướng dẫn chụp ảnh CCCD</h4>
                                    <ul style={{ margin: '8px 0 0 20px', fontSize: '14px', lineHeight: '1.6' }}>
                                        <li>Chụp rõ nét, đủ ánh sáng</li>
                                        <li>Toàn bộ thẻ nằm trong khung hình</li>
                                        <li>Không chụp qua kính, không bóng đổ</li>
                                        <li>File dưới 5MB, JPG/PNG</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="upload-grid-modal">
                                <IdCardUploader
                                    side="front"
                                    label="Mặt trước CCCD"
                                    onFileSelected={handleFrontSelected}
                                    onRemove={handleRemoveFront}
                                    preview={uploadState.frontPreview}
                                    isUploading={isFrontUploading}
                                />

                                <IdCardUploader
                                    side="back"
                                    label="Mặt sau CCCD"
                                    onFileSelected={handleBackSelected}
                                    onRemove={handleRemoveBack}
                                    preview={uploadState.backPreview}
                                    isUploading={isBackUploading}
                                />
                            </div>

                            <div className="security-notice-modal">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 1L3 3v4c0 3.5 2 6 5 8 3-2 5-4.5 5-8V3l-5-2z" />
                                </svg>
                                <p>Thông tin được mã hóa và bảo mật. Chỉ Admin có quyền xem.</p>
                            </div>
                        </div>

                        <div className="kyc-modal-footer">
                            <button className="btn-cancel-modal" onClick={() => setShowKYCModal(false)}>
                                Hủy
                            </button>
                            <button
                                className={`btn-submit-modal ${isReadyToSubmit ? 'ready' : ''}`}
                                onClick={handleSubmitVerification}
                                disabled={!isReadyToSubmit || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="btn-spinner"></div>
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 2L2 6v5c0 4 3 7 8 10 5-3 8-6 8-10V6l-8-4z" />
                                        </svg>
                                        Gửi xác thực
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="image-lightbox-overlay"
                    onClick={() => setLightboxImage(null)}
                >
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="lightbox-close-btn"
                            onClick={() => setLightboxImage(null)}
                            aria-label="Close"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <img
                            src={lightboxImage}
                            alt="CCCD Preview"
                            className="lightbox-image"
                        />
                    </div>
                </div>
            )}

            <style>{`
                /* Modal Styles */
                .kyc-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .kyc-modal {
                    background: white;
                    border-radius: 16px;
                    max-width: 900px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                }

                .kyc-modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .kyc-modal-header h2 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 700;
                    color: #1a2238;
                }

                .close-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    color: #6b7280;
                    transition: color 0.2s;
                }

                .close-btn:hover {
                    color: #1a2238;
                }

                .kyc-modal-body {
                    padding: 24px;
                }

                .instructions-box {
                    background: #fef3c7;
                    border: 1px solid #fbbf24;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 24px;
                    display: flex;
                    gap: 12px;
                }

                .instruction-icon {
                    font-size: 24px;
                    flex-shrink: 0;
                }

                .upload-grid-modal {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                    margin-bottom: 24px;
                }

                .security-notice-modal {
                    background: #e0f2fe;
                    border: 1px solid #0ea5e9;
                    border-radius: 8px;
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 14px;
                    color: #075985;
                }

                .security-notice-modal svg {
                    color: #0284c7;
                    flex-shrink: 0;
                }

                .kyc-modal-footer{
                    padding: 16px 24px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }

                .btn-cancel-modal {
                    padding: 10px 24px;
                    border: 2px solid #e5e7eb;
                    background: white;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #6b7280;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-cancel-modal:hover {
                    border-color: #d1d5db;
                    background: #f9fafb;
                }

                .btn-submit-modal {
                    padding: 10px 24px;
                    border: none;
                    background: #9ca3af;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    color: white;
                    cursor: not-allowed;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-submit-modal.ready {
                    background: linear-gradient(135deg, #1a2238 0%, #2c3652 100%);
                    cursor: pointer;
                }

                .btn-submit-modal.ready:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(26, 34, 56, 0.3);
                }

                .btn-submit-modal:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .btn-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .upload-grid-modal {
                        grid-template-columns: 1fr;
                    }

                    .kyc-modal-footer {
                        flex-direction: column-reverse;
                    }

                    .btn-cancel-modal,
                    .btn-submit-modal {
                        width: 100%;
                        justify-content: center;
                    }
                }

                /* eKYC Styles */
                .kyc-loading {
                    padding: 40px;
                    text-align: center;
                    color: #6b7280;
                }

                .kyc-success-banner {
                    background: #d1fae5;
                    border: 1px solid #34d399;
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                }

                .kyc-success-banner svg {
                    color: #059669;
                    flex-shrink: 0;
                }

                .kyc-success-banner h4 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #065f46;
                }

                .kyc-success-banner p {
                    margin: 4px 0 0 0;
                    font-size: 14px;
                    color: #047857;
                }

                .id-card-image-real {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .id-card-image-real:hover {
                    transform: scale(1.02);
                }

                .ekyc-info-grid {
                    background: #f9fafb;
                    border-radius: 12px;
                    padding: 20px;
                    margin: 24px 0;
                }

                .ekyc-info-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #1a2238;
                    margin: 0 0 16px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .ekyc-fields {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                }

                .ekyc-field {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .ekyc-field.full-width {
                    grid-column: 1 / -1;
                }

                .ekyc-field label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .ekyc-field span {
                    font-size: 14px;
                    color: #1a2238;
                    font-weight: 500;
                }

                .confidence-score {
                    color: #059669;
                    font-weight: 700;
                }

                /* Eye Icon Button Styles */
                .eye-icon-btn {
                    background: none;
                    border: none;
                    padding: 4px;
                    cursor: pointer;
                    color: #6b7280;
                    transition: all 0.2s;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .eye-icon-btn:hover {
                    color: #1a2238;
                    background: rgba(26, 34, 56, 0.05);
                    transform: scale(1.1);
                }

                .eye-icon-btn svg {
                    display: block;
                }

                /* Image Lightbox Styles */
                .image-lightbox-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    animation: fadeIn 0.2s ease-out;
                    cursor: zoom-out;
                }

                .lightbox-content {
                    position: relative;
                    max-width: 90vw;
                    max-height: 90vh;
                    animation: zoomIn 0.3s ease-out;
                    cursor: default;
                }

                .lightbox-image {
                    max-width: 100%;
                    max-height: 90vh;
                    width: auto;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .lightbox-close-btn {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: rgba(255, 255, 255, 0.15);
                    border: 2px solid rgba(255, 255, 255, 0.4);
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    backdrop-filter: blur(10px);
                }

                .lightbox-close-btn svg {
                    width: 18px;
                    height: 18px;
                }

                .lightbox-close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.5);
                    transform: scale(1.1);
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes zoomIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @media (max-width: 768px) {
                    .ekyc-fields {
                        grid-template-columns: 1fr;
                    }

                    .lightbox-close-btn {
                        top: 10px;
                        right: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default TutorProfilePage;
