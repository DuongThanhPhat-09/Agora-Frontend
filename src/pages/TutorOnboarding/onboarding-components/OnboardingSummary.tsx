import React, { useState } from 'react';
import styles from '../styles.module.css';
import HourSlotGrid from './HourSlotGrid';
import { DAY_COLUMNS, formatHour, formatPrice } from './constants';
import type { AvailabilitySlot, Combo, OnboardingSubject } from './types';

interface OnboardingSummaryProps {
    subjects: OnboardingSubject[];
    availability: AvailabilitySlot[];
    combos: Combo[];
    onBack: () => void;
    onFinish: () => void;
}

type View = 'overview' | 'combos';

const dayLabel = (dow: number) => DAY_COLUMNS.find((c) => c.dayOfWeek === dow)?.full ?? `Ngày ${dow}`;

const CheckIcon = () => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M20 6L9 17l-5-5" />
    </svg>
);

const ComboReadOnlyCard: React.FC<{ combo: Combo }> = ({ combo }) => (
    <div className={styles.comboCard}>
        <div className={styles.comboCardHead}>
            <span
                className={`${styles.comboTypeBadge} ${
                    combo.type === 'fixed' ? styles.comboFixed : styles.comboFlex
                }`}
            >
                {combo.type === 'fixed' ? 'Cố định' : 'Linh hoạt'}
            </span>
        </div>
        <h4 className={styles.comboName}>{combo.name}</h4>
        {combo.type === 'fixed' ? (
            <ul className={styles.comboSessionList}>
                {combo.sessions.map((s, i) => (
                    <li key={i}>
                        {dayLabel(s.dayOfWeek)} · {formatHour(s.startHour)}–{formatHour(s.startHour + s.durationHours)} (
                        {s.durationHours} giờ)
                    </li>
                ))}
            </ul>
        ) : (
            <div className={styles.comboFlexInfo}>
                <div>
                    <strong>{combo.sessionsPerWeek}</strong> buổi/tuần · <strong>{combo.sessionsPerMonth}</strong>{' '}
                    buổi/tháng · <strong>{combo.hoursPerSession}</strong> giờ/buổi
                </div>
                <p className={styles.comboDescription}>{combo.description}</p>
            </div>
        )}
    </div>
);

const OnboardingSummary: React.FC<OnboardingSummaryProps> = ({
    subjects,
    availability,
    combos,
    onBack,
    onFinish,
}) => {
    const [view, setView] = useState<View>('overview');

    const availSet = new Set(availability.map((s) => s.id));
    const renderCell = (dayOfWeek: number, hour: number) => {
        const isAvail = availSet.has(`${dayOfWeek}-${hour}`);
        return (
            <div className={`${styles.cell} ${styles.cellStatic} ${isAvail ? styles.available : ''}`}>
                {isAvail && <span className={styles.cellLabel}>Rảnh</span>}
            </div>
        );
    };

    const hourlyRates = subjects
        .map((s) => s.hourlyRate)
        .filter((r): r is number => r != null && r > 0);
    const minRate = hourlyRates.length ? Math.min(...hourlyRates) : 0;
    const maxRate = hourlyRates.length ? Math.max(...hourlyRates) : 0;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.successIcon}>
                    <CheckIcon />
                </div>
                <h1 className={styles.headerTitle}>Thiết lập hoàn tất!</h1>
                <p className={styles.headerSubtitle}>
                    Hồ sơ lịch dạy & combo đã sẵn sàng. Phụ huynh có thể bắt đầu đặt lịch theo combo hoặc theo giờ lẻ.
                </p>
            </div>

            <div className={styles.body}>
                <div className={styles.subjectTabs} role="tablist">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={view === 'overview'}
                        className={`${styles.subjectTab} ${view === 'overview' ? styles.activeTab : ''}`}
                        onClick={() => setView('overview')}
                    >
                        Tổng quan
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={view === 'combos'}
                        className={`${styles.subjectTab} ${view === 'combos' ? styles.activeTab : ''}`}
                        onClick={() => setView('combos')}
                    >
                        <span>Combo</span>
                        <span className={styles.subjectTabBadge}>{combos.length}</span>
                    </button>
                </div>

                {view === 'overview' ? (
                    <>
                        <div className={styles.statRow}>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Số môn dạy</span>
                                <span className={styles.statValue}>{subjects.length}</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Khung giờ rảnh / tuần</span>
                                <span className={styles.statValue}>{availability.length}</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Số combo</span>
                                <span className={styles.statValue}>{combos.length}</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Khoảng giá (đ/giờ)</span>
                                <span className={styles.statValue}>
                                    {minRate === maxRate
                                        ? formatPrice(minRate)
                                        : `${formatPrice(minRate)}–${formatPrice(maxRate)}`}
                                </span>
                            </div>
                        </div>

                        <h3 className={styles.recapTitle}>Giá theo môn</h3>
                        <div className={styles.recapList}>
                            {subjects.map((s) => (
                                <div key={s.subjectId} className={styles.recapRow}>
                                    <span className={styles.recapRowName}>{s.subjectName}</span>
                                    <span className={styles.recapRowValue}>
                                        {formatPrice(s.hourlyRate ?? 0)}đ / giờ
                                    </span>
                                </div>
                            ))}
                        </div>

                        <h3 className={styles.recapTitle}>Lịch rảnh trong tuần</h3>
                        <div className={`${styles.legend} ${styles.legendTop}`}>
                            <div className={styles.legendItem}>
                                <span className={`${styles.legendDot} ${styles.available}`} /> Khung giờ rảnh
                            </div>
                            <div className={styles.legendItem}>
                                <span className={`${styles.legendDot} ${styles.dotEmpty}`} /> Chưa mở
                            </div>
                        </div>
                        <HourSlotGrid renderCell={renderCell} />
                    </>
                ) : combos.length === 0 ? (
                    <div className={styles.empty}>Chưa có combo nào.</div>
                ) : (
                    <div className={styles.comboList}>
                        {combos.map((c) => (
                            <ComboReadOnlyCard key={c.id} combo={c} />
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.footer}>
                <div className={styles.footerInfo}>Dữ liệu demo (state FE) — sẽ nối API khi backend sẵn sàng.</div>
                <div className={styles.footerBtns}>
                    <button type="button" className={styles.btnGhost} onClick={onBack}>
                        Chỉnh sửa lại
                    </button>
                    <button type="button" className={styles.btnPrimary} onClick={onFinish}>
                        Về Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingSummary;
