/* eslint-disable @typescript-eslint/no-explicit-any */

// ============================================
// ADMIN PORTAL - TYPE DEFINITIONS
// ============================================
// Định nghĩa TypeScript interfaces cho Admin Portal
// Based on: admin-portal-spec.md

// ============================================
// DASHBOARD TYPES (ADM-01)
// ============================================

export interface DashboardMetrics {
  totalUsers: number;
  pendingTutors: number;
  activeBookings: number;
  openDisputes: number;
  totalGMV: number; // Gross Merchandise Value
  netRevenue: number; // Platform revenue after fees
  escrowBalance: number;
  pendingWithdrawals: number;
}

export interface RevenueChartData {
  date: string; // ISO date format
  amount: number;
}

export interface UserGrowthData {
  month: string; // 'Jan 2024', 'Feb 2024', etc.
  students: number;
  tutors: number;
}

export type ActivityType =
  | 'tutor_approved'
  | 'tutor_rejected'
  | 'dispute_resolved'
  | 'withdrawal_processed'
  | 'user_blocked'
  | 'user_unblocked';

export interface RecentActivity {
  activityId: string;
  activityType: ActivityType;
  description: string;
  timestamp: string; // ISO datetime
  userId?: string;
  userName?: string;
  userAvatar?: string;
}

// ============================================
// VETTING TYPES (ADM-02)
// ============================================

export type ProfileStatus =
  | 'onboarding_incomplete'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface TutorForReview {
  tutorid: string;
  userid: string;
  fullname: string;
  email: string;
  phone: string;
  avatarurl: string | null;
  profilestatus: ProfileStatus;
  createdat: string;
  subjects: string[]; // Array of subject names
}

// Interface cho API response từ /api/Tutor/pending
// Nested sections structure matching actual API response

export interface PendingTutorSubject {
  subjectId: number;
  subjectName: string;
  gradeLevels: string; // JSON string e.g. '["grade_12"]'
  tags: string; // JSON string e.g. '["Kiên nhẫn"]'
}

export interface PendingTutorCertificate {
  certificateId: string;
  certificateName: string;
  certificateType: string;
  issuingOrganization: string;
  yearIssued: number;
  credentialId: string | null;
  credentialUrl: string | null;
  certificateFileUrl: string | null;
  createdAt: string;
  verificationStatus: string;
  verificationNote: string | null;
}

export interface PendingTutorSections {
  video?: {
    videoUrl: string | null;
    status: string;
    updatedAt: string;
  };
  basicInfo?: {
    avatarUrl: string | null;
    headline: string | null;
    teachingAreaCity: string | null;
    teachingAreaDistrict: string | null;
    teachingMode: string | null;
    subjects: PendingTutorSubject[];
    status: string;
    updatedAt: string;
  };
  introduction?: {
    bio: string | null;
    education: string | null;
    gpa: number | null;
    gpaScale: number | null;
    experience: string | null;
    status: string;
    updatedAt: string;
  };
  certificates?: {
    totalCount: number;
    certificates: PendingTutorCertificate[];
    status: string;
    updatedAt: string;
  };
  identityCard?: {
    frontImageUrl: string | null;
    backImageUrl: string | null;
    isVerified: boolean;
    status: string;
    updatedAt: string;
  };
  pricing?: {
    hourlyRate: number | null;
    trialLessonPrice: number | null;
    allowPriceNegotiation: boolean;
    status: string;
    updatedAt: string;
  };
}

export interface PendingTutorFromAPI {
  userid: string;
  username: string | null;
  fullname: string;
  email: string;
  phone: string;
  avatarurl: string | null;
  birthdate: string | null;
  gender: string | null;
  address: string | null;
  status: number;
  createdat: string;
  profileStatus: string;
  rejectionNote: string | null;
  profileCreatedAt: string;
  profileUpdatedAt: string;
  sections: PendingTutorSections;
}

export interface PendingTutorsAPIResponse {
  content: PendingTutorFromAPI[];
  statusCode: number;
  message: string;
  error: string | null;
}

// Interface cho API approve/reject - PUT /tutors/{id}/approval
export interface TutorApprovalRequest {
  isApproved: boolean;
  reason?: string;
}

export interface EKYCContent {
  id: string; // CCCD number
  name: string; // Full name from CCCD
  dob: string; // DD/MM/YYYY
  home: string; // Hometown
  address: string;
  type_new: string; // Card type
  sex: string; // "NAM" | "NỮ"
  id_prob: string; // Confidence score
}

export interface UserInfo {
  userid: string;
  fullname: string;
  email: string;
  phone: string;
  birthdate: string | null;
  address: string | null;
  gender: string | null;
  identitynumber: string | null;
  idcardfronturl: string | null;
  idcardbackurl: string | null;
  isidentityverified: boolean;
  ekycRawData: string | null; // JSON string to parse
}

