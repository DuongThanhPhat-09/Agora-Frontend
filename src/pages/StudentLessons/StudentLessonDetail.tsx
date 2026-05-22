/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Clock, BookOpen, AlertCircle, Video, DollarSign,
    Calendar as CalendarIcon, FileText, ClipboardCheck, Star,
} from 'lucide-react';
import dayjs from 'dayjs';
import { getStudentLessonDetail, confirmStudentLesson } from '../../services/student-lesson.service';
import { isJitsiFallbackLink } from '../../services/googleAuth.service';
import { useLessonStartedListener } from '../../hooks/useLessonStartedListener';
import type { LessonDetailDto } from '../../services/lesson.service';
import { message as antMessage, Spin, Modal } from 'antd';
import CreateFeedbackModal from '../ParentLessons/components/CreateFeedbackModal';
import s from '../StudentPages.module.css';

// ── Status definitions — khớp với LessonStatus.cs ở BE ─────────────────
type StatusInfo = { label: string; color: string; bg: string };

const STATUS_INFO: Record<string, StatusInfo> = {
    scheduled:            { label: 'Đã lên lịch',     color: '#6366F1', bg: 'rgba(99,102,241,0.10)' },
    in_progress:          { label: 'Đang diễn ra',    color: '#0d9488', bg: 'rgba(13,148,136,0.12)' },
    pending_confirmation: { label: 'Chờ xác nhận',    color: '#d97706', bg: 'rgba(217,119,6,0.10)' },
    completed:            { label: 'Hoàn thành',      color: '#059669', bg: 'rgba(5,150,105,0.10)' },
    cancelled:            { label: 'Đã hủy',          color: '#737373', bg: '#f5f5f5' },
    cancelled_noshow:     { label: 'Hủy (vắng mặt)',  color: '#737373', bg: '#f5f5f5' },
    no_show:              { label: 'Vắng mặt',        color: '#DC2626', bg: '#FEF2F2' },
    disputed:             { label: 'Khiếu nại',       color: '#DC2626', bg: '#FEF2F2' },
};

const getStatus = (status: string | null | undefined): StatusInfo => {
    if (!status) return STATUS_INFO.cancelled;
    return STATUS_INFO[status.toLowerCase()] ?? STATUS_INFO.cancelled;
};

const VN_WEEKDAYS_FULL = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

const formatLongDate = (iso: string | null | undefined): string => {
    if (!iso) return 'N/A';
    const d = dayjs(iso);
    return `${VN_WEEKDAYS_FULL[d.day()]}, ${d.format('DD/MM/YYYY')}`;
};

const formatTime = (iso: string | null | undefined): string => {
    if (!iso) return '--:--';
    return dayjs(iso).format('HH:mm');
};

const formatPrice = (amount: number | undefined) =>
    amount != null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount) : 'N/A';

const getInitial = (name: string | null | undefined): string => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return (parts[parts.length - 1]?.[0] ?? '?').toUpperCase();
};

