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
  MousePointerClick,
  PackageCheck,
  Play,
  Repeat2,
  RotateCcw,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  UsersRound,
  X,
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
type BookingMode = 'availability' | 'package';

const STEPS: { id: BookingStep; label: string }[] = [
  { id: 1, label: 'Học sinh & môn' },
  { id: 2, label: 'Cách đặt' },
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

const formatPackageName = (name: string) => name.replace(/^Combo\b/i, 'Gói');

const formatPackageType = (type: TutorCombo['type']) => (type === 'fixed' ? 'Gói cố định' : 'Gói linh hoạt');

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
  const [selectedBookingMode, setSelectedBookingMode] = useState<BookingMode | ''>('');
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
  const isAvailabilityMode = selectedBookingMode === 'availability';
  const isPackageMode = selectedBookingMode === 'package';
  const isFixedPackage = isPackageMode && selectedCombo?.type === 'fixed';
  const isFlexPackage = isPackageMode && selectedCombo?.type === 'flex';
  const scheduleChoiceLabel = isAvailabilityMode
    ? 'Tự chọn lịch rảnh'
    : selectedCombo
      ? formatPackageName(selectedCombo.name)
      : 'Gói dịch vụ';
  const selectedBookingStart = selectedSlots.length ? fromDateKey(selectedSlots[0].date) : null;
  const selectedBookingValidityEnd = selectedBookingStart ? getBookingValidityEnd(selectedBookingStart) : null;
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
    setSelectedBookingMode('');
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
    setSelectedBookingMode('');
    setSelectedComboId('');
    setSelectedSlots([]);
    setVisibleWeekIndex(0);
  };

  const selectChild = (childId: string) => {
    setSelectedChildId(childId);
    setSelectedBookingMode('');
    setSelectedComboId('');
    setSelectedSlots([]);
    setVisibleWeekIndex(0);
  };

  const selectBookingMode = (mode: BookingMode) => {
    setSelectedBookingMode(mode);
    setSelectedComboId('');
    setSelectedSlots([]);
    setVisibleWeekIndex(0);
  };

  const selectCombo = (combo: TutorCombo) => {
    setSelectedBookingMode('package');
    setSelectedComboId(combo.id);
    setVisibleWeekIndex(0);
    setSelectedSlots(combo.type === 'fixed' ? buildFixedSchedule(combo, firstWeekStart, bookingDeadline) : []);
  };

  const toggleScheduleSlot = (slot: BookingSlot) => {
    if (!isAvailabilityMode && !isFlexPackage) return;

    const key = getSlotKey(slot);
    const exists = selectedSlots.some((selectedSlot) => getSlotKey(selectedSlot) === key);
    if (exists) {
      setSelectedSlots((current) => current.filter((selectedSlot) => getSlotKey(selectedSlot) !== key));
      return;
    }
    if (isFlexPackage && selectedCombo && selectedSlots.length >= selectedCombo.sessionsPerMonth) return;
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
    if (step === 2) return isAvailabilityMode || Boolean(isPackageMode && selectedCombo);
    if (step === 3) {
      if (isAvailabilityMode) return selectedSlots.length > 0;
      return Boolean(selectedCombo && selectedSlots.length === expectedSessions);
    }
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
                <span className={styles.eyebrow}>Gửi yêu cầu thành công</span>
                <h2>Yêu cầu đặt lịch đã được gửi</h2>
                <p>Gia sư sẽ xem lịch học và phản hồi cho phụ huynh trong thời gian sớm nhất.</p>
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

                      {selectedChild && selectedSubject && !gradeMatches && (
                        <div className={styles.warningBox}>
                          <AlertTriangle size={19} />
                          <div>
                            <strong>Khối lớp chưa phù hợp</strong>
                            <p>Hãy đổi học sinh hoặc chọn môn khác để tiếp tục.</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className={styles.sectionHeading}>
                        <span className={styles.headingIcon}>
                          <Route size={20} />
                        </span>
                        <div>
                          <span className={styles.eyebrow}>Bước 02</span>
                          <h2>Chọn cách đặt lịch</h2>
                        </div>
                      </div>

                      <div className={styles.bookingModeGrid}>
                        <button
                          type="button"
                          className={`${styles.bookingModeCard} ${isAvailabilityMode ? styles.selectedCard : ''}`}
                          onClick={() => selectBookingMode('availability')}
                        >
                          <span className={`${styles.bookingModeIcon} ${styles.availabilityModeIcon}`}>
                            <MousePointerClick size={20} />
                          </span>
                          <span className={styles.comboType}>Theo lịch rảnh</span>
                          <h3>Tự chọn lịch rảnh</h3>
                          <p>Phụ huynh chọn trực tiếp các khung giờ còn trống của gia sư.</p>
                          <small>{isAvailabilityMode ? 'Đã chọn' : 'Chọn cách này'}</small>
                        </button>

                        <button
                          type="button"
                          className={`${styles.bookingModeCard} ${isPackageMode ? styles.selectedCard : ''}`}
                          onClick={() => selectBookingMode('package')}
                        >
                          <span className={`${styles.bookingModeIcon} ${styles.packageModeIcon}`}>
                            <PackageCheck size={20} />
                          </span>
                          <span className={styles.comboType}>Theo gói dịch vụ</span>
                          <h3>Chọn gói dịch vụ</h3>
                          <p>Chọn gói cố định hoặc gói linh hoạt theo nhịp học của gia đình.</p>
                          <small>{isPackageMode ? 'Đang chọn gói' : 'Xem các gói'}</small>
                        </button>
                      </div>

                      {isPackageMode && (
                        <section className={styles.packagePanel}>
                          <div className={styles.packagePanelHead}>
                            <span className={styles.eyebrow}>Gói dịch vụ</span>
                            <h3>Chọn gói học phù hợp</h3>
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
                                  <span
                                    className={`${styles.comboIcon} ${
                                      combo.type === 'fixed' ? styles.fixedPackageIcon : styles.flexPackageIcon
                                    }`}
                                  >
                                    {combo.type === 'fixed' ? <Repeat2 size={18} /> : <SlidersHorizontal size={18} />}
                                  </span>
                                  <span className={styles.comboType}>{formatPackageType(combo.type)}</span>
                                  <h3>{formatPackageName(combo.name)}</h3>
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
                                  <small>{isSelected ? 'Đã chọn' : 'Chọn gói'}</small>
                                </button>
                              );
                            })}
                          </div>
                        </section>
                      )}
                    </>
                  )}

                  {step === 3 && (isAvailabilityMode || selectedCombo) && (
                    <>
                      <div className={styles.sectionHeading}>
                        <span className={styles.headingIcon}>
                          <CalendarDays size={20} />
                        </span>
                        <div>
                          <span className={styles.eyebrow}>Bước 03</span>
                          <h2>Chọn lịch học</h2>
                          <p>
                            {isAvailabilityMode
                              ? `Đã chọn ${selectedSlots.length} buổi từ lịch rảnh.`
                              : isFixedPackage
                                ? 'Lịch học đã được tự động điền theo gói cố định.'
                                : `Đã chọn ${selectedSlots.length}/${selectedCombo?.sessionsPerMonth ?? 0} buổi từ lịch rảnh.`}
                          </p>
                        </div>
                      </div>

                      <section className={styles.calendarSection}>
                        <div className={styles.calendarHeading}>
                          <div>
                            <span className={styles.eyebrow}>Lịch rảnh của gia sư</span>
                            <h3>{scheduleChoiceLabel}</h3>
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
                                        disabled={!isAvailable || isFixedPackage}
                                        onClick={() => bookingSlot && toggleScheduleSlot(bookingSlot)}
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

                      </section>
                    </>
                  )}

                  {step === 4 && selectedSubject && selectedChild && (isAvailabilityMode || selectedCombo) && (
                    <>
                      <div className={styles.sectionHeading}>
                        <span className={styles.headingIcon}>
                          <CheckCircle2 size={20} />
                        </span>
                        <div>
                          <span className={styles.eyebrow}>Bước 04</span>
                          <h2>Xác nhận đặt lịch</h2>
                          <p>Xem lại lịch học và học phí trước khi gửi yêu cầu.</p>
                        </div>
                      </div>

                      <div className={styles.confirmLayout}>
                        <div className={styles.confirmMain}>
                          <section className={styles.reviewHero}>
                            <span className={styles.reviewHeroAvatar}>{selectedTutor.initials}</span>
                            <div>
                              <span className={styles.eyebrow}>Sẵn sàng gửi yêu cầu</span>
                              <h3>
                                {selectedSubject.name} với {selectedTutor.name}
                              </h3>
                              <p>
                                {selectedChild.name} · {scheduleChoiceLabel}
                              </p>
                            </div>
                          </section>

                          <section className={styles.scheduleReview}>
                            <div className={styles.scheduleReviewHead}>
                              <div>
                                <span className={styles.eyebrow}>Lịch học đã chọn</span>
                                <strong>{selectedSlots.length} buổi học</strong>
                              </div>
                              <small>{chosenHours} giờ</small>
                            </div>
                            <div className={styles.lessonReviewList}>
                              {sortSlots(selectedSlots).map((slot) => {
                                const slotDate = fromDateKey(slot.date);
                                return (
                                  <div key={getSlotKey(slot)} className={styles.lessonReviewRow}>
                                    <CalendarDays size={14} />
                                    <span>
                                      <strong>
                                        {formatWeekday(slotDate)}, {formatShortDate(slotDate)}
                                      </strong>
                                      <small>{slot.durationHours} giờ</small>
                                    </span>
                                    <b>{slot.startTime}</b>
                                  </div>
                                );
                              })}
                            </div>
                          </section>
                        </div>

                        <aside className={styles.priceSummary}>
                          <span className={styles.eyebrow}>Học phí dự kiến</span>
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
                          <small className={styles.priceSummaryNote}>Gia sư xác nhận lịch trước khi thanh toán.</small>
                        </aside>
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
                      Gửi yêu cầu
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
