/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// MOCK DATA — dùng khi VITE_USE_MOCK=true
// Không kết nối BE thật; tất cả dữ liệu là giả lập cho demo.
// ============================================================

// ── Helper: tạo mock JWT với claim format giống BE ──────────
function b64url(obj: unknown): string {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function createMockJwt(role: string, userId: string, email: string, name: string): string {
  const header = b64url({ alg: 'HS256', typ: 'JWT' });
  const payload = b64url({
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': userId,
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': email,
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': name,
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': role,
    iat: Math.floor(Date.now() / 1000),
    exp: 9999999999,
  });
  return `${header}.${payload}.mock_sig`;
}

// ── Mock users (4 vai trò) ───────────────────────────────────
export const MOCK_USERS = {
  Parent: {
    userId: 'mock-parent-001',
    email: 'parent@demo.vn',
    name: 'Nguyen Thi Huong',
    role: 'Parent',
    get token() { return createMockJwt('Parent', this.userId, this.email, this.name); },
  },
  Student: {
    userId: 'mock-student-001',
    email: 'student@demo.vn',
    name: 'Le Minh Khoa',
    role: 'Student',
    get token() { return createMockJwt('Student', this.userId, this.email, this.name); },
  },
  Tutor: {
    userId: 'mock-tutor-002',
    email: 'tutor@demo.vn',
    name: 'Tran Thi Binh',
    role: 'Tutor',
    get token() { return createMockJwt('Tutor', this.userId, this.email, this.name); },
  },
  Admin: {
    userId: 'mock-admin-001',
    email: 'admin@demo.vn',
    name: 'Admin Tutora',
    role: 'Admin',
    get token() { return createMockJwt('Admin', this.userId, this.email, this.name); },
  },
};

// ── Demo credentials map ─────────────────────────────────────
export const DEMO_CREDENTIALS: Record<string, typeof MOCK_USERS.Parent> = {
  'parent@demo.vn': MOCK_USERS.Parent,
  'student@demo.vn': MOCK_USERS.Student,
  'tutor@demo.vn': MOCK_USERS.Tutor,
  'admin@demo.vn': MOCK_USERS.Admin,
};

// ── Tutor search data ────────────────────────────────────────
export const MOCK_TUTORS = [
  {
    tutorId: 'mock-tutor-001',
    fullName: 'Nguyen Van An',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    headline: 'Gia su Toan - Vat ly 10 nam kinh nghiem',
    education: 'DH Bach Khoa Ha Noi',
    degreeLevel: 'Dai hoc',
    averageRating: 4.8,
    totalReviews: 124,
    yearsOfExperience: 10,
    completedHours: 520,
    subjects: [
      { subjectId: 1, subjectName: 'Toan', gradeLevels: ['Lop 10', 'Lop 11', 'Lop 12'], tags: ['Dai so', 'Giai tich'] },
      { subjectId: 2, subjectName: 'Vat ly', gradeLevels: ['Lop 10', 'Lop 11'], tags: ['Co hoc', 'Dien'] },
    ],
    hourlyRate: 200000,
    trialLessonPrice: 100000,
    allowPriceNegotiation: true,
    teachingAreaCity: 'Ha Noi',
    teachingAreaDistrict: 'Cau Giay',
    teachingMode: 'both',
    subscriptionType: 'premium',
    subscriptionTypeLabel: 'Premium',
    verificationStatus: 'verified',
    certifications: [{ certificateName: 'Bang DH Loai Gioi', issuingOrganization: 'DH Bach Khoa', yearIssued: 2014 }],
    successRate: '95%',
    highlights: ['IELTS 7.0', 'Top 1% gia su Toan'],
    specialty: 'Luyen thi DH',
  },
  {
    tutorId: 'mock-tutor-002',
    fullName: 'Tran Thi Binh',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    headline: 'Giao vien Tieng Anh - Chuyen gia IELTS & TOEIC',
    education: 'DH Ngoai Ngu Ha Noi',
    degreeLevel: 'Thac si',
    averageRating: 4.9,
    totalReviews: 89,
    yearsOfExperience: 7,
    completedHours: 340,
    subjects: [
      { subjectId: 3, subjectName: 'Tieng Anh', gradeLevels: ['Lop 6', 'Lop 7', 'Lop 8', 'Lop 9', 'Lop 10', 'Lop 11', 'Lop 12'], tags: ['IELTS', 'TOEIC', 'Giao tiep'] },
    ],
    hourlyRate: 250000,
    trialLessonPrice: 0,
    allowPriceNegotiation: false,
    teachingAreaCity: 'TP.HCM',
    teachingAreaDistrict: 'Quan 3',
    teachingMode: 'online',
    subscriptionType: 'premium',
    subscriptionTypeLabel: 'Premium',
    verificationStatus: 'verified',
    certifications: [{ certificateName: 'IELTS 8.5', issuingOrganization: 'British Council', yearIssued: 2019 }],
    successRate: '98%',
    highlights: ['IELTS 8.5', 'Thac si ngon ngu hoc'],
    specialty: 'IELTS & TOEIC',
  },
  {
    tutorId: 'mock-tutor-003',
    fullName: 'Le Hong Cuong',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    headline: 'Gia su Hoa hoc - Luyen thi DH Y Duoc',
    education: 'DH Y Ha Noi',
    degreeLevel: 'Bac si',
    averageRating: 4.7,
    totalReviews: 56,
    yearsOfExperience: 5,
    completedHours: 210,
    subjects: [
      { subjectId: 4, subjectName: 'Hoa hoc', gradeLevels: ['Lop 10', 'Lop 11', 'Lop 12'], tags: ['Hoa vo co', 'Hoa huu co'] },
      { subjectId: 2, subjectName: 'Sinh hoc', gradeLevels: ['Lop 10', 'Lop 11', 'Lop 12'], tags: ['Di truyen', 'Sinh thai'] },
    ],
    hourlyRate: 180000,
    trialLessonPrice: 90000,
    allowPriceNegotiation: true,
    teachingAreaCity: 'TP.HCM',
    teachingAreaDistrict: 'Binh Thanh',
    teachingMode: 'offline',
    subscriptionType: 'basic',
    subscriptionTypeLabel: 'Basic',
    verificationStatus: 'verified',
    certifications: [],
    successRate: '90%',
    highlights: ['5 nam kinh nghiem luyen thi Y Duoc'],
    specialty: 'Luyen thi khoi B',
  },
  {
    tutorId: 'mock-tutor-004',
    fullName: 'Pham Thi Dung',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    headline: 'Giao vien Ngu van - Chuyen luyen viet van',
    education: 'DH Su Pham Ha Noi',
    degreeLevel: 'Dai hoc',
    averageRating: 4.6,
    totalReviews: 42,
    yearsOfExperience: 8,
    completedHours: 300,
    subjects: [
      { subjectId: 5, subjectName: 'Ngu van', gradeLevels: ['Lop 8', 'Lop 9', 'Lop 10', 'Lop 11', 'Lop 12'], tags: ['Lam van', 'Doc hieu', 'THPT QG'] },
    ],
    hourlyRate: 150000,
    trialLessonPrice: 75000,
    allowPriceNegotiation: true,
    teachingAreaCity: 'Ha Noi',
    teachingAreaDistrict: 'Dong Da',
    teachingMode: 'both',
    subscriptionType: 'basic',
    subscriptionTypeLabel: 'Basic',
    verificationStatus: 'verified',
    certifications: [],
    successRate: '88%',
    highlights: ['Giao vien truong THPT chuyen'],
    specialty: 'Ngu van cap 3',
  },
  {
    tutorId: 'mock-tutor-005',
    fullName: 'Hoang Van Em',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    headline: 'Ky su CNTT - Day lap trinh Python & Web',
    education: 'DH Bach Khoa Da Nang',
    degreeLevel: 'Dai hoc',
    averageRating: 4.5,
    totalReviews: 31,
    yearsOfExperience: 4,
    completedHours: 140,
    subjects: [
      { subjectId: 6, subjectName: 'Tin hoc', gradeLevels: ['THCS', 'THPT', 'Nguoi di lam'], tags: ['Python', 'JavaScript', 'React'] },
    ],
    hourlyRate: 220000,
    trialLessonPrice: 110000,
    allowPriceNegotiation: false,
    teachingAreaCity: 'Da Nang',
    teachingAreaDistrict: 'Hai Chau',
    teachingMode: 'online',
    subscriptionType: 'basic',
    subscriptionTypeLabel: 'Basic',
    verificationStatus: 'verified',
    certifications: [{ certificateName: 'AWS Certified Developer', issuingOrganization: 'Amazon', yearIssued: 2022 }],
    successRate: '85%',
    highlights: ['Ky su tai cong ty FPT'],
    specialty: 'Lap trinh web & Python',
  },
  {
    tutorId: 'mock-tutor-006',
    fullName: 'Ngo Thi Phuong',
    avatarUrl: 'https://i.pravatar.cc/150?img=20',
    headline: 'Cu nhan Toan - Chuyen luyen thi cap 2',
    education: 'DH Khoa Hoc Tu Nhien HCM',
    degreeLevel: 'Dai hoc',
    averageRating: 4.7,
    totalReviews: 67,
    yearsOfExperience: 6,
    completedHours: 280,
    subjects: [
      { subjectId: 1, subjectName: 'Toan', gradeLevels: ['Lop 6', 'Lop 7', 'Lop 8', 'Lop 9'], tags: ['Hinh hoc', 'Dai so'] },
    ],
    hourlyRate: 160000,
    trialLessonPrice: 80000,
    allowPriceNegotiation: true,
    teachingAreaCity: 'TP.HCM',
    teachingAreaDistrict: 'Quan 7',
    teachingMode: 'both',
    subscriptionType: 'premium',
    subscriptionTypeLabel: 'Premium',
    verificationStatus: 'verified',
    certifications: [],
    successRate: '92%',
    highlights: ['6 nam day tai trung tam uy tin'],
    specialty: 'Toan cap 2',
  },
];

// ── Tutor full profile (cho gia su mock-tutor-001 & 002) ─────
export const MOCK_TUTOR_FULL_PROFILES: Record<string, any> = {
  'mock-tutor-001': {
    videoIntroUrl: null,
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    fullName: 'Nguyen Van An',
    headline: 'Gia su Toan - Vat ly 10 nam kinh nghiem',
    teachingAreaCity: 'Ha Noi',
    teachingAreaDistrict: 'Cau Giay',
    teachingMode: 'both',
    subjects: [
      { subjectId: 1, subjectName: 'Toan', gradeLevels: ['Lop 10', 'Lop 11', 'Lop 12'], tags: ['Dai so', 'Giai tich'] },
      { subjectId: 2, subjectName: 'Vat ly', gradeLevels: ['Lop 10', 'Lop 11'], tags: ['Co hoc', 'Dien'] },
    ],
    bio: 'Toi la gia su co 10 nam kinh nghiem day Toan va Vat ly cap 3. Toi tu hao co ty le hoc sinh dat DH tren 95%.',
    education: 'Cu nhan Vat ly ky thuat - DH Bach Khoa Ha Noi, tot nghiep loai Gioi',
    gpa: 3.8,
    gpaScale: 4.0,
    experience: '10 nam day kem tu nam 2014. Da day hon 200 hoc sinh, trong do 95% dat DH.',
    certificates: [
      {
        certificateId: 'cert-001',
        certificateName: 'Bang DH Loai Gioi',
        certificateType: 'academic',
        issuingOrganization: 'DH Bach Khoa Ha Noi',
        yearIssued: 2014,
        credentialId: null,
        credentialUrl: null,
        certificateFileUrl: '',
        createdAt: '2024-01-01T00:00:00Z',
        verificationStatus: 'verified',
        verificationNote: null,
      },
    ],
    hourlyRate: 200000,
    trialLessonPrice: 100000,
    allowPriceNegotiation: true,
    availabilities: [
      { availabilityid: 1, tutorid: 'mock-tutor-001', dayofweek: 1, starttime: '18:00', endtime: '21:00', createdat: '2024-01-01T00:00:00Z', dayName: 'Thu 2' },
      { availabilityid: 2, tutorid: 'mock-tutor-001', dayofweek: 3, starttime: '18:00', endtime: '21:00', createdat: '2024-01-01T00:00:00Z', dayName: 'Thu 4' },
      { availabilityid: 3, tutorid: 'mock-tutor-001', dayofweek: 6, starttime: '08:00', endtime: '17:00', createdat: '2024-01-01T00:00:00Z', dayName: 'Thu 7' },
    ],
    totalFeedbacks: 124,
    averageRating: 4.8,
    feedbacks: [
      { feedbackId: 1, fromUserId: 'u1', fromUserName: 'Nguyen Minh', fromUserAvatar: 'https://i.pravatar.cc/40?img=3', rating: 5, comment: 'Thay day rat de hieu, con toi cai thien nhieu!' },
      { feedbackId: 2, fromUserId: 'u2', fromUserName: 'Tran Lan', fromUserAvatar: 'https://i.pravatar.cc/40?img=4', rating: 5, comment: 'Phuong phap day tot, chuan bi bai ky luong.' },
      { feedbackId: 3, fromUserId: 'u3', fromUserName: 'Le Hung', fromUserAvatar: 'https://i.pravatar.cc/40?img=6', rating: 4, comment: 'Day tot, doi khi giang hoi nhanh.' },
    ],
    totalActiveClasses: 5,
    activeClasses: [
      { bookingId: 101, studentName: 'Nguyen Bao Chau', subjectName: 'Toan lop 12', startDate: '2026-04-01', sessionCount: 20 },
    ],
  },
  'mock-tutor-002': {
    videoIntroUrl: null,
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    fullName: 'Tran Thi Binh',
    headline: 'Giao vien Tieng Anh - Chuyen gia IELTS & TOEIC',
    teachingAreaCity: 'TP.HCM',
    teachingAreaDistrict: 'Quan 3',
    teachingMode: 'online',
    subjects: [
      { subjectId: 3, subjectName: 'Tieng Anh', gradeLevels: ['Lop 6', 'Lop 12'], tags: ['IELTS', 'TOEIC', 'Giao tiep'] },
    ],
    bio: 'Giao vien Tieng Anh voi bang Thac si Ngon ngu hoc va chung chi IELTS 8.5. Chuyen dao tao IELTS/TOEIC.',
    education: 'Thac si Ngon ngu Anh - DH Ngoai Ngu Ha Noi',
    gpa: 3.9,
    gpaScale: 4.0,
    experience: '7 nam giang day. Da giup hon 150 hoc vien dat muc tieu IELTS/TOEIC.',
    certificates: [
      { certificateId: 'cert-002', certificateName: 'IELTS 8.5', certificateType: 'language', issuingOrganization: 'British Council', yearIssued: 2019, credentialId: null, credentialUrl: null, certificateFileUrl: '', createdAt: '2024-01-01T00:00:00Z', verificationStatus: 'verified', verificationNote: null },
    ],
    hourlyRate: 250000,
    trialLessonPrice: 0,
    allowPriceNegotiation: false,
    availabilities: [
      { availabilityid: 4, tutorid: 'mock-tutor-002', dayofweek: 2, starttime: '19:00', endtime: '21:00', createdat: '2024-01-01T00:00:00Z', dayName: 'Thu 3' },
      { availabilityid: 5, tutorid: 'mock-tutor-002', dayofweek: 4, starttime: '19:00', endtime: '21:00', createdat: '2024-01-01T00:00:00Z', dayName: 'Thu 5' },
    ],
    totalFeedbacks: 89,
    averageRating: 4.9,
    feedbacks: [
      { feedbackId: 4, fromUserId: 'u4', fromUserName: 'Pham Lan Anh', fromUserAvatar: 'https://i.pravatar.cc/40?img=7', rating: 5, comment: 'Co Binh day qua tuyet! IELTS cua toi tu 5.5 len 7.0 sau 3 thang.' },
      { feedbackId: 5, fromUserId: 'u5', fromUserName: 'Vo Quang', fromUserAvatar: 'https://i.pravatar.cc/40?img=8', rating: 5, comment: 'Rat tan tam, luon hua bai sau moi buoi hoc.' },
    ],
    totalActiveClasses: 8,
    activeClasses: [
      { bookingId: 201, studentName: 'Nguyen Thi Huong', subjectName: 'Tieng Anh - IELTS', startDate: '2026-04-15', sessionCount: 24 },
    ],
  },
};

// ── Students (con cua Parent) ─────────────────────────────────
export const MOCK_STUDENTS = [
  {
    studentId: 'mock-student-001',
    fullName: 'Le Minh Khoa',
    gradeLevel: 'Lop 11',
    dateOfBirth: '2010-05-15',
    school: 'THPT Le Hong Phong',
    avatarUrl: 'https://i.pravatar.cc/60?img=13',
    parentId: 'mock-parent-001',
    linkCode: null,
    linkedAt: '2025-01-10T00:00:00Z',
  },
  {
    studentId: 'mock-student-002',
    fullName: 'Le Thi Ngoc',
    gradeLevel: 'Lop 8',
    dateOfBirth: '2013-09-20',
    school: 'THCS Tran Hung Dao',
    avatarUrl: 'https://i.pravatar.cc/60?img=16',
    parentId: 'mock-parent-001',
    linkCode: null,
    linkedAt: '2025-02-01T00:00:00Z',
  },
];

// ── Bookings ─────────────────────────────────────────────────
export const MOCK_BOOKINGS = [
  {
    bookingId: 201,
    parentId: 'mock-parent-001',
    student: { studentId: 'mock-student-001', fullName: 'Le Minh Khoa', gradeLevel: 'Lop 11' },
    tutor: { tutorId: 'mock-tutor-002', fullName: 'Tran Thi Binh', avatarUrl: 'https://i.pravatar.cc/150?img=5', hourlyRate: 250000 },
    subject: { subjectId: 3, subjectName: 'Tieng Anh' },
    packageType: '1-thang',
    sessionCount: 8,
    teachingMode: 'online',
    price: 2000000,
    discountApplied: 0,
    finalPrice: 2000000,
    platformFee: 100000,
    status: 'active',
    paymentStatus: 'paid',
    paymentCode: 'PAY-MOCK-201',
    schedule: [{ dayOfWeek: 2, startTime: '19:00', endTime: '21:00' }, { dayOfWeek: 4, startTime: '19:00', endTime: '21:00' }],
    startDate: '2026-04-15',
    createdAt: '2026-04-10T09:00:00Z',
    paymentDueAt: null,
    depositAmount: 1000000,
    remainingAmount: 1000000,
    depositPaidAt: '2026-04-10T09:30:00Z',
    remainingPaidAt: null,
    escrowStatus: 'deposited',
    channelId: 1,
    refundAmount: null,
    refundStatus: null,
  },
  {
    bookingId: 202,
    parentId: 'mock-parent-001',
    student: { studentId: 'mock-student-002', fullName: 'Le Thi Ngoc', gradeLevel: 'Lop 8' },
    tutor: { tutorId: 'mock-tutor-001', fullName: 'Nguyen Van An', avatarUrl: 'https://i.pravatar.cc/150?img=11', hourlyRate: 200000 },
    subject: { subjectId: 1, subjectName: 'Toan' },
    packageType: '1-thang',
    sessionCount: 8,
    teachingMode: 'offline',
    price: 1600000,
    discountApplied: 160000,
    finalPrice: 1440000,
    platformFee: 72000,
    status: 'pending_payment',
    paymentStatus: 'unpaid',
    paymentCode: 'PAY-MOCK-202',
    schedule: [{ dayOfWeek: 6, startTime: '08:00', endTime: '10:00' }],
    startDate: '2026-05-01',
    createdAt: '2026-04-28T14:00:00Z',
    paymentDueAt: '2026-05-03T23:59:59Z',
    depositAmount: 720000,
    remainingAmount: 720000,
    depositPaidAt: null,
    remainingPaidAt: null,
    escrowStatus: null,
    channelId: null,
    refundAmount: null,
    refundStatus: null,
  },
  {
    bookingId: 203,
    parentId: 'mock-parent-001',
    student: { studentId: 'mock-student-001', fullName: 'Le Minh Khoa', gradeLevel: 'Lop 11' },
    tutor: { tutorId: 'mock-tutor-003', fullName: 'Le Hong Cuong', avatarUrl: 'https://i.pravatar.cc/150?img=12', hourlyRate: 180000 },
    subject: { subjectId: 4, subjectName: 'Hoa hoc' },
    packageType: '1-thang',
    sessionCount: 4,
    teachingMode: 'offline',
    price: 720000,
    discountApplied: 0,
    finalPrice: 720000,
    platformFee: 36000,
    status: 'completed',
    paymentStatus: 'paid',
    paymentCode: 'PAY-MOCK-203',
    schedule: [{ dayOfWeek: 0, startTime: '14:00', endTime: '16:00' }],
    startDate: '2026-03-01',
    createdAt: '2026-02-25T10:00:00Z',
    paymentDueAt: null,
    depositAmount: 360000,
    remainingAmount: 360000,
    depositPaidAt: '2026-02-25T11:00:00Z',
    remainingPaidAt: '2026-04-01T00:00:00Z',
    escrowStatus: 'settled',
    channelId: 3,
    refundAmount: null,
    refundStatus: null,
  },
];

// ── Lessons ──────────────────────────────────────────────────
const now = new Date('2026-05-21T00:00:00Z');
const d = (offsetHours: number) => new Date(now.getTime() + offsetHours * 3_600_000).toISOString();

export const MOCK_LESSONS = [
  {
    lessonId: 1001,
    bookingId: 201,
    scheduledStart: d(2),
    scheduledEnd: d(4),
    lessonPrice: 500000,
    lessonContent: 'Toan: Gioi han - Lien tuc (Chuong 4)',
    homework: 'Bai tap 1-10 trang 87 SGK',
    tutorNotes: 'Hoc sinh can on lai khai niem lien tuc truoc buoi sau',
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/mock-link-001',
    isTutorPresent: false,
    isStudentPresent: false,
    checkInTime: null,
    checkOutTime: null,
    attendanceNote: null,
    createdAt: '2026-04-15T00:00:00Z',
    student: { studentId: 'mock-student-001', fullName: 'Le Minh Khoa', gradeLevel: 'Lop 11' },
    subject: { subjectId: 3, subjectName: 'Tieng Anh' },
    tutor: { tutorId: 'mock-tutor-002', fullName: 'Tran Thi Binh', avatarUrl: 'https://i.pravatar.cc/150?img=5', hourlyRate: 250000 },
    submittedAt: null,
    confirmDeadline: d(48),
  },
  {
    lessonId: 1002,
    bookingId: 201,
    scheduledStart: d(-48),
    scheduledEnd: d(-46),
    lessonPrice: 500000,
    lessonContent: 'Tieng Anh: Reading comprehension - IELTS Task 1',
    homework: 'Viet 1 bai Task 1 mau va nop truoc buoi sau',
    tutorNotes: 'Hoc sinh can luyen them tu vung theo chu de moi truong',
    status: 'pending_confirmation',
    meetingLink: 'https://meet.google.com/mock-link-002',
    isTutorPresent: true,
    isStudentPresent: true,
    checkInTime: d(-48),
    checkOutTime: d(-46),
    attendanceNote: null,
    createdAt: '2026-04-15T00:00:00Z',
    student: { studentId: 'mock-student-001', fullName: 'Le Minh Khoa', gradeLevel: 'Lop 11' },
    subject: { subjectId: 3, subjectName: 'Tieng Anh' },
    tutor: { tutorId: 'mock-tutor-002', fullName: 'Tran Thi Binh', avatarUrl: 'https://i.pravatar.cc/150?img=5', hourlyRate: 250000 },
    submittedAt: d(-46),
    confirmDeadline: d(2),
  },
  {
    lessonId: 1003,
    bookingId: 201,
    scheduledStart: d(-96),
    scheduledEnd: d(-94),
    lessonPrice: 500000,
    lessonContent: 'Tieng Anh: Listening IELTS - Section 3 & 4',
    homework: 'Nghe lai tape 3 lan va ghi chu cau tra loi sai',
    tutorNotes: '',
    status: 'confirmed',
    meetingLink: 'https://meet.google.com/mock-link-003',
    isTutorPresent: true,
    isStudentPresent: true,
    checkInTime: d(-96),
    checkOutTime: d(-94),
    attendanceNote: null,
    createdAt: '2026-04-15T00:00:00Z',
    student: { studentId: 'mock-student-001', fullName: 'Le Minh Khoa', gradeLevel: 'Lop 11' },
    subject: { subjectId: 3, subjectName: 'Tieng Anh' },
    tutor: { tutorId: 'mock-tutor-002', fullName: 'Tran Thi Binh', avatarUrl: 'https://i.pravatar.cc/150?img=5', hourlyRate: 250000 },
    submittedAt: d(-94),
    confirmDeadline: d(-70),
  },
];

// ── Tutor upcoming lessons (for tutor portal) ────────────────
export const MOCK_TUTOR_UPCOMING = [
  {
    lessonId: 1001,
    scheduledStart: d(2),
    scheduledEnd: d(4),
    studentName: 'Le Minh Khoa',
    subjectName: 'Tieng Anh',
    meetingLink: 'https://meet.google.com/mock-link-001',
  },
  {
    lessonId: 1004,
    scheduledStart: d(50),
    scheduledEnd: d(52),
    studentName: 'Pham Bao Ngoc',
    subjectName: 'Tieng Anh',
    meetingLink: 'https://meet.google.com/mock-link-004',
  },
];

// ── Wallet ────────────────────────────────────────────────────
export const MOCK_WALLET = {
  balance: 3500000,
  frozenBalance: 500000,
  totalBalance: 4000000,
  lastUpdated: d(-1),
};

export const MOCK_TRANSACTIONS = {
  transactions: [
    { transactionId: 1, amount: 2000000, transactionType: 'deposit', description: 'Nap tien vao vi - VietQR', referenceId: null, referenceTable: null, createdAt: d(-10 * 24) },
    { transactionId: 2, amount: -1440000, transactionType: 'payment', description: 'Thanh toan booking #202 - Toan lop 8', referenceId: 202, referenceTable: 'bookings', createdAt: d(-5 * 24) },
    { transactionId: 3, amount: 1500000, transactionType: 'deposit', description: 'Nap tien vao vi - VietQR', referenceId: null, referenceTable: null, createdAt: d(-2 * 24) },
    { transactionId: 4, amount: -500000, transactionType: 'frozen', description: 'Tam giu cho booking #201 - Tieng Anh', referenceId: 201, referenceTable: 'bookings', createdAt: d(-24) },
  ],
  totalCount: 4,
  page: 1,
  pageSize: 20,
};

// ── Notifications ─────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  { notificationid: 1, userid: 'mock-parent-001', title: 'Buoi hoc sap dien ra', message: 'Buoi hoc Tieng Anh cua Le Minh Khoa se bat dau sau 2 gio nua. Gia su: Tran Thi Binh.', isread: false, createdat: d(-1) },
  { notificationid: 2, userid: 'mock-parent-001', title: 'Bao cao buoi hoc moi', message: 'Gia su Tran Thi Binh da nop bao cao cho buoi hoc ngay ' + new Date(d(-48)).toLocaleDateString('vi-VN') + '. Vui long xem va xac nhan.', isread: false, createdat: d(-47) },
  { notificationid: 3, userid: 'mock-parent-001', title: 'Thanh toan thanh cong', message: 'Ban da nap tien thanh cong vao vi. So du hien tai: 3.500.000 VND.', isread: true, createdat: d(-2 * 24) },
  { notificationid: 4, userid: 'mock-parent-001', title: 'Yeu cau dat lich duoc chap nhan', message: 'Gia su Nguyen Van An da chap nhan yeu cau day Toan lop 8 cho Le Thi Ngoc.', isread: true, createdat: d(-5 * 24) },
];

