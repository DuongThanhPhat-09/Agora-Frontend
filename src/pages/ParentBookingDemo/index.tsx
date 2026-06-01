import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  CalendarRange,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GraduationCap,
  Heart,
  Play,
  RotateCcw,
  ShieldCheck,
  Star,
  UserRound,
  UsersRound,
  X,
  Zap,
} from 'lucide-react';
import Header from '../../components/Header';
import {
  CALENDAR_TIMES,
  CHILDREN,
  DAY_NAMES,
  TUTORS,
  type BookingSlot,
  type FixedCombo,
  type Tutor,
  type TutorCombo,
} from './data';
import styles from './styles.module.css';

type BookingStep = 1 | 2 | 3 | 4;

const STEPS: { id: BookingStep; label: string }[] = [
  { id: 1, label: 'Học sinh & môn' },
  { id: 2, label: 'Hình thức' },
  { id: 3, label: 'Lịch học' },
  { id: 4, label: 'Xác nhận' },
];

const addDays = (date: Date, numberOfDays: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + numberOfDays);
  return next;
};

const getNextMonday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysFromMonday = (today.getDay() + 6) % 7;
  return addDays(today, 7 - daysFromMonday);
};

const getEndOfNextMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 2, 0);

const getBookingValidityEnd = (startDate: Date) => {
  const nextMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
  const lastDayOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
  nextMonth.setDate(Math.min(startDate.getDate(), lastDayOfNextMonth));
  return addDays(nextMonth, -1);
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fromDateKey = (dateKey: string) => new Date(`${dateKey}T00:00:00`);

const formatDate = (dateKey: string) =>
  fromDateKey(dateKey).toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });

const formatFullDate = (date: Date) =>
  date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const formatShortDate = (date: Date) =>
  date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  });

const getWeekStart = (date: Date) => {
  const daysFromMonday = (date.getDay() + 6) % 7;
  return addDays(date, -daysFromMonday);
};

const formatWeekday = (date: Date) => DAY_NAMES[(date.getDay() + 6) % 7];

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);

const formatGradeRange = (grades: number[]) => {
  const first = grades[0];
  const last = grades[grades.length - 1];
  return first === last ? `Lớp ${first}` : `Lớp ${first} - ${last}`;
};

const getSlotKey = (slot: Pick<BookingSlot, 'date' | 'startTime'>) => `${slot.date}-${slot.startTime}`;

const sortSlots = (slots: BookingSlot[]) =>
  [...slots].sort((first, second) => getSlotKey(first).localeCompare(getSlotKey(second)));

const buildFixedSchedule = (combo: FixedCombo, firstWeekStart: Date, bookingDeadline: Date): BookingSlot[] => {
  const schedule = sortSlots(
    Array.from({ length: 4 }, (_, weekIndex) =>
      combo.sessions.map((session) => ({
        ...session,
        date: toDateKey(addDays(firstWeekStart, weekIndex * 7 + session.dayOfWeek - 1)),
      })),
    ).flat(),
  );

  if (!schedule.length) return [];

  const validityEnd = getBookingValidityEnd(fromDateKey(schedule[0].date));
  return schedule.filter((slot) => {
    const slotDate = fromDateKey(slot.date);
    return slotDate <= validityEnd && slotDate <= bookingDeadline;
  });
};

const getLowestRate = (tutor: Tutor) => Math.min(...tutor.subjects.map((subject) => subject.hourlyRate));

const getSchedulePreview = (tutor: Tutor) => {
  const grouped = tutor.availability.reduce<Record<number, string[]>>((current, slot) => {
    current[slot.dayOfWeek] = [...(current[slot.dayOfWeek] ?? []), slot.startTime];
    return current;
  }, {});

  return Object.entries(grouped)
    .slice(0, 3)
    .map(([day, times]) => ({
      day: DAY_NAMES[Number(day) - 1],
      times,
    }));
};

