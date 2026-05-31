import React, { useMemo, useState } from 'react';
import styles from '../styles.module.css';
import { DAY_COLUMNS, GRADE_LEVELS, formatHour, formatPrice } from './constants';
import HourSlotGrid from './HourSlotGrid';
import type { Combo, FixedCombo, FlexCombo, SubjectRecord, TutorAvailabilitySlot } from './types';

interface OnboardingSummaryProps {
  subjectRecords: SubjectRecord[];
  availability: TutorAvailabilitySlot[];
  combos: Combo[];
  onBack: () => void;
  onFinish: () => void;
}

type View = 'schedule' | 'subjects' | 'combos';

const dayLabel = (dow: number) => DAY_COLUMNS.find((c) => c.dayOfWeek === dow)?.full ?? `Ngày ${dow}`;
const gradeLabel = (g: string) => GRADE_LEVELS.find((x) => x.value === g)?.label ?? g;

// Palette để phân biệt combo trên lưới (rotate theo index).
const COMBO_COLORS = [
  { bg: '#1a2238', border: '#1a2238' },
  { bg: '#3d4a3e', border: '#3d4a3e' },
  { bg: '#92580f', border: '#92580f' },
  { bg: '#631b1b', border: '#631b1b' },
  { bg: '#5c4836', border: '#5c4836' },
];

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
      <span className={`${styles.comboTypeBadge} ${combo.type === 'fixed' ? styles.comboFixed : styles.comboFlex}`}>
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
          <strong>{combo.sessionsPerWeek}</strong> buổi/tuần · <strong>{combo.sessionsPerMonth}</strong> buổi/tháng ·{' '}
          <strong>{combo.hoursPerSession}</strong> giờ/buổi
        </div>
        <p className={styles.comboDescription}>{combo.description}</p>
      </div>
    )}
  </div>
);

