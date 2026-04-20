import { forwardRef } from "react";
import dayjs from "dayjs";
import { Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import styles from "../../../styles/pages/tutor-portal-schedule.module.css";
import { getLessonStatusInfo } from "./utils";
import type { LessonDetailDto } from "../../../services/lesson.service";

interface Props {
    position: { x: number; y: number };
    isLoading: boolean;
    detail: LessonDetailDto | null;
    onClose: () => void;
    onNavigateToClassDetail: () => void;
}

const LessonDetailPopup = forwardRef<HTMLDivElement, Props>(({
    position,
    isLoading,
    detail,
    onClose,
    onNavigateToClassDetail,
}, ref) => {
    return (
        <div
            ref={ref}
            className={styles.lessonPopup}
            style={{ left: position.x, top: position.y }}
        >
            <div className={styles.lessonPopupHeader}>
                <span className={styles.lessonPopupTitle}>Chi tiết buổi học</span>
                <button className={styles.lessonPopupClose} onClick={onClose}>
                    <CloseOutlined />
                </button>
            </div>
            {isLoading ? (
                <div className={styles.lessonPopupLoading}>
                    <Spin size="small" />
                    <span>Đang tải...</span>
                </div>
            ) : detail ? (
                <div className={styles.lessonPopupBody}>
                    <div className={styles.lessonPopupRow}>
                        <span className={styles.lessonPopupLabel}>Môn học</span>
                        <span className={styles.lessonPopupValue}>{detail.subject?.subjectName || "N/A"}</span>
                    </div>
                    <div className={styles.lessonPopupRow}>
                        <span className={styles.lessonPopupLabel}>Học sinh</span>
                        <span className={styles.lessonPopupValue}>{detail.student?.fullName || "N/A"}</span>
                    </div>
                    <div className={styles.lessonPopupRow}>
                        <span className={styles.lessonPopupLabel}>Thời gian</span>
                        <span className={styles.lessonPopupValue}>
                            {dayjs(detail.scheduledStart).format("HH:mm")} - {dayjs(detail.scheduledEnd).format("HH:mm")}
                            {" · "}
                            {dayjs(detail.scheduledStart).format("DD/MM/YYYY")}
                        </span>
                    </div>
                    <div className={styles.lessonPopupRow}>
                        <span className={styles.lessonPopupLabel}>Trạng thái</span>
                        <span
                            className={styles.lessonPopupStatus}
                            style={{ color: getLessonStatusInfo(detail.status || null).color }}
                        >
                            {getLessonStatusInfo(detail.status || null).label}
                        </span>
                    </div>
                    {detail.lessonPrice != null && (
                        <div className={styles.lessonPopupRow}>
                            <span className={styles.lessonPopupLabel}>Giá buổi học</span>
                            <span className={styles.lessonPopupValue} style={{ fontWeight: 600 }}>
                                {detail.lessonPrice.toLocaleString("vi-VN")}đ
                            </span>
                        </div>
                    )}
                    {detail.meetingLink && (
                        <div className={styles.lessonPopupRow}>
                            <span className={styles.lessonPopupLabel}>Link học</span>
                            <a
                                href={detail.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.lessonPopupLink}
                                onClick={(e) => e.stopPropagation()}
                            >
                                Tham gia Meet ↗
                            </a>
                        </div>
                    )}
                    {detail.bookingId && (
                        <button
                            className={styles.lessonPopupDetailBtn}
                            onClick={onNavigateToClassDetail}
                        >
                            Xem chi tiết lớp học →
                        </button>
                    )}
                </div>
            ) : null}
        </div>
    );
});

LessonDetailPopup.displayName = "LessonDetailPopup";

export default LessonDetailPopup;