export interface TutorProfileInfo {
  tutorid: string;
  headline: string;
  bio: string;
  hourlyrate: number;
  experience: number; // Years
  education: string;
  gpa: string | null;
  timezone: string;
  teachingareacity: string | null;
  teachingareadistrict: string | null;
  teachingmode: string | null; // 'online', 'offline', 'both'
  profilestatus: ProfileStatus;
  verificationstatus: VerificationStatus;
  certificateurl: any; // JSONB array
  videointrourl: string | null;
  verifiedat: string | null;
  verifiedby: string | null;
  rejectionnote: string | null;
}

export interface TutorSubject {
  subjectid: string;
  subjectname: string;
  gradelevels: string; // Comma-separated or JSON
  specialization: string | null;
}

export interface TutorAvailability {
  availabilityid: string;
  dayofweek: number; // 0-6 (Sunday to Saturday)
  starttime: string; // HH:MM format
  endtime: string; // HH:MM format
  isavailable: boolean;
}

export interface TutorDetailForReview {
  user: UserInfo;
  profile: TutorProfileInfo;
  subjects: TutorSubject[];
  availability: TutorAvailability[];
}

// ============================================
// DISPUTES TYPES (ADM-03)
// ============================================

export type DisputeType =
  | 'no_show'
  | 'quality'
  | 'payment'
  | 'other';

export type DisputeStatus =
  | 'pending'
  | 'investigating'
  | 'resolved'
  | 'closed';

export type DisputePriority = 'low' | 'medium' | 'high';

// ---- Backend-compatible types (matching DisputeListDto) ----

export interface DisputeForAdmin {
  disputeId: number;
  lessonId: number | null;
  bookingId: number | null;
  disputeType: string | null;
  status: string | null;
  reason: string | null;
  createdByName: string | null;
  tutorName: string | null;
  lessonPrice: number | null;
  createdAt: string | null;
  disputeTypeDisplay: string;
  statusDisplay: string;
  statusColor: string;
}

export interface DisputeQueryParams {
  status?: string;
  disputeType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface DisputeStatsDto {
  totalPending: number;
  totalInvestigating: number;
  resolvedThisMonth: number;
  totalRefundedThisMonth: number;
}

// ---- Backend-compatible types (matching DisputeDetailDto) ----

export interface DisputeUserDto {
  userId: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
}

export interface DisputeLessonDto {
  lessonId: number;
  scheduledStart: string;
  scheduledEnd: string;
  status: string | null;
  lessonPrice: number | null;
  lessonContent: string | null;
  homework: string | null;
  isTutorPresent: boolean | null;
  isStudentPresent: boolean | null;
}

export interface DisputeTutorDto {
  tutorId: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  warningCount: number;
  averageRating: number | null;
}

export interface DisputeDetail {
  disputeId: number;
  bookingId: number | null;
  lessonId: number | null;
  disputeType: string | null;
  reason: string | null;
  status: string | null;
  evidence: string[] | null;
  createdAt: string | null;
  resolvedAt: string | null;
  resolutionNote: string | null;
  refundAmount: number | null;
  refundPercentage: number | null;
  createdBy: DisputeUserDto | null;
  resolvedBy: DisputeUserDto | null;
  lesson: DisputeLessonDto | null;
  tutor: DisputeTutorDto | null;
  timeSinceCreation: string | null;
}

export type ResolutionType =
  | 'refund_100'
  | 'refund_50'
  | 'release';

export interface ResolveDisputeRequest {
  resolutionType: ResolutionType;
  resolutionNote: string;
  createTutorWarning?: boolean;
  warningLevel?: number;
}

// Legacy types kept for backward compatibility
export interface DisputeListItem {
  disputeid: string;
  disputetype: string;
  createdby: string;
  creatorName: string;
  creatorRole: 'student' | 'tutor' | 'parent';
  bookingid: string;
  createdat: string;
  status: DisputeStatus;
  escrowAmount: number;
  priority: DisputePriority;
  isUrgent: boolean;
}

export interface BookingInfo {
  bookingid: string;
  studentid: string;
  studentName: string;
  studentAvatar: string | null;
  tutorid: string;
  tutorName: string;
  tutorAvatar: string | null;
  subjectid: string;
  subjectname: string;
  sessioncount: number;
  finalprice: number;
  platformfee: number;
  paymentstatus: string;
  escrowstatus: string;
  bookingdate: string;
  status: string;
}

export interface LessonInfo {
  lessonid: string;
  scheduledstart: string;
  scheduledend: string;
  actualstart: string | null;
  actualend: string | null;
  checkintime: string | null;
  istutorpresent: boolean | null;
  isstudentpresent: boolean | null;
  status: string;
  notes: string | null;
}

export interface TutorWarning {
  warningid: string;
  warninglevel: number;
  reason: string;
  createdat: string;
  issuedby: string;
  issuedByName: string;
  relatedbookingid: string | null;
}

// ============================================
// FINANCIALS TYPES (ADM-04)
// ============================================

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface FinancialMetrics {
  totalGMV: number;
  netRevenue: number;
  escrowBalance: number;
  totalRefunds: number;
  pendingWithdrawalsCount: number;
  pendingWithdrawalsAmount: number;
}

export interface WithdrawalRequest {
  withdrawalid: string;
  userid: string;
  tutorName: string;
  tutorEmail: string;
  tutorAvatar: string | null;
  amount: number;
  bankname: string;
  accountnumber: string;
  accountholdername: string;
  ifsccode: string | null;
  status: WithdrawalStatus;
  requestedat: string;
  processedat: string | null;
  processedby: string | null;
}

export type TransactionType =
  | 'Deposit'
  | 'Escrow'
  | 'Release'
  | 'Refund'
  | 'Withdrawal'
  | 'Fee';

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  transactionid: string;
  transactiontype: TransactionType;
  amount: number;
  walletid: string;
  userid: string;
  userName: string;
  description: string;
  createdat: string;
  status: TransactionStatus;
  relatedbookingid: string | null;
}