const getAvatarBg = (name: string | null | undefined): string => {
    const palette = ['#6366F1', '#0d9488', '#d97706', '#059669', '#7c3aed', '#0891b2', '#db2777'];
    if (!name) return palette[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
    return palette[hash % palette.length];
};

// ─────────────────────────────────────────────────────────────────────────
const StudentLessonDetail = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState<LessonDetailDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const fetchDetail = useCallback(async () => {
        if (!lessonId) return;
        try {
            setLoading(true);
            const response = await getStudentLessonDetail(parseInt(lessonId));
            setLesson(response.content);
        } catch {
            antMessage.error('Không thể tải chi tiết buổi học');
        } finally {
            setLoading(false);
        }
    }, [lessonId]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    useLessonStartedListener(fetchDetail);

    const handleConfirm = async () => {
        if (!lessonId) return;
        try {
            setConfirming(true);
            await confirmStudentLesson(parseInt(lessonId));
            antMessage.success('Xác nhận buổi học thành công!');
            setShowConfirmModal(false);
            fetchDetail();
        } catch (error: any) {
            antMessage.error(error.response?.data?.message || 'Không thể xác nhận buổi học');
        } finally {
            setConfirming(false);
        }
    };

    const handleActionSuccess = () => {
        setShowConfirmModal(false);
        setShowFeedbackModal(false);
        fetchDetail();
    };

    // ── Loading ──
    if (loading) {
        return (
            <div className={s.page}>
                <div className={s.loadingCenter}>
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    // ── Not found ──
    if (!lesson) {
        return (
            <div className={s.page}>
                <div className={s.topBar}>
                    <div className={s.topBarLeft}>
                        <h1 className={s.pageTitle}>Chi tiết buổi học</h1>
                    </div>
                </div>
                <div className={s.mainContent}>
                    <div style={notFoundBox}>
                        <div style={notFoundIcon}>
                            <FileText size={32} strokeWidth={1.5} />
                        </div>
                        <div style={notFoundTitle}>Không tìm thấy buổi học</div>
                        <div style={notFoundSub}>Buổi học này có thể đã bị xóa hoặc bạn không có quyền truy cập.</div>
                        <button style={notFoundBackBtn} onClick={() => navigate('/student-portal/lessons')}>
                            <ArrowLeft size={14} /> Quay lại danh sách
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const status = getStatus(lesson.status);
    const isInProgress = lesson.status === 'in_progress';
    const canJoin = isInProgress && lesson.meetingLink;
    const isJitsi = isJitsiFallbackLink(lesson.meetingLink);
    const tutorName = (lesson as any).tutorName ?? (lesson as any).tutor?.fullName ?? 'Gia sư';
    const subjectName = (lesson as any).subjectName ?? (lesson as any).subject?.subjectName ?? 'Buổi học';
    const report = (lesson as any).report;

    return (
        <div className={s.page}>
            {/* Top Bar */}
            <div className={s.topBar}>
                <div className={s.topBarLeft}>
                    <h1 className={s.pageTitle}>Chi tiết buổi học</h1>
                    <p className={s.pageSubtitle}>
                        Lesson #{lesson.lessonId} · Booking #{lesson.bookingId}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className={s.mainContent} style={{ maxWidth: 1100 }}>
                {/* Back */}
                <button className={s.backBtn} onClick={() => navigate('/student-portal/lessons')}>
                    <ArrowLeft size={16} /> Quay lại danh sách
                </button>

                {/* Hero Join — compact, chỉ khi in_progress + meetingLink */}
                {canJoin && (
                    <div style={heroCard}>
                        <div style={heroLeft}>
                            <div style={heroLiveDot}>
                                <span style={heroPulseRing} />
                                <span style={heroSolidDot} />
                            </div>
                            <div>
                                <div style={heroBadgeText}>BUỔI HỌC ĐÃ BẮT ĐẦU</div>
                                <div style={heroSubtext}>
                                    Gia sư đang chờ bạn trong lớp
                                    {isJitsi && <span style={heroJitsiTag}>Jitsi (dự phòng)</span>}
                                </div>
                            </div>
                        </div>
                        <a
                            href={lesson.meetingLink!}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={heroJoinBtn}
                        >
                            <Video size={16} /> Tham gia ngay
                        </a>
                    </div>
                )}

                {/* Two-column grid: main info (left) + sidebar (right) */}
                <div style={twoColLayout}>
                    {/* ─── LEFT: Main Info ─── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
                        {/* Subject + status header */}
                        <div style={mainCard}>
                            <div style={subjectHeader}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={subjectTitle}>{subjectName}</div>
                                    <div style={subjectDate}>
                                        <CalendarIcon size={13} />
                                        {formatLongDate(lesson.scheduledStart)}
                                    </div>
                                </div>
                                <span style={{ ...statusPill, color: status.color, background: status.bg }}>
                                    <span style={{ ...statusDot, background: status.color }} />
                                    {status.label}
                                </span>
                            </div>

                            {/* Key metrics grid */}
                            <div style={metricsGrid}>
                                <MetricCell
                                    icon={<Clock size={16} />}
                                    label="Bắt đầu"
                                    value={formatTime(lesson.scheduledStart)}
                                    accent="#6366F1"
                                />
                                <MetricCell
                                    icon={<Clock size={16} />}
                                    label="Kết thúc"
                                    value={formatTime(lesson.scheduledEnd)}
                                    accent="#0891b2"
                                />
                                {lesson.lessonPrice != null && (
                                    <MetricCell
                                        icon={<DollarSign size={16} />}
                                        label="Giá buổi học"
                                        value={formatPrice(lesson.lessonPrice)}
                                        accent="#059669"
                                    />
                                )}
                            </div>

                            {/* Meeting link inline (nếu có và chưa hiện hero) */}
                            {lesson.meetingLink && !canJoin && (
                                <div style={meetingLinkBox}>
                                    <div style={meetingLinkLabel}>
                                        <Video size={14} />
                                        Link buổi học
                                        {isJitsi && (
                                            <span style={inlineJitsiTag}>Jitsi (dự phòng)</span>
                                        )}
                                    </div>
                                    <a
                                        href={lesson.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={meetingLinkValue}
                                    >
                                        {lesson.meetingLink}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Content + Homework — chỉ render nếu có */}
                        {(lesson.lessonContent || lesson.homework) && (
                            <div style={mainCard}>
                                <div style={sectionTitle}>Nội dung & bài tập</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {lesson.lessonContent && (
                                        <InfoBlock
                                            icon={<BookOpen size={15} />}
                                            iconBg="rgba(99,102,241,0.10)"
                                            iconColor="#6366F1"
                                            label="Nội dung buổi học"
                                            value={lesson.lessonContent}
                                        />
                                    )}
                                    {lesson.homework && (
                                        <InfoBlock
                                            icon={<AlertCircle size={15} />}
                                            iconBg="rgba(217,119,6,0.10)"
                                            iconColor="#d97706"
                                            label="Bài tập về nhà"
                                            value={lesson.homework}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tutor Report */}
                        {report && (
                            <div style={mainCard}>
                                <div style={sectionTitle}>
                                    <ClipboardCheck size={16} style={{ color: '#059669', marginRight: 8 }} />
                                    Báo cáo gia sư
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {report.contentCovered && (
                                        <ReportRow label="Nội dung đã dạy" value={report.contentCovered} />
                                    )}
                                    {report.homeworkAssigned && (
                                        <ReportRow label="Bài tập giao" value={report.homeworkAssigned} />
                                    )}
                                    {report.studentPerformanceRating != null && (
                                        <div style={ratingRow}>
                                            <span style={reportLabel}>Đánh giá học sinh</span>
                                            <span style={ratingValue}>
                                                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                                <strong>{report.studentPerformanceRating}</strong>
                                                <span style={{ color: '#9ca3af', fontSize: 12 }}>/ 5</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ─── RIGHT: Sidebar ─── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Tutor card */}
                        <div style={tutorCard}>
                            <div style={tutorCardLabel}>Gia sư</div>
                            <div style={tutorRow}>
                                <span style={tutorAvatar(tutorName)}>{getInitial(tutorName)}</span>
                                <div style={{ minWidth: 0 }}>
                                    <div style={tutorNameText}>{tutorName}</div>
                                    <div style={tutorSubText}>Người dạy của bạn</div>
                                </div>
                            </div>
                        </div>

                        {/* Action card */}
                        {(lesson.status === 'pending_confirmation' || lesson.status === 'completed') && (
                            <div style={actionCard}>
                                <div style={actionCardLabel}>
                                    {lesson.status === 'pending_confirmation' ? 'Cần xác nhận' : 'Đánh giá'}
                                </div>
                                <div style={actionCardText}>
                                    {lesson.status === 'pending_confirmation'
                                        ? 'Xác nhận để hoàn tất thanh toán cho gia sư.'
                                        : 'Đánh giá giúp gia sư cải thiện chất lượng.'}
                                </div>
                                {lesson.status === 'pending_confirmation' ? (
                                    <button
                                        style={{ ...primaryActionBtn, background: '#059669' }}
                                        onClick={() => setShowConfirmModal(true)}
                                    >
                                        <ClipboardCheck size={15} /> Xác nhận buổi học
                                    </button>
                                ) : (
                                    <button
                                        style={{ ...primaryActionBtn, background: '#3e2f28' }}
                                        onClick={() => setShowFeedbackModal(true)}
                                    >
                                        <Star size={15} /> Đánh giá buổi học
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modals */}
                <Modal
                    title="Xác nhận buổi học"
                    open={showConfirmModal}
                    onOk={handleConfirm}
                    onCancel={() => setShowConfirmModal(false)}
                    okText="Xác nhận"
                    cancelText="Hủy"
                    confirmLoading={confirming}
                >
                    <p>Bạn có chắc chắn muốn xác nhận buổi học #{lesson.lessonId}?</p>
                    <p>Tiền sẽ được chuyển cho gia sư sau khi xác nhận.</p>
                </Modal>

                <CreateFeedbackModal
                    open={showFeedbackModal}
                    onClose={() => setShowFeedbackModal(false)}
                    onSuccess={handleActionSuccess}
                    lessonId={lesson.lessonId}
                    bookingId={lesson.bookingId || 0}
                    tutorId={(lesson as any).tutorId || (lesson as any).tutor?.tutorId}
                    tutorName={tutorName}
                    subjectName={subjectName}
                />
            </div>
        </div>
    );
};

export default StudentLessonDetail;

// ─────────────────────────────────────────────────────────────────────────
// Small subcomponents
// ─────────────────────────────────────────────────────────────────────────

const MetricCell = ({
    icon,
    label,
    value,
    accent,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    accent: string;
}) => (
    <div style={metricCell}>
        <div style={{ ...metricIcon, background: `${accent}1A`, color: accent }}>{icon}</div>
        <div style={{ minWidth: 0 }}>
            <div style={metricLabel}>{label}</div>
            <div style={metricValue}>{value}</div>
        </div>
    </div>
);

const InfoBlock = ({
    icon,
    iconBg,
    iconColor,
    label,
    value,
}: {
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    label: string;
    value: string;
}) => (
    <div style={infoBlock}>
        <div style={{ ...infoBlockIcon, background: iconBg, color: iconColor }}>{icon}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
            <div style={infoBlockLabel}>{label}</div>
            <div style={infoBlockValue}>{value}</div>
        </div>
    </div>
);

const ReportRow = ({ label, value }: { label: string; value: string }) => (
    <div>
        <div style={reportLabel}>{label}</div>
        <div style={reportValue}>{value}</div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────

// ── Two-column layout ──
const twoColLayout: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 320px',
    gap: 16,
    alignItems: 'start',
};

// ── Hero card ──
const heroCard: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '14px 18px',
    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    color: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0 4px 14px rgba(22,163,74,0.25)',
};

const heroLeft: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 0,
};

const heroLiveDot: React.CSSProperties = {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
};

const heroPulseRing: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.5)',
};

const heroSolidDot: React.CSSProperties = {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 0 0 3px rgba(255,255,255,0.4)',
};

const heroBadgeText: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    opacity: 0.95,
    fontFamily: "'IBM Plex Sans', sans-serif",
    marginBottom: 4,
};

const heroSubtext: React.CSSProperties = {
    fontSize: 13,
    opacity: 0.92,
    fontFamily: "'IBM Plex Sans', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: 8,
};

const heroJitsiTag: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    background: 'rgba(255,255,255,0.25)',
    padding: '1px 6px',
    borderRadius: 4,
    letterSpacing: 0.3,
};

const heroJoinBtn: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 20px',
    background: '#fff',
    color: '#15803d',
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 8,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    fontFamily: "'IBM Plex Sans', sans-serif",
    flexShrink: 0,
};

// ── Main card ──
const mainCard: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #f0f0f0',
    borderRadius: 14,
    padding: 22,
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
};

const subjectHeader: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
    paddingBottom: 18,
    borderBottom: '1px solid #f5f5f5',
};

const subjectTitle: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 700,
    color: '#1a2238',
    fontFamily: "'Bricolage Grotesque', 'IBM Plex Sans', sans-serif",
    marginBottom: 6,
    lineHeight: 1.2,
    wordBreak: 'break-word',
};

const subjectDate: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#737373',
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 500,
};

const statusPill: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "'IBM Plex Sans', sans-serif",
    whiteSpace: 'nowrap',
    flexShrink: 0,
};

const statusDot: React.CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: '50%',
};

// ── Metrics grid ──
const metricsGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 14,
};

const metricCell: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    background: '#fafaf8',
    borderRadius: 10,
    border: '1px solid #f5f5f5',
};

const metricIcon: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
};

