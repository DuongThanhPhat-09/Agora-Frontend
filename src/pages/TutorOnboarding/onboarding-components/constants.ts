// Danh sách môn (trước nằm inline trong ProfileHeroModal). Dùng chung cho B1.
export const SUBJECTS = [
  { id: 1, name: 'Toán' },
  { id: 2, name: 'Tiếng Anh' },
  { id: 3, name: 'Vật Lý' },
  { id: 4, name: 'Hóa Học' },
  { id: 5, name: 'Ngữ Văn' },
  { id: 6, name: 'Sinh Học' },
  { id: 7, name: 'Lịch Sử' },
  { id: 8, name: 'Địa Lý' },
  { id: 9, name: 'Tin Học' },
  { id: 10, name: 'IELTS' },
];

// Khối lớp — dùng ở B1 để gán mỗi record (môn × khối × giá).
export const GRADE_LEVELS = [
  { value: 'grade_1', label: 'Lớp 1' },
  { value: 'grade_2', label: 'Lớp 2' },
  { value: 'grade_3', label: 'Lớp 3' },
  { value: 'grade_4', label: 'Lớp 4' },
  { value: 'grade_5', label: 'Lớp 5' },
  { value: 'grade_6', label: 'Lớp 6' },
  { value: 'grade_7', label: 'Lớp 7' },
  { value: 'grade_8', label: 'Lớp 8' },
  { value: 'grade_9', label: 'Lớp 9' },
  { value: 'grade_10', label: 'Lớp 10' },
  { value: 'grade_11', label: 'Lớp 11' },
  { value: 'grade_12', label: 'Lớp 12' },
];

// Cột ngày trong lưới. dayOfWeek theo format BE (0=CN..6=T7), hiển thị T2 trước.
export const DAY_COLUMNS = [
  { dayOfWeek: 1, label: 'T2', full: 'Thứ 2' },
  { dayOfWeek: 2, label: 'T3', full: 'Thứ 3' },
  { dayOfWeek: 3, label: 'T4', full: 'Thứ 4' },
  { dayOfWeek: 4, label: 'T5', full: 'Thứ 5' },
  { dayOfWeek: 5, label: 'T6', full: 'Thứ 6' },
  { dayOfWeek: 6, label: 'T7', full: 'Thứ 7' },
  { dayOfWeek: 0, label: 'CN', full: 'Chủ Nhật' },
];

// Khung giờ lưới: 06:00 → 22:00 (giống ảnh PickleBOO). Block bắt đầu ở 6..21.
export const START_HOUR = 6;
export const END_HOUR = 22;
export const HOURS: number[] = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

const pad = (n: number) => n.toString().padStart(2, '0');

export const formatHourBlock = (hour: number) => `${pad(hour)}:00 - ${pad(hour + 1)}:00`;

export const formatHour = (hour: number) => `${pad(hour)}:00`;

export const formatPrice = (value: number) => new Intl.NumberFormat('vi-VN').format(value);
