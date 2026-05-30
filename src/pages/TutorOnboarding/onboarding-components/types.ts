// Frontend-only models for the tutor onboarding flow.
// Luồng 4 bước (gộp về /tutor-portal/onboarding cho tiện demo, tách lại khi đụng URL thật):
//   B1 Chọn môn → B2 Giá/giờ + nhận booking (tương đương /profile)
//   → B3 Lịch rảnh (tương đương /schedule) → B4 Tạo combo.

export type OnboardingStep = 1 | 2 | 3 | 4;

// 1 khung giờ rảnh của tutor (chung cho mọi môn). Bước 1 giờ.
export interface AvailabilitySlot {
    id: string; // `${dayOfWeek}-${startHour}`
    dayOfWeek: number; // 0=CN..6=T7
    startHour: number; // 6..21
}

export interface OnboardingSubject {
    subjectId: number;
    subjectName: string;
    hourlyRate: number | null; // giá nền VND/giờ (B2)
}

// ── Combo học ─────────────────────────────────────────────────────────────
// Cố định: tutor chọn N buổi/tuần với (thứ, giờ bắt đầu, thời lượng) — pick
// từ lịch rảnh ở B3 để đảm bảo nhất quán.
export interface ComboSessionSlot {
    dayOfWeek: number;
    startHour: number;
    durationHours: number; // 1..4
}

// Combo là KHUNG lịch/cấu trúc gói — không gắn môn cụ thể. Khi đặt lịch,
// phụ huynh chọn 1 môn trong các môn tutor dạy; giá được tính tại thời điểm
// đó theo công thức (giá/giờ của môn × tổng giờ trong combo).
interface BaseCombo {
    id: string;
    name: string;
}

export interface FixedCombo extends BaseCombo {
    type: 'fixed';
    sessions: ComboSessionSlot[];
}

// Linh hoạt: tutor mô tả gói, phụ huynh sẽ tự pick lịch dựa số buổi/tuần.
export interface FlexCombo extends BaseCombo {
    type: 'flex';
    sessionsPerWeek: number;
    sessionsPerMonth: number;
    hoursPerSession: number;
    description: string;
}

export type Combo = FixedCombo | FlexCombo;

export interface OnboardingState {
    subjects: OnboardingSubject[];
    availability: AvailabilitySlot[]; // 1 lịch chung cho tutor
    combos: Combo[];
    currentStep: OnboardingStep;
}