// ── Admin dashboard ───────────────────────────────────────────
export const MOCK_ADMIN_DASHBOARD = {
  totalUsers: 1284,
  pendingTutors: 7,
  activeBookings: 342,
  openDisputes: 5,
  totalGMV: 485000000,
  netRevenue: 24250000,
  escrowBalance: 85000000,
  pendingWithdrawals: 12500000,
  // Extra fields for flexibility
  totalrevenue: 24250000,
  totalgmv: 485000000,
  pendingwithdrawals: 12500000,
  escrowbalance: 85000000,
};

export const MOCK_ADMIN_REVENUE_CHART = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(now.getTime() - (29 - i) * 86_400_000).toISOString().split('T')[0],
  amount: 600000 + Math.round(Math.random() * 400000),
}));

export const MOCK_ADMIN_USER_GROWTH = [
  { month: 'Jan 2026', students: 120, tutors: 30 },
  { month: 'Feb 2026', students: 155, tutors: 38 },
  { month: 'Mar 2026', students: 190, tutors: 44 },
  { month: 'Apr 2026', students: 230, tutors: 51 },
  { month: 'May 2026', students: 268, tutors: 58 },
];

export const MOCK_ADMIN_ACTIVITIES = [
  { activityId: 'a1', activityType: 'tutor_approved', description: 'Gia su Nguyen Van Duc da duoc duyet', timestamp: d(-2), userName: 'Admin Tutora' },
  { activityId: 'a2', activityType: 'dispute_resolved', description: 'Khieu nai #12 da duoc giai quyet', timestamp: d(-5), userName: 'Admin Tutora' },
  { activityId: 'a3', activityType: 'withdrawal_processed', description: 'Rut tien 2.000.000 VND cho gia su Tran Minh', timestamp: d(-8), userName: 'Admin Tutora' },
];

