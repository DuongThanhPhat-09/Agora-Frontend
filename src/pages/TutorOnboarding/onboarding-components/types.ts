// Models for the tutor onboarding flow.
// Luồng 3 bước: setup môn-khối-giá → lịch rảnh → tạo combo.

export type OnboardingStep = 1 | 2 | 3;

// B1: 1 record = (môn, khối lớp, giá). Tutor có thể thêm nhiều record;
// vd Toán-L10-200k, Toán-L11-250k, Tiếng Anh-L12-300k.
export interface SubjectRecord {
  id: string; // local id (uuid-ish)
  subjectId: number; // từ SUBJECTS catalog
  subjectName: string;
  gradeLevel: string; // 'grade_10' v.v.
  hourlyRate: number; // VND/giờ
}

// B2: Lịch rảnh demo lưu trong state onboarding, theo từng ô một giờ.
export interface TutorAvailabilitySlot {
  id: string;
  dayOfWeek: number; // Backend format: 0=CN..6=T7
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

// B3: Combo — khung lịch dùng chung, phụ huynh chọn môn lúc booking.
export interface ComboSessionSlot {
  dayOfWeek: number;
  startHour: number;
  durationHours: number; // 1..4
}

interface BaseCombo {
  id: string;
  name: string;
}

export interface FixedCombo extends BaseCombo {
  type: 'fixed';
  sessions: ComboSessionSlot[];
}

export interface FlexCombo extends BaseCombo {
  type: 'flex';
  sessionsPerWeek: number;
  sessionsPerMonth: number;
  hoursPerSession: number;
  description: string;
}

export type Combo = FixedCombo | FlexCombo;

export interface OnboardingState {
  subjectRecords: SubjectRecord[];
  availability: TutorAvailabilitySlot[];
  combos: Combo[];
  currentStep: OnboardingStep;
}
