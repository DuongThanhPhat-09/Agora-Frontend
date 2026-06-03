// Shared combo model dùng cho cả tutor onboarding và parent booking.
// Trong onboarding, combo lưu local; trong booking, combo đến từ tutor profile
// (hiện đang mock — xem TODO(BE) trong TutorDetailPage).

export interface ComboSessionSlot {
  dayOfWeek: number;
  startHour: number;
  startMinute: 0 | 30;
  durationHours: number; // bội của 0.5
}

interface BaseCombo {
  id: string;
  name: string;
  // Optional: combo có thể gắn với 1 môn cụ thể (vd combo Toán riêng, Tiếng Anh riêng).
  // Khi undefined → combo áp dụng cho mọi môn tutor dạy.
  subjectId?: number;
  subjectName?: string;
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
