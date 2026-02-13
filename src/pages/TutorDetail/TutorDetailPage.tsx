import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BookingModal from './BookingModal';
import { getTutorFullProfile } from '../../services/tutorDetail.service';
import type { TutorFullProfile, FeedbackItem, AvailabilitySlot, CertificateInfo } from '../../services/tutorDetail.service';
import "../../styles/pages/tutor-detail.css";

// SVG Icons
const PlayIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.667 9.333L19.334 14L11.667 18.667V9.333Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
    <svg width="10.5" height="10.5" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M5.5 1L6.939 3.915L10 4.365L7.75 6.555L8.378 9.6L5.5 8.085L2.622 9.6L3.25 6.555L1 4.365L4.061 3.915L5.5 1Z"
            fill={filled ? "#D4B483" : "none"}
            stroke="#D4B483"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const HeartIcon = () => (
    <svg width="17.5" height="17.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.75 3.375C14.85 2.475 13.65 2.025 12.375 2.025C11.1 2.025 9.9 2.475 9 3.375L8.25 4.125L7.5 3.375C5.625 1.5 2.625 1.5 0.75 3.375C-1.125 5.25 -1.125 8.25 0.75 10.125L8.25 17.625L15.75 10.125C17.625 8.25 17.625 5.25 15.75 3.375Z" fill="white" />
    </svg>
);

const CheckIcon = () => (
    <svg width="8.8" height="8.8" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 2.25L3.5625 6.1875L1.5 4.125" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CertificateIcon = () => (
    <svg width="17.5" height="17.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H4C2.9 2 2 2.9 2 4V14C2 15.1 2.9 16 4 16H14C15.1 16 16 15.1 16 14V4C16 2.9 15.1 2 14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 6H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 9H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const VerifyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L5.5 10.5L2 7" stroke="#3D4A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const QuoteIcon = () => (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="5" y="32" fontSize="36" fontFamily="Georgia, serif" fill="#E4DED5">"</text>
    </svg>
);

// Formatter for currency
const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "0đ";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// ============================================
// Sub-components
// ============================================

// Hero Section
const HeroSection = ({ profile }: { profile: TutorFullProfile }) => {
    // Flatten subjects tags
    const tags = profile.subjects?.flatMap(s => s.tags || []) || [];

    return (
        <section className="tutor-hero-section">
            <div className="component-2">
                <img
                    className="interview-thumbnail"
                    src={profile.videoIntroUrl ? `https://img.youtube.com/vi/${profile.videoIntroUrl.split('v=')[1]}/hqdefault.jpg` : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800"}
                    alt={profile.fullName || "Tutor Interview"}
                />
                <div className="gradient-overlay"></div>

                {/* Play Button */}
                <div className="play-button-container">
                    <div className="play-button">
                        <PlayIcon />
                    </div>
                    <b className="click-to-view">Click to View Academic Interview</b>
                </div>

                {/* Agora Badge */}
                <div className="agora-badge-container">
                    <div className="agora-badge">
                        <div className="agora-badge-dot"></div>
                        <b className="agora-badge-text">Agora Original Interview</b>
                    </div>
                </div>

                {/* Tutor Info Card */}
                <div className="tutor-info-card">
                    <div className="tutor-info-content">
                        <div className="tutor-mini-avatar">
                            <img src={profile.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg"} alt={profile.fullName || ""} />
                            <div className="mini-avatar-gradient"></div>
                        </div>
                        <div className="tutor-info-text">
                            <div className="university-badge">
                                <b>{profile.education?.split(',')[0] || "University"}</b>
                            </div>
                            <h1 className="tutor-name">{profile.fullName}</h1>
                            <p className="tutor-credential">{profile.headline}</p>
                        </div>
                    </div>
                </div>

                {/* Rating Card */}
                <div className="rating-card-container">
                    <div className="rating-card">
                        <div className="rating-stars">
                            <div className="stars-row">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <StarIcon key={i} filled={i <= Math.round(profile.averageRating || 0)} />
                                ))}
                            </div>
                            <b className="rating-text">{(profile.averageRating || 0).toFixed(1)} ({profile.totalFeedbacks || 0} REVIEWS)</b>
                        </div>
                        <div className="rating-divider"></div>
                        <div className="favorite-button">
                            <HeartIcon />
                        </div>
                    </div>
                </div>
            </div>

            {/* Subject Tags */}
            <div className="subject-tags">
                {tags.length > 0 ? tags.map((tag, index) => (
                    <div key={index} className="subject-tag">
                        <b>{tag}</b>
                    </div>
                )) : (
                    <div className="subject-tag"><b>Chưa cập nhật môn học</b></div>
                )}
            </div>
        </section>
    );
};