const TutorBrowse = ({ onViewTutor }: { onViewTutor: (tutorId: string) => void }) => (
  <main className={styles.browseShell}>
    <section className={styles.searchHero}>
      <span className={styles.eyebrow}>Tìm gia sư phù hợp</span>
      <h1>Chọn người đồng hành cho con</h1>
      <p>Xem hồ sơ gia sư trước khi bắt đầu quy trình đặt lịch học.</p>
      <div className={styles.searchPills}>
        <span>Gia sư đã xác minh</span>
        <span>Lịch học linh hoạt</span>
        <span>Demo frontend-only</span>
      </div>
    </section>

    <section className={styles.resultsSection}>
      <div className={styles.resultsHeading}>
        <div>
          <span className={styles.eyebrow}>Danh sách đề xuất</span>
          <h2>Gia sư nổi bật</h2>
        </div>
        <span>{TUTORS.length} hồ sơ phù hợp</span>
      </div>

      <div className={styles.resultGrid}>
        {TUTORS.map((tutor) => (
          <article key={tutor.id} className={styles.tutorResultCard}>
            <div className={styles.tutorResultBody}>
              <div className={styles.tutorCardHeader}>
                <div className={styles.tutorIdentity}>
                  <span className={styles.avatar}>{tutor.initials}</span>
                  <div>
                    <h3>{tutor.name}</h3>
                    <span className={styles.verifiedBadge}>
                      <ShieldCheck size={12} />
                      Đã xác minh
                    </span>
                  </div>
                </div>
                <span className={styles.rating}>
                  <Star size={14} fill="currentColor" />
                  {tutor.rating}
                </span>
              </div>

              <p className={styles.tutorCredential}>{tutor.education}</p>

              <div className={styles.subjectTags}>
                {tutor.subjects.map((subject) => (
                  <span key={subject.id}>{subject.name}</span>
                ))}
              </div>

              <div className={styles.gradeRow}>
                <BookOpen size={14} />
                {tutor.subjects.map((subject) => (
                  <span key={subject.id}>
                    {subject.name}: {formatGradeRange(subject.grades)}
                  </span>
                ))}
              </div>

              <div className={styles.tutorStats}>
                <span>
                  <strong>{tutor.yearsExperience} năm</strong>
                  Kinh nghiệm
                </span>
                <span>
                  <strong>{tutor.studentCount}</strong>
                  Học sinh
                </span>
                <span>
                  <strong>{tutor.reviewCount}</strong>
                  Đánh giá
                </span>
              </div>
            </div>

            <footer className={styles.tutorResultFooter}>
              <div>
                <small>Học phí từ</small>
                <strong>{formatPrice(getLowestRate(tutor))}</strong>
                <span>/ giờ</span>
              </div>
              <button type="button" onClick={() => onViewTutor(tutor.id)}>
                Xem chi tiết
                <ArrowRight size={15} />
              </button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  </main>
);

const TutorDetail = ({ tutor, onBack, onBooking }: { tutor: Tutor; onBack: () => void; onBooking: () => void }) => {
  const schedulePreview = getSchedulePreview(tutor);

  return (
    <main className={styles.detailShell}>
      <button type="button" className={styles.backLink} onClick={onBack}>
        <ArrowLeft size={16} />
        Quay lại danh sách gia sư
      </button>

      <div className={styles.detailLayout}>
        <div className={styles.detailContent}>
          <section className={styles.profileHero}>
            <div className={styles.profileHeroTop}>
              <span>
                <i />
                TUTORA Original Interview
              </span>
              <small>Click để xem phỏng vấn học thuật</small>
            </div>
            <button type="button" className={styles.playButton} aria-label="Xem video giới thiệu">
              <Play size={20} fill="currentColor" />
            </button>
            <div className={styles.profileHeroBottom}>
              <span className={styles.profileAvatar}>{tutor.initials}</span>
              <div>
                <small>{tutor.education}</small>
                <h1>{tutor.name}</h1>
                <p>{tutor.title}</p>
              </div>
            </div>
            <div className={styles.heroRating}>
              <div>
                <span>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={13} fill="currentColor" />
                  ))}
                </span>
                <strong>
                  {tutor.rating} ({tutor.reviewCount} đánh giá)
                </strong>
              </div>
              <Heart size={19} />
            </div>
          </section>

          <section className={styles.teachingMeta}>
            <div className={styles.detailSubjectTags}>
              {tutor.subjects.map((subject) => (
                <span key={subject.id}>{subject.name}</span>
              ))}
            </div>
            <div className={styles.gradeGroups}>
              <strong>Cấp lớp giảng dạy</strong>
              {tutor.subjects.map((subject) => (
                <span key={subject.id}>
                  {subject.name}: <b>{formatGradeRange(subject.grades)}</b>
                </span>
              ))}
            </div>
          </section>

          <section className={styles.infoPanel}>
            <span className={styles.eyebrow}>Về gia sư</span>
            <h2>Phương pháp học tập rõ ràng, theo sát tiến độ</h2>
            <p>{tutor.bio}</p>
            <div className={styles.featureGrid}>
              <span>
                <Award size={19} />
                <b>{tutor.yearsExperience} năm kinh nghiệm</b>
                <small>Lộ trình được điều chỉnh theo năng lực thực tế.</small>
              </span>
              <span>
                <UsersRound size={19} />
                <b>{tutor.studentCount} học sinh đã đồng hành</b>
                <small>Phản hồi ngắn sau mỗi buổi học cho phụ huynh.</small>
              </span>
            </div>
          </section>
        </div>

        <aside className={styles.bookingSidebar}>
          <section className={styles.bookingCard}>
            <div className={styles.bookingCardHead}>
              <span className={styles.eyebrow}>Bắt đầu lộ trình học thuật</span>
              <div>
                <strong>{formatPrice(getLowestRate(tutor))}</strong>
                <small>/ giờ học</small>
              </div>
              <em>Buổi học thử: {formatPrice(tutor.trialLessonPrice)}</em>
            </div>
            <div className={styles.bookingCardBody}>
              <span>Lịch dạy</span>
              {schedulePreview.map((item) => (
                <div key={item.day} className={styles.schedulePreviewRow}>
                  <strong>{item.day}</strong>
                  <small>{item.times.join(' · ')}</small>
                </div>
              ))}
            </div>
            <div className={styles.bookingCardFoot}>
              <button type="button" onClick={onBooking}>
                Đặt lịch ngay
              </button>
            </div>
          </section>
          <div className={styles.verificationNote}>
            <ShieldCheck size={18} />
            <div>
              <strong>Đã xác minh bởi TUTORA Council</strong>
              <span>Hoàn học phí nếu không hài lòng sau buổi học đầu tiên.</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

const ParentBookingDemo = () => {
  const navigate = useNavigate();
  const { tutorId } = useParams<{ tutorId: string }>();
  const selectedTutor = TUTORS.find((tutor) => tutor.id === tutorId);
  const [showBooking, setShowBooking] = useState(false);
  const [step, setStep] = useState<BookingStep>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');
  const [selectedComboId, setSelectedComboId] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<BookingSlot[]>([]);
  const [visibleWeekIndex, setVisibleWeekIndex] = useState(0);
  const [createdBookingId, setCreatedBookingId] = useState('');

  const firstWeekStart = useMemo(() => getNextMonday(), []);
  const today = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);
  const bookingDeadline = useMemo(() => getEndOfNextMonth(today), [today]);
  const selectedSubject = selectedTutor?.subjects.find((subject) => subject.id === selectedSubjectId);
  const selectedChild = CHILDREN.find((child) => child.id === selectedChildId);
  const selectedCombo = selectedTutor?.combos.find((combo) => combo.id === selectedComboId);
  const selectedBookingStart = selectedSlots.length ? fromDateKey(selectedSlots[0].date) : null;
  const selectedBookingValidityEnd = selectedBookingStart ? getBookingValidityEnd(selectedBookingStart) : null;
  const selectedScheduleWeeks = useMemo(() => {
    const grouped = sortSlots(selectedSlots).reduce<Record<string, BookingSlot[]>>((current, slot) => {
      const weekKey = toDateKey(getWeekStart(fromDateKey(slot.date)));
      current[weekKey] = [...(current[weekKey] ?? []), slot];
      return current;
    }, {});

    return Object.entries(grouped).map(([weekKey, slots]) => {
      const weekStart = fromDateKey(weekKey);
      return {
        weekKey,
        weekStart,
        weekEnd: addDays(weekStart, 6),
        slots,
      };
    });
  }, [selectedSlots]);
  const gradeMatches = Boolean(
    selectedSubject && selectedChild && selectedSubject.grades.includes(selectedChild.grade),
  );
  const expectedSessions = selectedCombo?.sessionsPerMonth ?? 0;
  const chosenHours = selectedSlots.reduce((sum, slot) => sum + slot.durationHours, 0);
  const subtotal = chosenHours * (selectedSubject?.hourlyRate ?? 0);
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;
  const visibleWeekStart = useMemo(
    () => addDays(firstWeekStart, visibleWeekIndex * 7),
    [firstWeekStart, visibleWeekIndex],
  );
  const visibleDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(visibleWeekStart, index)),
    [visibleWeekStart],
  );
  const maxVisibleWeekIndex = useMemo(
    () => Math.max(0, Math.floor((bookingDeadline.getTime() - firstWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000))),
    [bookingDeadline, firstWeekStart],
  );

  const resetBooking = () => {
    setStep(1);
    setSelectedSubjectId('');
    setSelectedChildId('');
    setSelectedComboId('');
    setSelectedSlots([]);
    setVisibleWeekIndex(0);
    setCreatedBookingId('');
  };

  const openBooking = () => {
    resetBooking();
    setShowBooking(true);
  };

  const closeBooking = () => {
    setShowBooking(false);
    resetBooking();
  };

  useEffect(() => {
    if (!showBooking) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showBooking]);

  const viewTutor = (nextTutorId: string) => {
    resetBooking();
    navigate(`/demo/parent-booking/tutor/${nextTutorId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToBrowse = () => {
    setShowBooking(false);
    resetBooking();
    navigate('/demo/parent-booking');
  };

  const selectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedChildId('');
    setSelectedComboId('');
    setSelectedSlots([]);
    setVisibleWeekIndex(0);
  };

  const selectChild = (childId: string) => {
    setSelectedChildId(childId);
    setSelectedComboId('');
    setSelectedSlots([]);
    setVisibleWeekIndex(0);
  };

  const selectCombo = (combo: TutorCombo) => {
    setSelectedComboId(combo.id);
    setVisibleWeekIndex(0);
    setSelectedSlots(combo.type === 'fixed' ? buildFixedSchedule(combo, firstWeekStart, bookingDeadline) : []);
  };

  const toggleFlexSlot = (slot: BookingSlot) => {
    if (selectedCombo?.type !== 'flex') return;

    const key = getSlotKey(slot);
    const exists = selectedSlots.some((selectedSlot) => getSlotKey(selectedSlot) === key);
    if (exists) {
      setSelectedSlots((current) => current.filter((selectedSlot) => getSlotKey(selectedSlot) !== key));
      return;
    }
    if (selectedSlots.length >= selectedCombo.sessionsPerMonth) return;
    const nextSlots = sortSlots([...selectedSlots, slot]);
    const validityEnd = getBookingValidityEnd(fromDateKey(nextSlots[0].date));
    if (
      nextSlots.some(
        (nextSlot) => fromDateKey(nextSlot.date) > validityEnd || fromDateKey(nextSlot.date) > bookingDeadline,
      )
    ) {
      return;
    }
    setSelectedSlots(nextSlots);
  };

  const canContinue = () => {
    if (step === 1) return Boolean(selectedSubject && selectedChild && gradeMatches);
    if (step === 2) return Boolean(selectedCombo);
    if (step === 3) return Boolean(selectedCombo && selectedSlots.length === expectedSessions);
    return true;
  };

  const goNext = () => {
    if (!canContinue() || step === 4) return;
    setStep((current) => (current + 1) as BookingStep);
  };

  const goBack = () => {
    if (step === 1) return;
    setStep((current) => (current - 1) as BookingStep);
  };

  const createBooking = () => {
    if (!canContinue()) return;
    setCreatedBookingId(`DEMO-${String(Date.now()).slice(-6)}`);
  };

  return (
    <div className={styles.page}>
      <Header />

      {selectedTutor ? (
        <TutorDetail tutor={selectedTutor} onBack={backToBrowse} onBooking={openBooking} />
      ) : (
        <TutorBrowse onViewTutor={viewTutor} />
      )}

      {showBooking && selectedTutor && (
        <div className={styles.modalBackdrop} onMouseDown={closeBooking}>
          <section
            className={styles.bookingModal}
            role="dialog"
            aria-modal="true"
            aria-label={`Đặt lịch học với ${selectedTutor.name}`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {createdBookingId ? (
              <div className={styles.modalSuccess}>
                <button type="button" className={styles.modalClose} onClick={closeBooking} aria-label="Đóng modal">
                  <X size={22} />
                </button>
                <span className={styles.successIcon}>
                  <CheckCircle2 size={42} />
                </span>
                <span className={styles.eyebrow}>Tạo booking thành công</span>
                <h2>Yêu cầu đặt lịch đã được gửi</h2>
                <p>Dữ liệu booking chỉ được lưu tạm trong state frontend để phục vụ demo.</p>
                <div className={styles.bookingCode}>
                  <span>Mã booking</span>
                  <strong>{createdBookingId}</strong>
                </div>
                {selectedBookingStart && selectedBookingValidityEnd && (
                  <div className={styles.successTerm}>
                    <CalendarRange size={16} />
                    <span>
                      Hiệu lực booking: {formatFullDate(selectedBookingStart)} -{' '}
                      {formatFullDate(selectedBookingValidityEnd)}
                    </span>
                  </div>
                )}
                <button type="button" className={styles.primaryButton} onClick={closeBooking}>
                  <RotateCcw size={16} />
                  Hoàn tất
                </button>
              </div>
            ) : (
              <>
                <header className={styles.modalHeader}>
                  <div>
                    <h2>Đặt lịch học</h2>
                    <p>
                      với <strong>{selectedTutor.name}</strong>
                    </p>
                  </div>
                  <button type="button" className={styles.modalClose} onClick={closeBooking} aria-label="Đóng modal">
                    <X size={22} />
                  </button>
                </header>

                <nav className={styles.modalStepper} aria-label="Tiến trình đặt lịch">
                  {STEPS.map((item, index) => (
                    <div
                      key={item.id}
                      className={`${styles.modalStep} ${step === item.id ? styles.modalStepActive : ''} ${
                        step > item.id ? styles.modalStepDone : ''
                      }`}
                    >
                      <span>{step > item.id ? <Check size={15} /> : item.id}</span>
                      <strong>{item.label}</strong>
                      {index < STEPS.length - 1 && <i />}
                    </div>
                  ))}
                </nav>

                <div className={styles.bookingPolicyBar}>
                  <CalendarRange size={17} />
                  <div>
                    <strong>Mỗi booking có hiệu lực 1 tháng.</strong>
                    <span>
                      Yêu cầu tạo ngày {formatFullDate(today)} chỉ được chọn lịch học đến hết{' '}
                      <b>{formatFullDate(bookingDeadline)}</b>.
                    </span>
                  </div>
                </div>

                <div className={styles.modalBody}>
                  {step === 1 && (
                    <>
                      <div className={styles.sectionHeading}>
                        <span className={styles.headingIcon}>
                          <GraduationCap size={20} />
                        </span>
                        <div>
                          <span className={styles.eyebrow}>Bước 01</span>
                          <h2>Chọn môn học và trẻ</h2>
                          <p>Hệ thống sẽ kiểm tra khối lớp ngay sau khi bạn chọn hồ sơ trẻ.</p>
                        </div>
                      </div>

                      <section className={styles.formSection}>
                        <h3>Môn học muốn đặt</h3>
                        <div className={styles.subjectGrid}>
                          {selectedTutor.subjects.map((subject) => (
                            <button
                              key={subject.id}
                              type="button"
                              className={`${styles.subjectCard} ${
                                selectedSubjectId === subject.id ? styles.selectedCard : ''
                              }`}
                              onClick={() => selectSubject(subject.id)}
                            >
                              <BookOpen size={18} />
                              <strong>{subject.name}</strong>
                              <span>{formatGradeRange(subject.grades)}</span>
                              <small>{formatPrice(subject.hourlyRate)} / giờ</small>
                            </button>
                          ))}
                        </div>
                      </section>

                      <section className={styles.formSection}>
                        <h3>Trẻ sẽ tham gia học</h3>
                        <div className={styles.childGrid}>
                          {CHILDREN.map((child) => (
                            <button
                              key={child.id}
                              type="button"
                              className={`${styles.childCard} ${
                                selectedChildId === child.id ? styles.selectedCard : ''
                              }`}
                              onClick={() => selectChild(child.id)}
                              disabled={!selectedSubject}
                            >
                              <span className={styles.childAvatar}>{child.initials}</span>
                              <span>
                                <strong>{child.name}</strong>
                                <small>
                                  Lớp {child.grade} · {child.school}
                                </small>
                              </span>
                            </button>
                          ))}
                        </div>
                        {!selectedSubject && <p className={styles.inlineHint}>Hãy chọn môn học trước khi chọn trẻ.</p>}
                      </section>

                      {selectedChild && selectedSubject && (
                        <section className={styles.childDetail}>
                          <div className={styles.childDetailHead}>
                            <div>
                              <span className={styles.childAvatarLarge}>{selectedChild.initials}</span>
                              <div>
                                <span className={styles.eyebrow}>Hồ sơ trẻ đã chọn</span>
                                <h3>{selectedChild.name}</h3>
                                <p>
                                  Lớp {selectedChild.grade} · {selectedChild.school}
                                </p>
                              </div>
                            </div>
                            <span className={gradeMatches ? styles.matchBadge : styles.mismatchBadge}>
                              {gradeMatches ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                              {gradeMatches ? 'Khối lớp phù hợp' : 'Khối lớp chưa phù hợp'}
                            </span>
                          </div>
                          <div className={styles.childDetailGrid}>
                            <div>
                              <span>Ngày sinh</span>
                              <strong>{selectedChild.dateOfBirth}</strong>
                            </div>
                            <div>
                              <span>Mục tiêu học tập</span>
                              <strong>{selectedChild.learningGoal}</strong>
                            </div>
                            <div>
                              <span>Lưu ý cho gia sư</span>
                              <strong>{selectedChild.note}</strong>
                            </div>
                          </div>
                        </section>
                      )}

                      {selectedChild && selectedSubject && !gradeMatches && (
                        <div className={styles.warningBox}>
                          <AlertTriangle size={19} />
                          <div>
                            <strong>Không thể tiếp tục với lựa chọn này</strong>
                            <p>
                              {selectedTutor.name} nhận dạy {selectedSubject.name} cho{' '}
                              {formatGradeRange(selectedSubject.grades)}, trong khi {selectedChild.name} đang học lớp{' '}
                              {selectedChild.grade}.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className={styles.sectionHeading}>
                        <span className={styles.headingIcon}>
                          <Zap size={20} />
                        </span>
                        <div>
                          <span className={styles.eyebrow}>Bước 02</span>
                          <h2>Chọn hình thức học</h2>
                          <p>Chọn combo cố định hoặc combo linh hoạt theo lịch gia đình.</p>
                        </div>
                      </div>

                      <div className={styles.comboGrid}>
                        {selectedTutor.combos.map((combo) => {
                          const isSelected = combo.id === selectedComboId;
                          return (
                            <button
                              key={combo.id}
                              type="button"
                              className={`${styles.comboCard} ${isSelected ? styles.selectedCard : ''}`}
                              onClick={() => selectCombo(combo)}
                            >
                              <span className={`${styles.comboIcon} ${combo.type === 'flex' ? styles.flexIcon : ''}`}>
                                {combo.type === 'fixed' ? <CalendarDays size={18} /> : <Zap size={18} />}
                              </span>
                              <span className={styles.comboType}>
                                {combo.type === 'fixed' ? 'Combo cố định' : 'Combo linh hoạt'}
                              </span>
                              <h3>{combo.name}</h3>
                              <p>{combo.description}</p>
                              <div className={styles.comboMeta}>
                                <span>
                                  <BookOpen size={14} />
                                  {combo.sessionsPerMonth} buổi / tháng
                                </span>
                                <span>
                                  <Clock3 size={14} />
                                  {combo.type === 'fixed'
                                    ? `${combo.sessions[0]?.durationHours ?? 0} giờ / buổi`
                                    : `${combo.hoursPerSession} giờ / buổi`}
                                </span>
                              </div>
                              <small>{isSelected ? 'Đã chọn' : 'Chọn combo'}</small>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {step === 3 && selectedCombo && (
                    <>
                      <div className={styles.sectionHeading}>
                        <span className={styles.headingIcon}>
                          <CalendarDays size={20} />
                        </span>
                        <div>
                          <span className={styles.eyebrow}>Bước 03</span>
                          <h2>Chọn lịch học</h2>
                          <p>
                            {selectedCombo.type === 'fixed'
                              ? 'Lịch cố định đã được tự động điền theo combo.'
                              : `Đã chọn ${selectedSlots.length}/${selectedCombo.sessionsPerMonth} buổi từ lịch trống.`}
                          </p>
                        </div>
                      </div>

                      <section className={styles.calendarSection}>
                        <div className={styles.calendarHeading}>
                          <div>
                            <span className={styles.eyebrow}>Lịch trống của gia sư</span>
                            <h3>{selectedCombo.name}</h3>
                            <p className={styles.calendarLimit}>
                              {selectedBookingStart && selectedBookingValidityEnd
                                ? `Hiệu lực dự kiến: ${formatFullDate(selectedBookingStart)} - ${formatFullDate(selectedBookingValidityEnd)}`
                                : 'Hiệu lực một tháng sẽ được tính từ buổi học đầu tiên bạn chọn.'}
                            </p>
                          </div>
                          <div className={styles.calendarControls}>
                            <button
                              type="button"
                              onClick={() => setVisibleWeekIndex((current) => Math.max(0, current - 1))}
                              disabled={visibleWeekIndex === 0}
                              aria-label="Tuần trước"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <strong>
                              {formatShortDate(visibleDays[0])} - {formatShortDate(visibleDays[6])}
                            </strong>
                            <button
                              type="button"
                              onClick={() =>
                                setVisibleWeekIndex((current) => Math.min(maxVisibleWeekIndex, current + 1))
                              }
                              disabled={visibleWeekIndex === maxVisibleWeekIndex}
                              aria-label="Tuần sau"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </div>

                        <div className={styles.legend}>
                          <span>
                            <i className={styles.availableDot} />
                            Lịch trống
                          </span>
                          <span>
                            <i className={styles.selectedDot} />
                            Đã chọn
                          </span>
                          <span>
                            <i className={styles.unavailableDot} />
                            Không mở lịch
                          </span>
                        </div>

                        <div className={styles.calendarScroller}>
                          <div className={styles.calendarGrid}>
                            <div className={`${styles.calendarCell} ${styles.timeHead}`}>Giờ học</div>
                            {visibleDays.map((date, index) => (
                              <div
                                key={toDateKey(date)}
                                className={`${styles.calendarCell} ${styles.dayHead} ${
                                  date > bookingDeadline ? styles.dayOutsideWindow : ''
                                }`}
                              >
                                <strong>{DAY_NAMES[index]}</strong>
                                <span>{formatShortDate(date)}</span>
                              </div>
                            ))}

                            {CALENDAR_TIMES.map((time) => (
                              <div className={styles.calendarRow} key={time}>
                                <div className={`${styles.calendarCell} ${styles.timeCell}`}>{time}</div>
                                {visibleDays.map((date, dayIndex) => {
                                  const availability = selectedTutor.availability.find(
                                    (slot) => slot.dayOfWeek === dayIndex + 1 && slot.startTime === time,
                                  );
                                  const dateKey = toDateKey(date);
                                  const bookingSlot: BookingSlot | null = availability
                                    ? { ...availability, date: dateKey }
                                    : null;
                                  const isSelected = Boolean(
                                    bookingSlot &&
                                    selectedSlots.some(
                                      (selectedSlot) => getSlotKey(selectedSlot) === getSlotKey(bookingSlot),
                                    ),
                                  );
                                  const candidateSlots =
                                    bookingSlot && !isSelected
                                      ? sortSlots([...selectedSlots, bookingSlot])
                                      : selectedSlots;
                                  const candidateValidityEnd = candidateSlots.length
                                    ? getBookingValidityEnd(fromDateKey(candidateSlots[0].date))
                                    : null;
                                  const isInsideBookingWindow = Boolean(
                                    bookingSlot &&
                                    date <= bookingDeadline &&
                                    (!candidateValidityEnd ||
                                      candidateSlots.every((slot) => fromDateKey(slot.date) <= candidateValidityEnd)),
                                  );
                                  const isAvailable = Boolean(
                                    bookingSlot && availability?.available !== false && isInsideBookingWindow,
                                  );

                                  return (
                                    <div
                                      key={`${dateKey}-${time}`}
                                      className={`${styles.calendarCell} ${styles.slotCell}`}
                                    >
                                      <button
                                        type="button"
                                        className={`${styles.slotButton} ${
                                          isSelected
                                            ? styles.slotSelected
                                            : isAvailable
                                              ? styles.slotAvailable
                                              : styles.slotUnavailable
                                        }`}
                                        disabled={!isAvailable || selectedCombo.type === 'fixed'}
                                        onClick={() => bookingSlot && toggleFlexSlot(bookingSlot)}
                                        aria-label={`${formatDate(dateKey)} lúc ${time}`}
                                      >
                                        {isSelected ? (
                                          <>
                                            <Check size={13} />
                                            Đã chọn
                                          </>
                                        ) : isAvailable ? (
                                          '+ Chọn'
                                        ) : (
                                          '—'
                                        )}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>

                        {selectedCombo.type === 'flex' && selectedSlots.length < selectedCombo.sessionsPerMonth && (
                          <div className={styles.calendarTip}>
                            <Zap size={16} />
                            Còn {selectedCombo.sessionsPerMonth - selectedSlots.length} buổi cần chọn.
                          </div>
                        )}
                      </section>
                    </>
                  )}

                  {step === 4 && selectedSubject && selectedChild && selectedCombo && (
                    <>
                      <div className={styles.sectionHeading}>
                        <span className={styles.headingIcon}>
                          <CheckCircle2 size={20} />
                        </span>
                        <div>
                          <span className={styles.eyebrow}>Bước 04</span>
                          <h2>Xác nhận yêu cầu booking</h2>
                          <p>Kiểm tra thông tin trước khi gửi yêu cầu đến gia sư.</p>
                        </div>
                      </div>

                      <div className={styles.confirmLayout}>
                        <div>
                          <section className={styles.reviewGrid}>
                            <div>
                              <UserRound size={17} />
                              <span>Gia sư</span>
                              <strong>{selectedTutor.name}</strong>
                            </div>
                            <div>
                              <GraduationCap size={17} />
                              <span>Học sinh & môn</span>
                              <strong>
                                {selectedChild.name} · {selectedSubject.name}
                              </strong>
                            </div>
                            <div>
                              <CalendarDays size={17} />
                              <span>Combo</span>
                              <strong>{selectedCombo.name}</strong>
                            </div>
                          </section>
                          <section className={styles.scheduleReview}>
                            <div className={styles.scheduleReviewHead}>
                              <div>
                                <span className={styles.eyebrow}>Lịch học đã chọn</span>
                                <strong>Lịch học theo tuần</strong>
                              </div>
                              <small>
                                {selectedSlots.length} buổi · {selectedScheduleWeeks.length} tuần
                              </small>
                            </div>
                            <div className={styles.weekScheduleGrid}>
                              {selectedScheduleWeeks.map((week, weekIndex) => (
                                <article key={week.weekKey} className={styles.weekScheduleCard}>
                                  <header>
                                    <span>Tuần {String(weekIndex + 1).padStart(2, '0')}</span>
                                    <div>
                                      <strong>
                                        {formatShortDate(week.weekStart)} - {formatShortDate(week.weekEnd)}
                                      </strong>
                                      <small>{week.slots.length} buổi học</small>
                                    </div>
                                  </header>
                                  <div className={styles.weekLessonList}>
                                    {week.slots.map((slot) => {
                                      const slotDate = fromDateKey(slot.date);
                                      return (
                                        <div key={getSlotKey(slot)} className={styles.weekLesson}>
                                          <CalendarDays size={14} />
                                          <span>
                                            <strong>{formatWeekday(slotDate)}</strong>
                                            <small>{formatShortDate(slotDate)}</small>
                                          </span>
                                          <b>{slot.startTime}</b>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </article>
                              ))}
                            </div>
                          </section>
                          <section className={styles.bookingTermSummary}>
                            <CalendarRange size={17} />
                            <div>
                              <span>Hiệu lực booking</span>
                              <strong>
                                {selectedBookingStart && selectedBookingValidityEnd
                                  ? `${formatFullDate(selectedBookingStart)} - ${formatFullDate(selectedBookingValidityEnd)}`
                                  : '1 tháng kể từ buổi học đầu tiên'}
                              </strong>
                              <small>Không thể đặt buổi học sau ngày {formatFullDate(bookingDeadline)}.</small>
                            </div>
                          </section>
                        </div>

                        <aside className={styles.priceSummary}>
                          <span className={styles.eyebrow}>Tóm tắt học phí</span>
                          <div>
                            <span>Học phí</span>
                            <strong>{formatPrice(subtotal)}</strong>
                          </div>
                          <div>
                            <span>Phí dịch vụ (5%)</span>
                            <strong>{formatPrice(serviceFee)}</strong>
                          </div>
                          <div>
                            <span>Tổng cộng</span>
                            <strong>{formatPrice(total)}</strong>
                          </div>
                        </aside>
                      </div>

                      <div className={styles.noticeBox}>
                        <ShieldCheck size={18} />
                        Dữ liệu chỉ được tạo trong state frontend và không gửi lên server.
                      </div>
                    </>
                  )}
                </div>

                <footer className={styles.modalFooter}>
                  <button type="button" className={styles.secondaryButton} onClick={goBack} disabled={step === 1}>
                    <ArrowLeft size={16} />
                    Quay lại
                  </button>
                  {step < 4 ? (
                    <button type="button" className={styles.primaryButton} onClick={goNext} disabled={!canContinue()}>
                      Tiếp theo
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button type="button" className={styles.primaryButton} onClick={createBooking}>
                      Gửi yêu cầu booking
                      <ArrowRight size={16} />
                    </button>
                  )}
                </footer>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default ParentBookingDemo;