const OnboardingSummary: React.FC<OnboardingSummaryProps> = ({
  subjectRecords,
  availability: _availability,
  combos,
  onBack,
  onFinish,
}) => {
  const [view, setView] = useState<View>('schedule');

  // ── Subject stats ──
  const uniqueSubjects = new Set(subjectRecords.map((r) => r.subjectId)).size;
  const rates = subjectRecords.map((r) => r.hourlyRate);
  const minRate = rates.length ? Math.min(...rates) : 0;
  const maxRate = rates.length ? Math.max(...rates) : 0;

  // ── Combo phân loại ──
  const fixedCombos = useMemo(() => combos.filter((c): c is FixedCombo => c.type === 'fixed'), [combos]);
  const flexCombos = useMemo(() => combos.filter((c): c is FlexCombo => c.type === 'flex'), [combos]);

  // ── Lookup map cho lưới: (day-hour) → combo cố định nào đang chiếm ô đó ──
  const comboCellMap = useMemo(() => {
    const map = new Map<string, { comboIndex: number; isStart: boolean; combo: FixedCombo }>();
    fixedCombos.forEach((combo, idx) => {
      combo.sessions.forEach((session) => {
        for (let h = session.startHour; h < session.startHour + session.durationHours; h += 1) {
          map.set(`${session.dayOfWeek}-${h}`, {
            comboIndex: idx,
            isStart: h === session.startHour,
            combo,
          });
        }
      });
    });
    return map;
  }, [fixedCombos]);

  // ── Stats cho tab Lịch tuần ──
  const scheduleStats = useMemo(() => {
    const totalFixedSessions = fixedCombos.reduce((sum, c) => sum + c.sessions.length, 0);
    const totalFixedHours = fixedCombos.reduce(
      (sum, c) => sum + c.sessions.reduce((s, ses) => s + ses.durationHours, 0),
      0,
    );

    let earliest: number | null = null;
    let latest: number | null = null;
    fixedCombos.forEach((c) =>
      c.sessions.forEach((s) => {
        if (earliest === null || s.startHour < earliest) earliest = s.startHour;
        const end = s.startHour + s.durationHours;
        if (latest === null || end > latest) latest = end;
      }),
    );

    return {
      totalFixedSessions,
      totalFixedHours,
      earliest,
      latest,
      hasAny: combos.length > 0,
    };
  }, [combos, fixedCombos]);

  // ── Combo stats (tab Combo) ──
  const fixedSessionsCount = scheduleStats.totalFixedSessions;

  const renderScheduleCell = (dayOfWeek: number, hour: number) => {
    const info = comboCellMap.get(`${dayOfWeek}-${hour}`);
    if (!info) {
      return <div className={`${styles.cell} ${styles.cellStatic}`} />;
    }
    const color = COMBO_COLORS[info.comboIndex % COMBO_COLORS.length];
    return (
      <div
        className={`${styles.cell} ${styles.cellStatic}`}
        style={{
          background: color.bg,
          borderColor: color.border,
          borderStyle: 'solid',
          color: '#fff',
          padding: '4px 6px',
          justifyContent: 'center',
          alignItems: 'flex-start',
          textAlign: 'left',
        }}
        aria-label={`${dayLabel(dayOfWeek)} ${formatHour(hour)} - ${info.combo.name}`}
      >
        {info.isStart && (
          <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.15, color: '#fff' }}>{info.combo.name}</span>
        )}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.successIcon}>
          <CheckIcon />
        </div>
        <h1 className={styles.headerTitle}>Thiết lập hoàn tất!</h1>
        <p className={styles.headerSubtitle}>Đây là tổng quan môn học, lịch combo và cấu hình bạn đã thiết lập.</p>
      </div>

      <div className={styles.body}>
        <div className={styles.subjectTabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'schedule'}
            className={`${styles.subjectTab} ${view === 'schedule' ? styles.activeTab : ''}`}
            onClick={() => setView('schedule')}
          >
            <span>Lịch tuần combo</span>
            <span className={styles.subjectTabBadge}>{fixedSessionsCount}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'subjects'}
            className={`${styles.subjectTab} ${view === 'subjects' ? styles.activeTab : ''}`}
            onClick={() => setView('subjects')}
          >
            <span>Môn & giá</span>
            <span className={styles.subjectTabBadge}>{subjectRecords.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'combos'}
            className={`${styles.subjectTab} ${view === 'combos' ? styles.activeTab : ''}`}
            onClick={() => setView('combos')}
          >
            <span>Combo chi tiết</span>
            <span className={styles.subjectTabBadge}>{combos.length}</span>
          </button>
        </div>

        {view === 'schedule' ? (
          !scheduleStats.hasAny ? (
            <div className={styles.empty}>Chưa có combo nào được thiết lập.</div>
          ) : (
            <>
              <div className={styles.statRow}>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Combo cố định</span>
                  <span className={styles.statValue}>{fixedCombos.length}</span>
                  <span className={styles.statSub}>{scheduleStats.totalFixedSessions} buổi / tuần</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Tổng giờ dạy / tuần</span>
                  <span className={styles.statValue}>{scheduleStats.totalFixedHours}</span>
                  <span className={styles.statSub}>giờ (combo cố định)</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Khung giờ dạy</span>
                  <span className={styles.statValue}>
                    {scheduleStats.earliest !== null && scheduleStats.latest !== null
                      ? `${formatHour(scheduleStats.earliest)}–${formatHour(scheduleStats.latest)}`
                      : '—'}
                  </span>
                  <span className={styles.statSub}>sớm nhất – muộn nhất</span>
                </div>
              </div>

              {fixedCombos.length > 0 ? (
                <>
                  <h3 className={styles.recapTitle}>Lịch tuần combo cố định</h3>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    {fixedCombos.map((c, idx) => {
                      const color = COMBO_COLORS[idx % COMBO_COLORS.length];
                      return (
                        <span
                          key={c.id}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 7,
                            padding: '5px 10px',
                            borderRadius: 999,
                            background: 'rgba(26, 34, 56, 0.04)',
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#1a2238',
                          }}
                        >
                          <i
                            style={{
                              display: 'inline-block',
                              width: 12,
                              height: 12,
                              borderRadius: 4,
                              background: color.bg,
                            }}
                          />
                          {c.name}
                          <span style={{ color: 'rgba(62,47,40,0.55)', fontWeight: 500 }}>
                            · {c.sessions.length} buổi
                          </span>
                        </span>
                      );
                    })}
                  </div>
                  <HourSlotGrid renderCell={renderScheduleCell} />
                </>
              ) : (
                <div className={styles.empty}>Chưa có combo cố định để hiển thị trên lịch tuần.</div>
              )}

              {flexCombos.length > 0 && (
                <div style={{ marginTop: 22 }}>
                  <h3 className={styles.recapTitle}>Combo linh hoạt</h3>
                  <p style={{ margin: '0 0 10px', fontSize: 12.5, color: 'rgba(62,47,40,0.6)' }}>
                    Không cố định khung giờ — phụ huynh chọn giờ phù hợp khi đặt lịch.
                  </p>
                  <div className={styles.recapList}>
                    {flexCombos.map((c) => (
                      <div key={c.id} className={styles.recapRow}>
                        <strong className={styles.recapRowName}>{c.name}</strong>
                        <span className={styles.recapRowValue}>
                          {c.sessionsPerWeek} buổi/tuần · {c.hoursPerSession} giờ/buổi
                        </span>
                        <span className={styles.recapRowMeta}>{c.sessionsPerMonth} buổi/tháng</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )
        ) : view === 'subjects' ? (
          <>
            <div className={styles.statRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Tổng record</span>
                <span className={styles.statValue}>{subjectRecords.length}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Số môn khác nhau</span>
                <span className={styles.statValue}>{uniqueSubjects}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Khoảng giá (đ/giờ)</span>
                <span className={styles.statValue}>
                  {minRate === maxRate ? formatPrice(minRate) : `${formatPrice(minRate)}–${formatPrice(maxRate)}`}
                </span>
              </div>
            </div>

            <h3 className={styles.recapTitle}>Danh sách môn-khối-giá</h3>
            {subjectRecords.length === 0 ? (
              <div className={styles.empty}>Chưa có record nào.</div>
            ) : (
              <div className={styles.recordsTable}>
                <div className={`${styles.recordsRow} ${styles.recordsHead}`}>
                  <span>Môn</span>
                  <span>Khối lớp</span>
                  <span>Giá / giờ</span>
                  <span />
                </div>
                {subjectRecords.map((r) => (
                  <div key={r.id} className={styles.recordsRow}>
                    <span className={styles.recordSubject}>{r.subjectName}</span>
                    <span>{gradeLabel(r.gradeLevel)}</span>
                    <span className={styles.recordRate}>{formatPrice(r.hourlyRate)}đ</span>
                    <span />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : combos.length === 0 ? (
          <div className={styles.empty}>Chưa có combo nào.</div>
        ) : (
          <>
            <div className={styles.statRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Combo cố định</span>
                <span className={styles.statValue}>{fixedCombos.length}</span>
                <span className={styles.statSub}>{fixedSessionsCount} buổi đã đặt</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Combo linh hoạt</span>
                <span className={styles.statValue}>{flexCombos.length}</span>
                <span className={styles.statSub}>phụ huynh tự đặt giờ</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Tổng combo</span>
                <span className={styles.statValue}>{combos.length}</span>
              </div>
            </div>

            <h3 className={styles.recapTitle}>Danh sách combo</h3>
            <div className={styles.comboList}>
              {combos.map((c) => (
                <ComboReadOnlyCard key={c.id} combo={c} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerInfo}>Cấu hình combo đang được lưu trong phiên onboarding này.</div>
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