// ============================================
// USER MANAGEMENT TYPES (ADM-05)
// ============================================

export type UserRole = 'student' | 'tutor' | 'parent' | 'admin';

export type UserStatus = 'active' | 'inactive' | 'blocked' | 'suspended';

export interface UserListItem {
  userid: string;
  fullname: string;
  email: string;
  phone: string;
  primaryrole: UserRole;
  status: UserStatus;
  createdat: string;
  lastloginat: string | null;
  avatarurl: string | null;
  rating?: number; // For tutors
  totalClasses?: number; // For tutors
  warningsCount?: number;
  suspensionsCount?: number;
}

export interface WalletInfo {
  walletid: string;
  availablebalance: number;
  escrowbalance: number;
  frozenbalance: number;
  totalearnings: number;
}

export interface UserWarning {
  warningid: string;
  warninglevel: number;
  reason: string;
  issuedat: string;
  issuedby: string;
  issuedByName: string;
  relatedbookingid: string | null;
}

export interface UserSuspension {
  suspensionid: string;
  suspensiontype: string;
  reason: string;
  startdate: string;
  enddate: string | null;
  isactive: boolean;
  createdby: string;
  createdByName: string;
}

export interface UserDetail {
  user: {
    userid: string;
    fullname: string;
    email: string;
    phone: string;
    primaryrole: UserRole;
    status: UserStatus;
    isidentityverified: boolean;
    createdat: string;
    lastloginat: string | null;
    avatarurl: string | null;
  };
  wallet?: WalletInfo;
  warnings: UserWarning[];
  suspensions: UserSuspension[];
  stats?: {
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
  };
}

export interface IssueWarningRequest {
  userid: string;
  warninglevel: number; // 1, 2
  reason: string;
  relatedbookingid?: string;
}

export interface SuspendUserRequest {
  userid: string;
  suspensiontype: 'hidden_1_week' | 'account_locked';
  reason: string;
  durationDays?: number;
}

// ============================================
// SETTINGS TYPES (ADM-06)
// ============================================

export interface Subject {
  subjectid: string;
  subjectname: string;
  description: string | null;
  gradelevels: string[]; // Array of grade levels
  isactive: boolean;
  createdat: string;
  updatedat: string;
}

export interface PlatformConfig {
  configid?: string;
  platformfee_parent_percent: number; // 0-100
  platformfee_tutor_percent: number; // 0-100
  minwithdrawalamount: number;
  escrowperioddays: number;
  vatenabled: boolean;
  vatrate: number;
  cancellationdeadlinehours: number;
  graceperiodhours: number;
  warningthreshold_level1: number;
  warningthreshold_level2: number;
  suspensiondurationdays: number;
  updatedat: string;
}

export interface CancellationPolicy {
  timeWindowHours: number;
  refundPercentage: number;
  penaltyPercentage: number;
}

// ============================================
// COMMON TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface FilterParams {
  status?: string;
  role?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface ApproveTutorResponse {
  success: boolean;
  message: string;
  tutorid: string;
}

export interface RejectTutorRequest {
  rejectionNote: string; // Min 20 chars
}

export interface RejectTutorResponse {
  success: boolean;
  message: string;
  tutorid: string;
}

export interface VerifyIdentityResponse {
  success: boolean;
  message: string;
  userid: string;
}

export interface VerifyCredentialResponse {
  success: boolean;
  message: string;
  credentialIndex: number;
}