// About Section
const AboutSection = ({ profile }: { profile: TutorFullProfile }) => (
    <section className="about-section">
        <h2 className="section-title">Về Mentor {profile.fullName?.split(' ').pop()}</h2>
        <div className="about-content">
            <div className="about-text">
                <p className="about-intro">{profile.bio || "Gia sư chưa cập nhật giới thiệu."}</p>
                <p className="about-experience">{profile.experience || "Chưa cập nhật kinh nghiệm giảng dạy."}</p>
            </div>
            <div className="credentials-card">
                <div className="credential-item">
                    <span className="credential-label">Học vấn</span>
                    <b className="credential-institution">{profile.education || "—"}</b>
                    <i className="credential-detail">GPA: {profile.gpa || "—"}/{profile.gpaScale || "—"}</i>
                </div>
                {/* Additional fixed cards if you want to keep the UI symmetry, or hide if data missing */}
                <div className="credential-item">
                    <span className="credential-label">Hình thức dạy</span>
                    <b className="credential-institution">{profile.teachingMode || "—"}</b>
                    <i className="credential-detail">{profile.teachingAreaCity || "Toàn quốc"}</i>
                </div>
            </div>
        </div>
    </section>
);

// Academic Portfolio Section
const AcademicPortfolioSection = ({ certificates }: { certificates: CertificateInfo[] | null }) => (
    <section className="portfolio-section">
        <div className="portfolio-header">
            <div className="portfolio-title-group">
                <h2 className="section-title">Hồ sơ năng lực học thuật</h2>
                <span className="portfolio-subtitle">Hệ thống Agora Academic Ledger v2.4</span>
            </div>
            <div className="verified-badge-green">
                <b>Xác thực 100%</b>
            </div>
        </div>

        <div className="portfolio-content">
            {/* Certificates Category */}
            <div className="portfolio-category">
                <div className="category-header">
                    <div className="category-indicator gold"></div>
                    <span className="category-title">Văn bằng & Chứng chỉ</span>
                    <div className="category-divider"></div>
                </div>
                <div className="certificates-grid">
                    {certificates && certificates.length > 0 ? certificates.map((cert, index) => (
                        <div key={index} className="certificate-card">
                            <div className="certificate-icon">
                                <CertificateIcon />
                            </div>
                            <div className="certificate-info">
                                <div className="certificate-title-row">
                                    <b className="certificate-title">{cert.certificateName}</b>
                                    {cert.verificationStatus === 'verified' && (
                                        <div className="verified-check">
                                            <CheckIcon />
                                        </div>
                                    )}
                                </div>
                                <span className="certificate-institution">{cert.issuingOrganization}</span>
                                {cert.yearIssued && <b className="certificate-score">Năm {cert.yearIssued}</b>}
                            </div>
                        </div>
                    )) : (
                        <p className="empty-message">Chưa có chứng chỉ được cập nhật.</p>
                    )}
                </div>
            </div>

            {/* Portfolio Footer */}
            <div className="portfolio-footer">
                <div className="portfolio-note">
                    <div className="note-dot green"></div>
                    <b>Hồ sơ gốc lưu trữ bởi Agora</b>
                </div>
                <div className="portfolio-note">
                    <div className="note-dot green"></div>
                    <b>Đã kiểm tra chéo (Cross-checked)</b>
                </div>
            </div>
        </div>
    </section>
);