const metricLabel: React.CSSProperties = {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
    fontFamily: "'IBM Plex Sans', sans-serif",
};

const metricValue: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    color: '#1a2238',
    fontFamily: "'Bricolage Grotesque', 'IBM Plex Sans', sans-serif",
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

// ── Meeting link box ──
const meetingLinkBox: React.CSSProperties = {
    marginTop: 16,
    padding: '12px 14px',
    background: 'rgba(99,102,241,0.04)',
    border: '1px dashed rgba(99,102,241,0.25)',
    borderRadius: 10,
};

const meetingLinkLabel: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    fontWeight: 600,
    color: '#6366F1',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
    fontFamily: "'IBM Plex Sans', sans-serif",
};

const meetingLinkValue: React.CSSProperties = {
    fontSize: 13,
    color: '#1a2238',
    fontWeight: 500,
    textDecoration: 'none',
    wordBreak: 'break-all',
};

const inlineJitsiTag: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    color: '#92400e',
    background: '#fef3c7',
    padding: '1px 6px',
    borderRadius: 4,
    letterSpacing: 0.3,
    textTransform: 'none',
};

// ── Section title ──
const sectionTitle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: 700,
    color: '#1a2238',
    marginBottom: 16,
    fontFamily: "'Bricolage Grotesque', 'IBM Plex Sans', sans-serif",
};