export const MOCK_PENDING_TUTORS = [
  {
    tutorid: 'pt-001',
    userid: 'u-pt-001',
    fullname: 'Nguyen Van Duc',
    email: 'duc.nguyen@gmail.com',
    phone: '0901234567',
    avatarurl: 'https://i.pravatar.cc/60?img=21',
    profilestatus: 'pending_review',
    createdat: d(-3 * 24),
    subjects: ['Toan', 'Vat ly'],
  },
  {
    tutorid: 'pt-002',
    userid: 'u-pt-002',
    fullname: 'Le Thi Mai',
    email: 'mai.le@gmail.com',
    phone: '0912345678',
    avatarurl: 'https://i.pravatar.cc/60?img=22',
    profilestatus: 'pending_review',
    createdat: d(-5 * 24),
    subjects: ['Tieng Anh'],
  },
  {
    tutorid: 'pt-003',
    userid: 'u-pt-003',
    fullname: 'Hoang Minh Tri',
    email: 'tri.hoang@gmail.com',
    phone: '0923456789',
    avatarurl: 'https://i.pravatar.cc/60?img=23',
    profilestatus: 'pending_review',
    createdat: d(-7 * 24),
    subjects: ['Hoa hoc', 'Sinh hoc'],
  },
];

// Lowercase keys — admin.service.ts maps: u.userid, u.fullname, u.email, u.phone, u.role, u.status (1=active), u.createdat
export const MOCK_ADMIN_USERS = [
  { userid: 'mock-parent-001', fullname: 'Nguyen Thi Huong', email: 'parent@demo.vn', role: 'Parent', status: 1, createdat: '2025-01-01T00:00:00Z', phone: '0901000001', avatarurl: null, lastloginat: null },
  { userid: 'mock-student-001', fullname: 'Le Minh Khoa', email: 'student@demo.vn', role: 'Student', status: 1, createdat: '2025-01-05T00:00:00Z', phone: '0901000002', avatarurl: null, lastloginat: null },
  { userid: 'mock-tutor-001', fullname: 'Nguyen Van An', email: 'an.nguyen@gmail.com', role: 'Tutor', status: 1, createdat: '2024-12-01T00:00:00Z', phone: '0901000003', avatarurl: 'https://i.pravatar.cc/60?img=11', lastloginat: null },
  { userid: 'mock-tutor-002', fullname: 'Tran Thi Binh', email: 'tutor@demo.vn', role: 'Tutor', status: 1, createdat: '2024-11-15T00:00:00Z', phone: '0901000004', avatarurl: 'https://i.pravatar.cc/60?img=5', lastloginat: null },
  { userid: 'mock-admin-001', fullname: 'Admin Tutora', email: 'admin@demo.vn', role: 'Admin', status: 1, createdat: '2024-01-01T00:00:00Z', phone: '0901000005', avatarurl: null, lastloginat: null },
];