// Testimonials Section
const TestimonialsSection = ({ feedbacks, totalFeedbacks }: { feedbacks: FeedbackItem[] | null, totalFeedbacks: number }) => (
    <section className="section5">
        <div className="heading-24">
            <h2 className="nht-k-thnh">Nhật ký thành công</h2>
        </div>
        <div className="container84">
            {feedbacks && feedbacks.length > 0 ? feedbacks.map((testimonial) => (
                <div key={testimonial.feedbackId} className="component-8">
                    <div className="container85">
                        <div className="component-122">
                            <QuoteIcon />
                        </div>
                    </div>
                    <div className="container86">
                        <div className="container87">
                            <div className="container88">
                                <div className="background7">
                                    <b className="l">{testimonial.fromUserName?.charAt(0) || "U"}</b>
                                </div>
                                <div className="container89">
                                    <div className="heading-47">
                                        <b className="l-minh-anh">{testimonial.fromUserName}</b>
                                    </div>
                                    <div className="container90">
                                        <span className="hc-sinh-year">Học viên</span>
                                    </div>
                                </div>
                            </div>
                            <div className="container91">
                                <i className="chuyn-mn-ca">"{testimonial.comment || "Không có bình luận."}"</i>
                            </div>
                            <div className="container92">
                                <div className="border2">
                                    <b className="xc-thc-bi">Xác thực bởi Agora LMS</b>
                                </div>
                                {testimonial.courseDuration && (
                                    <div className="border2">
                                        <b className="xc-thc-bi">Học trong {testimonial.courseDuration}</b>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="background8">
                            <div className="container93">
                                <span className="mc-tiu-ban">Mục tiêu ban đầu</span>
                                <div className="container95">
                                    <b className="thi-y">{testimonial.initialGoal || "—"}</b>
                                </div>
                            </div>
                            <div className="horizontal-divider3"></div>
                            <div className="container96">
                                <span className="mc-tiu-ban">Kết quả thực tế</span>
                                <div className="container98">
                                    <b className="t-a-biology">{testimonial.actualResult || "—"}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )) : (
                <p className="empty-message-center">Gia sư chưa có đánh giá nào.</p>
            )}
        </div>
        {totalFeedbacks > 0 && (
            <button className="component-9">
                <b className="xem-tt-c">Xem tất cả lộ trình thành công ({totalFeedbacks})</b>
            </button>
        )}
    </section>
);

// Booking Sidebar
const BookingSidebar = ({ hourlyRate, availabilities, onBooking }: { hourlyRate: number | null, availabilities: AvailabilitySlot[] | null, onBooking: () => void }) => {
    // Basic day mapping
    const dayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    // For the UI grid, let's just show some unique days from availabilities or a placeholder
    const uniqueDays = Array.from(new Set(availabilities?.map(a => a.dayofweek) || []))
        .sort((a, b) => a - b);

    return (
        <aside className="booking-sidebar">
            <div className="booking-card">
                <div className="booking-header">
                    <span className="booking-label">Bắt đầu lộ trình học thuật</span>
                    <div className="price-display">
                        <b className="price-amount">{formatCurrency(hourlyRate)}</b>
                        <b className="price-unit">/ GIỜ</b>
                    </div>
                </div>

                {/* Date Picker - Simplified for now to show available days */}
                <div className="date-picker">
                    <div className="date-grid">
                        {uniqueDays.length > 0 ? uniqueDays.map((dayNum) => (
                            <div key={dayNum} className="date-item">
                                <span className="day-label">{dayLabels[dayNum]}</span>
                                <b className="date-number">Available</b>
                            </div>
                        )) : (
                            <p className="empty-message-small">Vui lòng liên hệ để đặt lịch.</p>
                        )}
                    </div>
                </div>

                {/* Time Picker - Showing some slots */}
                <div className="time-picker-section">
                    <span className="picker-label">LỊCH KHẢ DỤNG</span>
                    <div className="time-grid">
                        {availabilities?.slice(0, 6).map((slot, index) => (
                            <button
                                key={index}
                                className="time-slot"
                            >
                                <b>{slot.starttime}</b>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="booking-actions">
                    <button className="btn-start" onClick={onBooking}>
                        <b>ĐẶT LỊCH NGAY</b>
                    </button>
                    <button className="btn-chat">
                        <b>CHAT TƯ VẤN</b>
                    </button>
                </div>
            </div>

            <div className="verification-note">
                <div className="note-header">
                    <VerifyIcon />
                    <b>Đã xác minh bởi Agora Council</b>
                </div>
                <i className="note-text">Hoàn học phí nếu không hài lòng sau buổi học đầu tiên.</i>
            </div>
        </aside>
    );
};

// Main TutorDetailPage Component
const TutorDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<TutorFullProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBooking, setShowBooking] = useState(false);

    useEffect(() => {
        let mounted = true;

        const fetchProfile = async () => {
            if (!id) return;
            console.log("🚀 [TutorDetail] Starting fetch for:", id);
            try {
                // Only set loading if we don't have a profile or if ID changed completely
                // But for simplicity, just set loading true.
                setLoading(true);
                const response = await getTutorFullProfile(id);

                if (mounted) {
                    console.log("✅ [TutorDetail] Mounted & Set Profile for:", id);
                    setProfile(response.content);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    console.error("❌ [TutorDetail] Failed to fetch:", err);
                    setError("Có lỗi xảy ra khi tải thông tin gia sư.");
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchProfile();

        return () => {
            console.log("🧹 [TutorDetail] Cleanup/Unmount for:", id);
            mounted = false;
        };
    }, [id]);

    console.log("🎨 [TutorDetail] Render:", { id, loading, error, hasProfile: !!profile });

    if (loading) {
        return (
            <div className="tutor-detail-page">
                <Header />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Đang tải hồ sơ gia sư...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="tutor-detail-page">
                <Header />
                <div className="error-container">
                    <h2>Oops!</h2>
                    <p>{error || "Không tìm thấy thông tin gia sư."}</p>
                    <button onClick={() => window.history.back()} className="btn-back">Quay lại</button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="tutor-detail-page">
            <Header />
            <main className="tutor-detail-main">
                <div className="tutor-detail-container">
                    <div className="tutor-detail-content">
                        <HeroSection profile={profile} />
                        <AboutSection profile={profile} />

                        <div className="portfolio-stats-wrapper">
                            <AcademicPortfolioSection certificates={profile.certificates} />

                            {/* Hide StatsSection as requested since it doesn't have an API yet */}
                            {/* <StatsSection /> */}
                        </div>

                        <TestimonialsSection
                            feedbacks={profile.feedbacks}
                            totalFeedbacks={profile.totalFeedbacks}
                        />
                    </div>
                    <BookingSidebar
                        hourlyRate={profile.hourlyRate}
                        availabilities={profile.availabilities}
                        onBooking={() => setShowBooking(true)}
                    />
                </div>
            </main>
            <Footer />

            <BookingModal
                isOpen={showBooking}
                onClose={() => setShowBooking(false)}
                tutorName={profile.fullName || ""}
                tutorId={id || ""}
                hourlyRate={profile.hourlyRate || 0}
                subjects={profile.subjects || []}
                availabilities={profile.availabilities}
            />
        </div>
    );
};

export default TutorDetailPage;