// ── Info block ──
const infoBlock: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
};

const infoBlockIcon: React.CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
};

const infoBlockLabel: React.CSSProperties = {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 3,
    fontFamily: "'IBM Plex Sans', sans-serif",
};

const infoBlockValue: React.CSSProperties = {
    fontSize: 14,
    color: '#1a2238',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    fontFamily: "'IBM Plex Sans', sans-serif",
};

// ── Tutor card ──
const tutorCard: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #f0f0f0',
    borderRadius: 14,
    padding: 18,
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
};

const tutorCardLabel: React.CSSProperties = {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    fontFamily: "'IBM Plex Sans', sans-serif",
};

const tutorRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
};

const tutorAvatar = (name: string | null | undefined): React.CSSProperties => ({
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: getAvatarBg(name),
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 700,
    flexShrink: 0,
    fontFamily: "'Bricolage Grotesque', 'IBM Plex Sans', sans-serif",
});

const tutorNameText: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    color: '#1a2238',
    fontFamily: "'Bricolage Grotesque', 'IBM Plex Sans', sans-serif",
    lineHeight: 1.2,
    marginBottom: 2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const tutorSubText: React.CSSProperties = {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: "'IBM Plex Sans', sans-serif",
};

// ── Action card ──
const actionCard: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #f0f0f0',
    borderRadius: 14,
    padding: 18,
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
};

