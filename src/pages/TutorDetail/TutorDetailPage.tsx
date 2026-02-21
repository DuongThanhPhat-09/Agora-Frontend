import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BookingModal from './BookingModal';
import { getTutorFullProfile } from '../../services/tutorDetail.service';
import type { TutorFullProfile, FeedbackItem, AvailabilitySlot, CertificateInfo } from '../../services/tutorDetail.service';
import { getTutorFeedbacks, getTutorFeedbackStats, type FeedbackDto, type FeedbackStatsDto } from '../../services/feedback.service';
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
                    src={(() => {
                        if (!profile.videoIntroUrl) return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800";
                        const match = profile.videoIntroUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
                        return match?.[1] ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800";
                    })()}
                    alt={profile.fullName || "Tutor Interview"}
                />
                <div className="gradient-overlay"></div>

                {/* Play Button */}
                <div className="play-button-container">
                    <div className="play-button">
                        <PlayIcon />
                    </div>
                    <b className="click-to-view">Click để xem phỏng vấn học thuật</b>
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
                            <b className="rating-text">{(profile.averageRating || 0).toFixed(1)} ({profile.totalFeedbacks || 0} ĐÁNH GIÁ)</b>
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
const TestimonialsSection = ({ feedbacks, totalFeedbacks, tutorId }: {
    feedbacks: FeedbackItem[] | null,
    totalFeedbacks: number,
    tutorId?: string
}) => {
    const [allFeedbacks, setAllFeedbacks] = useState<(FeedbackItem | FeedbackDto)[]>([]);
    const [stats, setStats] = useState<FeedbackStatsDto | null>(null);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Update feedbacks when prop changes
    useEffect(() => {
        if (feedbacks) setAllFeedbacks(feedbacks);
    }, [feedbacks]);

    // Derived state for easier tracking
    const effectiveTotal = Math.max(totalFeedbacks, stats?.totalReviews || 0);
    const hasMore = effectiveTotal > allFeedbacks.length;

    // Load stats on mount
    useEffect(() => {
        if (!tutorId) return;
        getTutorFeedbackStats(tutorId)
            .then(res => {
                const data = res.content || res;
                setStats(data);
            })
            .catch(() => { });
    }, [tutorId]);

    const loadMore = useCallback(async () => {
        if (!tutorId || loadingMore) return;
        try {
            setLoadingMore(true);
            const pageToFetch = allFeedbacks.length <= (feedbacks?.length || 0) ? 1 : page + 1;
            const res = await getTutorFeedbacks(tutorId, pageToFetch, 5);
            const data = res.content || res;
            const newItems = Array.isArray(data) ? data : data?.items || [];

            if (newItems.length > 0) {
                if (pageToFetch === 1) {
                    setAllFeedbacks(newItems);
                } else {
                    setAllFeedbacks(prev => {
                        const existingIds = new Set(prev.map(f => f.feedbackId));
                        const filtered = newItems.filter(f => !existingIds.has(f.feedbackId));
                        return [...prev, ...filtered];
                    });
                }
                setPage(pageToFetch);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingMore(false);
        }
    }, [tutorId, page, loadingMore, allFeedbacks.length, feedbacks?.length]);

    const handleNext = async () => {
        if (currentIndex < allFeedbacks.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else if (hasMore) {
            await loadMore();
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const testimonial = allFeedbacks[currentIndex];

    // Rating bar helper
    const RatingBar = ({ star, count, percent }: { star: number; count: number; percent: number }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span style={{ minWidth: '12px', color: '#666' }}>{star}</span>
            <StarIcon />
            <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: '#f0ece3' }}>
                <div style={{ width: `${percent}%`, height: '100%', borderRadius: '3px', background: '#D4B483', transition: 'width 0.3s' }} />
            </div>
            <span style={{ minWidth: '28px', textAlign: 'right', color: '#999', fontSize: '11px' }}>{count}</span>
        </div>
    );

    return (
        <section className="section5">
            <div className="heading-24">
                <h2 className="nht-k-thnh">Nhật ký thành công</h2>
            </div>

            {/* Rating Stats */}
            {stats && (
                <div style={{
                    display: 'flex', gap: '24px', alignItems: 'center',
                    padding: '16px 20px', marginBottom: '10px',
                    background: 'rgba(242, 240, 228, 0.5)', borderRadius: '12px',
                    border: '1px solid rgba(62, 47, 40, 0.08)',
                }}>
                    <div style={{ textAlign: 'center', minWidth: '80px' }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#1a2238' }}>
                            {stats.averageRating.toFixed(1)}
                        </div>
                        <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', margin: '4px 0' }}>
                            {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled={i <= Math.round(stats.averageRating)} />)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#999' }}>{stats.totalReviews} đánh giá</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <RatingBar star={5} count={stats.rating5Count} percent={stats.rating5Percent} />
                        <RatingBar star={4} count={stats.rating4Count} percent={stats.rating4Percent} />
                        <RatingBar star={3} count={stats.rating3Count} percent={stats.rating3Percent} />
                        <RatingBar star={2} count={stats.rating2Count} percent={stats.rating2Percent} />
                        <RatingBar star={1} count={stats.rating1Count} percent={stats.rating1Percent} />
                    </div>
                </div>
            )}

            <div className="container84">
                {testimonial ? (
                    <div className="component-8" style={{ width: '100%' }}>
                        <div className="container85">
                            <div className="component-122">
                                <QuoteIcon />
                            </div>
                        </div>
                        <div className="container86">
                            <div className="container87">
                                <div className="container88">
                                    <div className="background7">
                                        <b className="l">{
                                            (('fromUserName' in testimonial ? testimonial.fromUserName : (testimonial as any).parentName) || 'P').charAt(0)
                                        }</b>
                                    </div>
                                    <div className="container89">
                                        <div className="heading-47">
                                            <b className="l-minh-anh">
                                                {('fromUserName' in testimonial ? testimonial.fromUserName : (testimonial as any).parentName) || 'Học viên'}
                                            </b>
                                        </div>
                                        <div className="container90">
                                            <span className="hc-sinh-year">{testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleDateString('vi-VN') : 'Học viên'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="container91">
                                    <i className="chuyn-mn-ca">"{testimonial.comment || 'Không có bình luận.'}"</i>
                                </div>
                                <div className="container92">
                                    <div className="border2">
                                        <b className="xc-thc-bi">Xác thực bởi Agora LMS</b>
                                    </div>
                                    {('courseDuration' in testimonial && (testimonial as any).courseDuration) && (
                                        <div className="border2">
                                            <b className="xc-thc-bi">Học trong {(testimonial as any).courseDuration}</b>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="background8">
                                <div className="container93">
                                    <span className="mc-tiu-ban">Mục tiêu ban đầu</span>
                                    <div className="container95">
                                        <b className="thi-y">{('initialGoal' in testimonial ? (testimonial as any).initialGoal : null) || '—'}</b>
                                    </div>
                                </div>
                                <div className="horizontal-divider3"></div>
                                <div className="container96">
                                    <span className="mc-tiu-ban">Kết quả thực tế</span>
                                    <div className="container98">
                                        <b className="t-a-biology">{('actualResult' in testimonial ? (testimonial as any).actualResult : null) || '—'}</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="empty-message-center" style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
                        {loadingMore ? 'Đang tải đánh giá...' : 'Gia sư chưa có đánh giá nào.'}
                    </p>
                )}

                {/* Slider Navigation */}
                {effectiveTotal > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        marginTop: '20px'
                    }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    border: '1px solid #e4ded5',
                                    background: currentIndex === 0 ? '#f5f5f5' : '#fff',
                                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <span style={{ fontSize: '18px', color: '#3e2f28' }}>←</span>
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentIndex === effectiveTotal - 1 || loadingMore}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    border: '1px solid #e4ded5',
                                    background: (currentIndex === effectiveTotal - 1) ? '#f5f5f5' : '#fff',
                                    cursor: (currentIndex === effectiveTotal - 1) ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <span style={{ fontSize: '18px', color: '#3e2f28' }}>{loadingMore ? '...' : '→'}</span>
                            </button>
                        </div>

                        <div style={{ fontSize: '14px', color: '#999', fontWeight: 500 }}>
                            Đánh giá {currentIndex + 1} / {effectiveTotal}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

// Booking Sidebar
const BookingSidebar = ({
    hourlyRate,
    trialLessonPrice,
    availabilities,
    onBooking
}: {
    hourlyRate: number | null,
    trialLessonPrice: number | null,
    availabilities: AvailabilitySlot[] | null,
    onBooking: () => void
}) => {
    // Group availability by day
    const dayLabelsMap: Record<number, string> = {
        0: "Chủ Nhật",
        1: "Thứ 2",
        2: "Thứ 3",
        3: "Thứ 4",
        4: "Thứ 5",
        5: "Thứ 6",
        6: "Thứ 7"
    };

    const availabilityByDay = (availabilities || []).reduce((acc, slot) => {
        const key = slot.dayName || dayLabelsMap[slot.dayofweek] || `Thứ ${slot.dayofweek + 1}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(slot);
        return acc;
    }, {} as Record<string, AvailabilitySlot[]>);

    const hasAvailability = Object.keys(availabilityByDay).length > 0;

    return (
        <aside className="booking-sidebar">
            <div className="booking-card">
                <div className="booking-header">
                    <span className="booking-label">Bắt đầu lộ trình học thuật</span>
                    <div className="price-display">
                        <b className="price-amount">{formatCurrency(hourlyRate)}</b>
                        <b className="price-unit">/ BUỔI HỌC</b>
                    </div>
                </div>

                {/* Availability Schedule - Redesigned to match Portal Profile */}
                {hasAvailability ? (
                    <div className="availability-schedule-container" style={{ marginTop: '14px' }}>
                        <div style={{
                            fontSize: '11px',
                            letterSpacing: '1.1px',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            color: 'rgba(26, 34, 56, 0.4)',
                            marginBottom: '14px'
                        }}>
                            LỊCH DẠY
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            {Object.entries(availabilityByDay).map(([dayName, slots]) => (
                                <div key={dayName} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 14px',
                                    backgroundColor: 'rgba(242, 240, 228, 0.5)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(62, 47, 40, 0.08)'
                                }}>
                                    <div style={{
                                        minWidth: '70px',
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        color: '#1a2238'
                                    }}>
                                        {dayName}
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '6px'
                                    }}>
                                        {slots.map((s, idx) => (
                                            <span key={idx} style={{
                                                padding: '4px 10px',
                                                backgroundColor: '#fff',
                                                borderRadius: '6px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: 'rgba(62, 47, 40, 0.7)',
                                                border: '1px solid rgba(62, 47, 40, 0.1)'
                                            }}>
                                                {s.starttime} - {s.endtime}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="empty-availability" style={{
                        marginTop: '14px',
                        padding: '20px 14px',
                        backgroundColor: 'rgba(242, 240, 228, 0.5)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        color: 'rgba(62, 47, 40, 0.5)',
                        fontSize: '12px',
                        fontStyle: 'italic'
                    }}>
                        Chưa cập nhật lịch dạy
                    </div>
                )}

                {/* Trial Lesson Price */}
                {trialLessonPrice && trialLessonPrice > 0 && (
                    <div style={{
                        marginTop: '14px',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '1.05px',
                        textTransform: 'uppercase',
                        color: 'rgba(62, 47, 40, 0.4)'
                    }}>
                        Buổi học thử: {formatCurrency(trialLessonPrice)}
                    </div>
                )}

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
                            tutorId={id}
                        />
                    </div>
                    <BookingSidebar
                        hourlyRate={profile.hourlyRate}
                        trialLessonPrice={profile.trialLessonPrice}
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
