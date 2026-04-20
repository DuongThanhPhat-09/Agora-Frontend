import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Breadcrumb } from '../../components/shared';
import { getCurrentUser } from '../../services/auth.service';
import { isZaloMiniApp } from '../../services/zalo-env';
import { loginWithZalo } from '../../services/zalo-auth.service';
import ZaloRoleSelectModal from '../../components/ZaloRoleSelectModal/ZaloRoleSelectModal';
import BookingModal from './BookingModal';
import { getTutorFullProfile } from '../../services/tutorDetail.service';
import type { TutorFullProfile } from '../../services/tutorDetail.service';
import {
    HeroSection,
    AboutSection,
    AcademicPortfolioSection,
    ActiveClassesSection,
    TestimonialsSection,
    BookingSidebar,
    TutorDetailSkeleton,
    formatCurrency,
} from './components';
import '../../styles/pages/tutor-detail.css';

const TutorDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<TutorFullProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBooking, setShowBooking] = useState(false);
    const [showRoleSelect, setShowRoleSelect] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    const requireLogin = async (onSuccess: () => void): Promise<void> => {
        const user = getCurrentUser();
        if (!user) {
            if (isZaloMiniApp()) {
                setPendingAction(() => onSuccess);
                setShowRoleSelect(true);
                return;
            }
            toast.info('Vui lòng đăng nhập để sử dụng tính năng này.');
            navigate('/login');
            return;
        }
        onSuccess();
    };

    const handleRoleSelect = async (role: 'Parent' | 'Student' | 'Tutor') => {
        setShowRoleSelect(false);
        try {
            await loginWithZalo(role);
            if (pendingAction) {
                pendingAction();
                setPendingAction(null);
            }
        } catch (e) {
            console.error('[requireLogin] Zalo auth error:', e);
            toast.error('Đăng nhập Zalo thất bại, vui lòng thử lại.');
        }
    };

    useEffect(() => {
        let mounted = true;

        const fetchProfile = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await getTutorFullProfile(id);
                if (mounted) {
                    setProfile(response.content);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    console.error('[TutorDetail] Failed to fetch:', err);
                    setError('Có lỗi xảy ra khi tải thông tin gia sư.');
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchProfile();
        return () => { mounted = false; };
    }, [id]);

    if (loading) {
        return <TutorDetailSkeleton />;
    }

    if (error || !profile) {
        return (
            <div className="tutor-detail-page">
                <Header />
                <div className="error-container">
                    <h2>Oops!</h2>
                    <p>{error || 'Không tìm thấy thông tin gia sư.'}</p>
                    <button onClick={() => window.history.back()} className="btn-back">Quay lại</button>
                </div>
                <Footer />
            </div>
        );
    }

    const inMiniApp = isZaloMiniApp();

    return (
        <div className="tutor-detail-page">
            {!inMiniApp && <Header />}

            {!inMiniApp && (
                <div style={{ width: '100%', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', paddingTop: 'var(--header-height, 80px)' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 35px', boxSizing: 'border-box' }}>
                        <Breadcrumb
                            items={[
                                { label: 'Trang chủ', href: '/' },
                                { label: 'Tìm kiếm Gia sư', href: '/tutor-search' },
                                { label: `Hồ sơ ${profile?.fullName || 'Gia sư'}` },
                            ]}
                        />
                    </div>
                </div>
            )}

            <main className="tutor-detail-main" style={{ paddingTop: inMiniApp ? '0' : '24px' }}>
                <div className="tutor-detail-container">
                    <div className="tutor-detail-content">
                        <HeroSection profile={profile} />
                        <AboutSection profile={profile} />

                        <div className="portfolio-stats-wrapper">
                            <AcademicPortfolioSection certificates={profile.certificates} />
                        </div>

                        <ActiveClassesSection
                            classes={profile.activeClasses}
                            totalActive={profile.totalActiveClasses}
                        />

                        <TestimonialsSection
                            feedbacks={profile.feedbacks}
                            totalFeedbacks={profile.totalFeedbacks}
                            tutorId={id}
                        />
                    </div>

                    {!inMiniApp && (
                        <BookingSidebar
                            hourlyRate={profile.hourlyRate}
                            trialLessonPrice={profile.trialLessonPrice}
                            availabilities={profile.availabilities}
                            onBooking={() => requireLogin(() => setShowBooking(true))}
                        />
                    )}
                </div>
            </main>
            {!inMiniApp && <Footer />}

            <div className="mobile-sticky-cta">
                <div className="mobile-cta-price">
                    <span className="mobile-cta-price-amount">{formatCurrency(profile.hourlyRate ? Math.round(profile.hourlyRate * 1.05) : null)}</span>
                    <span className="mobile-cta-price-unit">/ buổi học</span>
                </div>
                <button className="mobile-cta-book" onClick={() => requireLogin(() => setShowBooking(true))}>
                    <b>ĐẶT LỊCH</b>
                </button>
            </div>

            <BookingModal
                isOpen={showBooking}
                onClose={() => setShowBooking(false)}
                tutorName={profile.fullName || ''}
                tutorId={id || ''}
                hourlyRate={profile.hourlyRate || 0}
                subjects={profile.subjects || []}
                availabilities={profile.availabilities}
            />

            {showRoleSelect && (
                <ZaloRoleSelectModal
                    onSelect={handleRoleSelect}
                    onCancel={() => { setShowRoleSelect(false); setPendingAction(null); }}
                />
            )}
        </div>
    );
};

export default TutorDetailPage;