export const MOCK_ADMIN_DISPUTES = [
  { disputeId: 1, bookingId: 199, status: 'open', reason: 'Gia su khong day du thoi gian', createdAt: d(-3 * 24), reporterName: 'Pham Van B', amount: 500000 },
  { disputeId: 2, bookingId: 198, status: 'under_review', reason: 'Chat luong giang day khong dung mo ta', createdAt: d(-7 * 24), reporterName: 'Nguyen Thi C', amount: 800000 },
];

export const MOCK_PAYOUT_OVERVIEW = {
  totalPendingAmount: 12500000,
  totalApprovedAmount: 85000000,
  pendingCount: 4,
  approvedCount: 28,
  fraudRiskCount: 0,
  systemAlerts: [],
  pendingReviews: [
    { withdrawalId: 'wd-001', tutorName: 'Nguyen Van An', amount: 3000000, requestedAt: d(-24), bankName: 'Vietcombank', accountNumber: '1234567890' },
    { withdrawalId: 'wd-002', tutorName: 'Le Hong Cuong', amount: 2500000, requestedAt: d(-48), bankName: 'BIDV', accountNumber: '0987654321' },
  ],
};

// ── Tutor finance ─────────────────────────────────────────────
export const MOCK_TUTOR_FINANCE = {
  summary: {
    balance: 5800000,
    frozenBalance: 1200000,
    totalEarned: 18000000,
    pendingSettlement: 1200000,
    lastWithdrawalAt: d(-10 * 24),
  },
  earnings: {
    period: 'month',
    data: Array.from({ length: 4 }, (_, i) => ({
      label: `Tuan ${i + 1}`,
      amount: 1500000 + Math.round(Math.random() * 1000000),
    })),
    totalEarned: 18000000,
    completedSessions: 36,
  },
};