const actionCardLabel: React.CSSProperties = {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    fontFamily: "'IBM Plex Sans', sans-serif",
};

const actionCardText: React.CSSProperties = {
    fontSize: 13,
    color: '#525252',
    lineHeight: 1.5,
    marginBottom: 14,
    fontFamily: "'IBM Plex Sans', sans-serif",
};

const primaryActionBtn: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    padding: '11px 16px',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: "'IBM Plex Sans', sans-serif",
};

// ── Report ──
const reportLabel: React.CSSProperties = {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
    fontFamily: "'IBM Plex Sans', sans-serif",
};

const reportValue: React.CSSProperties = {
    fontSize: 14,
    color: '#1a2238',
    lineHeight: 1.6,
    fontFamily: "'IBM Plex Sans', sans-serif",
    whiteSpace: 'pre-wrap',
};

const ratingRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    background: 'rgba(251,191,36,0.08)',
    border: '1px solid rgba(251,191,36,0.2)',
    borderRadius: 10,
};

const ratingValue: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 16,
    color: '#92400e',
    fontFamily: "'Bricolage Grotesque', 'IBM Plex Sans', sans-serif",
};

// ── Not found ──
const notFoundBox: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
    textAlign: 'center',
};

const notFoundIcon: React.CSSProperties = {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.08)',
    color: '#6366F1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
};

const notFoundTitle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    color: '#1a2238',
    marginBottom: 8,
    fontFamily: "'Bricolage Grotesque', 'IBM Plex Sans', sans-serif",
};

const notFoundSub: React.CSSProperties = {
    fontSize: 13,
    color: '#737373',
    maxWidth: 360,
    lineHeight: 1.5,
    marginBottom: 24,
};

const notFoundBackBtn: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 20px',
    background: '#1a2238',
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: "'IBM Plex Sans', sans-serif",
};