// ── Parent bookings (for student.service getParentBookings) ───
export const MOCK_TUTOR_BOOKINGS_REQUESTS = [
  {
    bookingId: 301,
    parentId: 'mock-other-parent',
    student: { studentId: 'mock-other-student', fullName: 'Pham Bao Ngoc', gradeLevel: 'Lop 10' },
    tutor: { tutorId: 'mock-tutor-002', fullName: 'Tran Thi Binh', avatarUrl: 'https://i.pravatar.cc/150?img=5', hourlyRate: 250000 },
    subject: { subjectId: 3, subjectName: 'Tieng Anh' },
    packageType: '1-thang',
    sessionCount: 8,
    teachingMode: 'online',
    price: 2000000,
    discountApplied: 0,
    finalPrice: 2000000,
    platformFee: 100000,
    status: 'pending_tutor',
    paymentStatus: 'unpaid',
    paymentCode: 'PAY-MOCK-301',
    schedule: [{ dayOfWeek: 2, startTime: '19:00', endTime: '21:00' }],
    startDate: '2026-06-01',
    createdAt: d(-2),
    paymentDueAt: null,
    depositAmount: 1000000,
    remainingAmount: 1000000,
    depositPaidAt: null,
    remainingPaidAt: null,
    escrowStatus: null,
    channelId: null,
    refundAmount: null,
    refundStatus: null,
  },
];

// ── Payment info ──────────────────────────────────────────────
export const MOCK_PAYMENT_INFO = (bookingId: number) => ({
  bookingId,
  paymentLinkId: `mock-pay-link-${bookingId}`,
  paymentCode: `PAY-MOCK-${bookingId}`,
  amount: 720000,
  currency: 'VND',
  checkoutUrl: '',
  qrCode: '',
  accountName: 'CONG TY TUTORA',
  accountNumber: '1234567890',
  bin: '970436',
  description: `Thanh toan booking #${bookingId}`,
  expiredAt: d(72),
  status: 'PENDING',
  canPayWithWallet: true,
  walletBalance: 3500000,
  paymentPhase: 'deposit',
  totalAmount: 1440000,
  depositAmount: 720000,
  remainingAmount: 720000,
  isDepositPaid: false,
  isRemainingPaid: false,
});

// ── Admin bookings list ───────────────────────────────────────
export const MOCK_ADMIN_BOOKINGS = [
  {
    bookingId: 201, status: 'active', paymentStatus: 'paid', teachingMode: 'online',
    paymentCode: 'PAY-MOCK-201',
    tutorId: 'mock-tutor-002', tutorName: 'Tran Thi Binh', tutorAvatarUrl: 'https://i.pravatar.cc/60?img=5',
    parentId: 'mock-parent-001', parentName: 'Nguyen Thi Huong', parentEmail: 'parent@demo.vn',
    studentId: 'mock-student-001', studentName: 'Le Minh Khoa', gradeLevel: 'Lop 11',
    subjectId: 3, subjectName: 'Tieng Anh',
    price: 2000000, discountApplied: 0, finalPrice: 2000000, platformFee: 100000,
    sessionCount: 8, sessionsRemaining: 4, lessonsCompleted: 4, lessonsTotal: 8,
    startDate: '2026-04-15', createdAt: '2026-04-10T09:00:00Z',
    cancelledAt: null, cancellationReason: null,
  },
  {
    bookingId: 202, status: 'pending_payment', paymentStatus: 'unpaid', teachingMode: 'offline',
    paymentCode: 'PAY-MOCK-202',
    tutorId: 'mock-tutor-001', tutorName: 'Nguyen Van An', tutorAvatarUrl: 'https://i.pravatar.cc/60?img=11',
    parentId: 'mock-parent-001', parentName: 'Nguyen Thi Huong', parentEmail: 'parent@demo.vn',
    studentId: 'mock-student-002', studentName: 'Le Thi Ngoc', gradeLevel: 'Lop 8',
    subjectId: 1, subjectName: 'Toan',
    price: 1600000, discountApplied: 160000, finalPrice: 1440000, platformFee: 72000,
    sessionCount: 8, sessionsRemaining: 8, lessonsCompleted: 0, lessonsTotal: 8,
    startDate: '2026-05-01', createdAt: '2026-04-28T14:00:00Z',
    cancelledAt: null, cancellationReason: null,
  },
  {
    bookingId: 203, status: 'completed', paymentStatus: 'paid', teachingMode: 'offline',
    paymentCode: 'PAY-MOCK-203',
    tutorId: 'mock-tutor-003', tutorName: 'Le Hong Cuong', tutorAvatarUrl: 'https://i.pravatar.cc/60?img=12',
    parentId: 'mock-parent-001', parentName: 'Nguyen Thi Huong', parentEmail: 'parent@demo.vn',
    studentId: 'mock-student-001', studentName: 'Le Minh Khoa', gradeLevel: 'Lop 11',
    subjectId: 4, subjectName: 'Hoa hoc',
    price: 720000, discountApplied: 0, finalPrice: 720000, platformFee: 36000,
    sessionCount: 4, sessionsRemaining: 0, lessonsCompleted: 4, lessonsTotal: 4,
    startDate: '2026-03-01', createdAt: '2026-02-25T10:00:00Z',
    cancelledAt: null, cancellationReason: null,
  },
];

// ── Admin payout requests ─────────────────────────────────────
export const MOCK_PAYOUT_REQUESTS = [
  { id: 1, withdrawalId: 'wd-001', tutorId: 'mock-tutor-001', tutorName: 'Nguyen Van An', amount: 3000000, status: 'pending', requestedAt: d(-24), bankName: 'Vietcombank', accountNumber: '1234567890', accountHolder: 'NGUYEN VAN AN', notes: null },
  { id: 2, withdrawalId: 'wd-002', tutorId: 'mock-tutor-003', tutorName: 'Le Hong Cuong', amount: 2500000, status: 'pending', requestedAt: d(-48), bankName: 'BIDV', accountNumber: '0987654321', accountHolder: 'LE HONG CUONG', notes: null },
  { id: 3, withdrawalId: 'wd-003', tutorId: 'mock-tutor-002', tutorName: 'Tran Thi Binh', amount: 5000000, status: 'approved', requestedAt: d(-96), bankName: 'Vietcombank', accountNumber: '1234567890', accountHolder: 'TRAN THI BINH', notes: 'Da xu ly' },
];

// ── Filter metadata for tutor search ─────────────────────────
export const MOCK_FILTER_METADATA = {
  availableCategories: [
    { value: 'toan', label: 'Toan', count: 12 },
    { value: 'tieng-anh', label: 'Tieng Anh', count: 9 },
    { value: 'hoa-hoc', label: 'Hoa hoc', count: 5 },
  ],
  availableGradeLevels: [
    { value: 'lop-10', label: 'Lop 10', count: 8 },
    { value: 'lop-11', label: 'Lop 11', count: 7 },
    { value: 'lop-12', label: 'Lop 12', count: 6 },
  ],
  availableBudgetRanges: [
    { value: 'under-200k', label: 'Duoi 200.000 VND/h', count: 4 },
    { value: '200k-300k', label: '200.000 - 300.000 VND/h', count: 8 },
    { value: 'above-300k', label: 'Tren 300.000 VND/h', count: 2 },
  ],
  availableTeachingModes: [
    { value: 'online', label: 'Truc tuyen', count: 7 },
    { value: 'offline', label: 'Tai nha', count: 4 },
    { value: 'both', label: 'Ca hai hinh thuc', count: 3 },
  ],
  availableSortOptions: [
    { value: 'rating', label: 'Danh gia cao nhat', count: 0 },
    { value: 'price_asc', label: 'Gia thap nhat', count: 0 },
    { value: 'experience', label: 'Kinh nghiem nhieu nhat', count: 0 },
  ],
  availableSubjects: [
    { value: '1', label: 'Toan', count: 12 },
    { value: '3', label: 'Tieng Anh', count: 9 },
    { value: '4', label: 'Hoa hoc', count: 5 },
  ],
  availableCities: [
    { value: 'ha-noi', label: 'Ha Noi', count: 8 },
    { value: 'tp-hcm', label: 'TP.HCM', count: 7 },
    { value: 'da-nang', label: 'Da Nang', count: 2 },
  ],
  minPriceInResults: 150000,
  maxPriceInResults: 250000,
  minRatingInResults: 4.5,
  maxRatingInResults: 4.9,
};
