/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// MOCK HANDLERS — khớp URL pattern và trả về mock data
// ============================================================

import type { InternalAxiosRequestConfig } from 'axios';
import {
  DEMO_CREDENTIALS,
  MOCK_TUTORS,
  MOCK_TUTOR_FULL_PROFILES,
  MOCK_BOOKINGS,
  MOCK_TUTOR_BOOKINGS_REQUESTS,
  MOCK_LESSONS,
  MOCK_TUTOR_UPCOMING,
  MOCK_WALLET,
  MOCK_TRANSACTIONS,
  MOCK_NOTIFICATIONS,
  MOCK_ADMIN_DASHBOARD,
  MOCK_ADMIN_REVENUE_CHART,
  MOCK_ADMIN_USER_GROWTH,
  MOCK_ADMIN_ACTIVITIES,
  MOCK_PENDING_TUTORS,
  MOCK_ADMIN_USERS,
  MOCK_ADMIN_DISPUTES,
  MOCK_PAYOUT_OVERVIEW,
  MOCK_PAYOUT_REQUESTS,
  MOCK_ADMIN_BOOKINGS,
  MOCK_TUTOR_FINANCE,
  MOCK_STUDENTS,
  MOCK_FILTER_METADATA,
  MOCK_PAYMENT_INFO,
  MOCK_USERS,
} from './data';

// ── Helpers ──────────────────────────────────────────────────

/** Chuẩn hoá URL → chỉ lấy phần path sau /api */
function extractPath(url: string | undefined): string {
  if (!url) return '/';
  const withoutHost = url.replace(/^https?:\/\/[^/]+/, '');
  return withoutHost.replace(/^\/api/, '') || '/';
}

function ok<T>(content: T, statusCode = 200): any {
  return { content, statusCode, message: 'OK', error: null };
}

function parseBody(config: InternalAxiosRequestConfig): any {
  if (!config.data) return {};
  if (typeof config.data === 'string') {
    try { return JSON.parse(config.data); } catch { return {}; }
  }
  return config.data;
}

// ── Handler type ──────────────────────────────────────────────

interface Handler {
  method: string; // 'get' | 'post' | 'put' | 'delete' | 'patch' | '*'
  test: (path: string) => boolean;
  respond: (config: InternalAxiosRequestConfig, path: string) => unknown;
}

// ── Handler list (kiểm tra theo thứ tự - specific trước, generic sau) ──

export const MOCK_HANDLERS: Handler[] = [
  // ── Auth ──────────────────────────────────────────────────
  {
    method: 'post',
    test: (p) => p === '/auth/login',
    respond: (config) => {
      const body = parseBody(config);
      const email = (body.emailOrPhone || body.email || '').toLowerCase();
      const user = DEMO_CREDENTIALS[email];
      if (user) {
        const token = user.token;
        return ok({ token, refreshToken: 'mock-refresh-token', userId: user.userId, role: user.role });
      }
      // default: đăng nhập với bất kỳ thông tin nào → vào role Parent
      const fallback = MOCK_USERS.Parent;
      return ok({ token: fallback.token, refreshToken: 'mock-refresh-token', userId: fallback.userId, role: 'Parent' });
    },
  },
  {
    method: 'post',
    test: (p) => p === '/auth/register' || p === '/auth/supabase/register' || p === '/auth/supabase/login',
    respond: () => {
      const user = MOCK_USERS.Parent;
      return ok({ token: user.token, refreshToken: 'mock-refresh-token', userId: user.userId, role: 'Parent' });
    },
  },
  {
    method: 'post',
    test: (p) => p.endsWith('/token/revoke') || p.endsWith('/tokens/refresh'),
    respond: () => ok({ token: MOCK_USERS.Parent.token, refreshToken: 'mock-refresh-token' }),
  },
  {
    method: 'get',
    test: (p) => /^\/users\/by-email\//.test(p),
    respond: () => ({ status: 404, message: 'Not found' }),
  },
  {
    method: 'get',
    test: (p) => p === '/users/tour-status',
    respond: () => ok({ hasCompletedTour: true }),
  },
  {
    method: 'put',
    test: (p) => p === '/users/complete-tour',
    respond: () => ok(null),
  },
  {
    method: 'put',
    test: (p) => p.startsWith('/passwords/'),
    respond: () => ok(null),
  },
  {
    method: 'get',
    test: (p) => /^\/users\/[^/]+$/.test(p),
    respond: (_, path) => {
      const userId = path.split('/').pop();
      const allUsers = [...Object.values(MOCK_USERS)];
      const u = allUsers.find((x) => x.userId === userId) || MOCK_USERS.Parent;
      return ok({ userId: u.userId, email: u.email, fullName: u.name, role: u.role, avatarUrl: 'https://i.pravatar.cc/150?img=1' });
    },
  },

  // ── Tutor Search ─────────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/tutors/search',
    respond: () => ok({
      items: MOCK_TUTORS,
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      totalCount: MOCK_TUTORS.length,
      hasPrevious: false,
      hasNext: false,
      resultsText: `${MOCK_TUTORS.length} gia su`,
      filterMetadata: MOCK_FILTER_METADATA,
    }),
  },

  // ── Tutor Full Profile ────────────────────────────────────
  {
    method: 'get',
    test: (p) => /^\/tutors\/[^/]+\/full-profile/.test(p),
    respond: (_, path) => {
      const tutorId = path.split('/')[2];
      const profile = MOCK_TUTOR_FULL_PROFILES[tutorId] || MOCK_TUTOR_FULL_PROFILES['mock-tutor-001'];
      return ok(profile);
    },
  },

  // ── Tutor verification ────────────────────────────────────
  {
    method: 'get',
    test: (p) => /\/tutors\/[^/]+\/verification\/progress/.test(p),
    respond: () => ok({
      overallStatus: 'approved',
      videoSection: { status: 'updated', videoUrl: null },
      basicInfoSection: { status: 'updated', fullName: 'Tran Thi Binh', headline: 'Giao vien Tieng Anh', teachingMode: 'online' },
      introductionSection: { status: 'updated', bio: 'Giao vien Tieng Anh 7 nam kinh nghiem', education: 'Thac si Ngon ngu Anh' },
      pricingSection: { status: 'updated', hourlyRate: 250000, trialLessonPrice: 0 },
      identityCardSection: { status: 'updated', idCardFrontUrl: '', idCardBackUrl: '' },
      certificatesSection: { status: 'updated', certificates: [] },
      subjectSection: { status: 'updated', subjects: [{ subjectId: 3, subjectName: 'Tieng Anh', gradeLevels: ['Lop 6', 'Lop 12'], tags: ['IELTS'] }] },
      availabilitySection: { status: 'updated' },
    }),
  },
  {
    method: '*',
    test: (p) => /\/tutors\/[^/]+\/profile\//.test(p) || /\/tutors\/[^/]+\/availability/.test(p),
    respond: () => ok(null),
  },

  // ── Bookings (parent) ────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/bookings',
    respond: () => ok({ items: MOCK_BOOKINGS, totalCount: MOCK_BOOKINGS.length }),
  },
  {
    method: 'post',
    test: (p) => p === '/bookings',
    respond: (config) => {
      const body = parseBody(config);
      return ok({
        ...MOCK_BOOKINGS[0],
        bookingId: 999,
        tutorId: body.tutorId,
        studentId: body.studentId,
        status: 'pending_tutor',
        paymentStatus: 'unpaid',
        createdAt: new Date().toISOString(),
      });
    },
  },
  {
    method: 'get',
    test: (p) => /^\/bookings\/\d+\/payment\/status/.test(p),
    respond: (_, path) => {
      const id = Number(path.split('/')[2]);
      return ok({ bookingId: id, status: 'PENDING', amount: 720000, amountPaid: 0, amountRemaining: 720000, isPaid: false, depositAmount: 720000, remainingAmount: 720000, isDepositPaid: false, isRemainingPaid: false });
    },
  },
  {
    method: 'get',
    test: (p) => /^\/bookings\/\d+\/payment$/.test(p),
    respond: (_, path) => {
      const id = Number(path.split('/')[2]);
      return ok(MOCK_PAYMENT_INFO(id));
    },
  },
  {
    method: 'post',
    test: (p) => /^\/bookings\/\d+\/pay\/wallet/.test(p),
    respond: () => ok({ success: true, message: 'Thanh toan thanh cong' }),
  },
  {
    method: 'post',
    test: (p) => /^\/bookings\/\d+\/apply-promotion/.test(p),
    respond: (_, path) => {
      const id = Number(path.split('/')[2]);
      const b = MOCK_BOOKINGS.find((x) => x.bookingId === id) || MOCK_BOOKINGS[0];
      return ok({ ...b, discountApplied: 100000, finalPrice: b.finalPrice - 100000 });
    },
  },
  {
    method: 'delete',
    test: (p) => /^\/bookings\/\d+$/.test(p),
    respond: () => ok('Da huy booking'),
  },
  {
    method: 'get',
    test: (p) => /^\/bookings\/\d+$/.test(p),
    respond: (_, path) => {
      const id = Number(path.split('/')[2]);
      return ok(MOCK_BOOKINGS.find((b) => b.bookingId === id) || MOCK_BOOKINGS[0]);
    },
  },

  // ── Promotions ───────────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/promotions/validate',
    respond: () => ok({ valid: true, code: 'DEMO10', discountType: 'percentage', discountValue: 10, maxDiscountAmount: 200000, minOrderValue: 500000, message: 'Ma giam gia hop le' }),
  },

  // ── Tutor bookings ───────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/tutors/bookings',
    respond: () => ok({ items: MOCK_TUTOR_BOOKINGS_REQUESTS, totalCount: MOCK_TUTOR_BOOKINGS_REQUESTS.length }),
  },
  {
    method: 'post',
    test: (p) => /^\/tutors\/bookings\/\d+\/(accept|decline)/.test(p),
    respond: () => ok({ success: true }),
  },

  // ── Lessons (tutor portal) ───────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/lessons/upcoming',
    respond: () => ok(MOCK_TUTOR_UPCOMING),
  },
  {
    method: 'get',
    test: (p) => /^\/lessons\/\d+$/.test(p),
    respond: (_, path) => {
      const id = Number(path.split('/')[2]);
      const lesson = MOCK_LESSONS.find((l) => l.lessonId === id) || MOCK_LESSONS[0];
      return ok({ ...lesson, report: null });
    },
  },
  {
    method: 'get',
    test: (p) => p === '/lessons',
    respond: () => ok({ items: MOCK_LESSONS, totalCount: MOCK_LESSONS.length, pageNumber: 1, pageSize: 20, totalPages: 1 }),
  },
  {
    method: 'post',
    test: (p) => /^\/lessons\/\d+\/(checkin|checkout|report)/.test(p),
    respond: () => ok({ success: true }),
  },

  // ── Parent lessons ───────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/parent/lessons/pending',
    respond: () => ok(MOCK_LESSONS.filter((l) => l.status === 'pending_confirmation').map((l) => ({
      lessonId: l.lessonId,
      bookingId: l.bookingId,
      scheduledStart: l.scheduledStart,
      scheduledEnd: l.scheduledEnd,
      confirmDeadline: l.confirmDeadline,
      lessonPrice: l.lessonPrice,
      lessonContent: l.lessonContent,
      homework: l.homework,
      status: l.status,
      tutorName: l.tutor?.fullName,
      tutorAvatar: l.tutor?.avatarUrl,
      studentName: l.student?.fullName,
      subjectName: l.subject?.subjectName,
      submittedAt: l.submittedAt,
    }))),
  },
  {
    method: 'get',
    test: (p) => /^\/parent\/lessons\/\d+$/.test(p),
    respond: (_, path) => {
      const id = Number(path.split('/')[3]);
      return ok(MOCK_LESSONS.find((l) => l.lessonId === id) || MOCK_LESSONS[0]);
    },
  },
  {
    method: 'put',
    test: (p) => /^\/parent\/lessons\/\d+\/confirm/.test(p),
    respond: () => ok({ success: true, lessonId: 0, bookingId: 0 }),
  },
  {
    method: 'get',
    test: (p) => p === '/parent/lessons/calendar',
    respond: () => ok([]),
  },
  {
    method: 'post',
    test: (p) => /^\/parent\/lessons\/\d+\/dispute/.test(p),
    respond: () => ok({ disputeId: 99, status: 'open' }),
  },
  {
    method: 'get',
    test: (p) => p === '/parent/disputes',
    respond: () => ok([]),
  },
  {
    method: 'post',
    test: (p) => /^\/parent\/lessons\/\d+\/no-show/.test(p),
    respond: () => ok({ success: true }),
  },

  // ── Student lessons ──────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/student/lessons',
    respond: () => ok({ items: MOCK_LESSONS, totalCount: MOCK_LESSONS.length }),
  },
  {
    method: 'get',
    test: (p) => p === '/studentlesson/pending',
    respond: () => ok([]),
  },
  {
    method: 'get',
    test: (p) => p === '/student/lessons/calendar',
    respond: () => ok([]),
  },
  {
    method: 'put',
    test: (p) => /\/student\/lessons\/\d+\/confirm/.test(p),
    respond: () => ok({ success: true }),
  },
  {
    method: 'get',
    test: (p) => p === '/student/disputes',
    respond: () => ok([]),
  },

  // ── Students (parent portal) ─────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/parent/students',
    respond: () => ok(MOCK_STUDENTS),
  },
  {
    method: 'post',
    test: (p) => p === '/parent/students',
    respond: (config) => {
      const body = parseBody(config);
      return ok({ ...MOCK_STUDENTS[0], studentId: 'mock-student-new', fullName: body.fullName || 'Hoc sinh moi' });
    },
  },
  {
    method: 'delete',
    test: (p) => /^\/parent\/students\/[^/]+$/.test(p),
    respond: () => ok(null),
  },
  {
    method: 'put',
    test: (p) => /^\/parent\/students\/[^/]+$/.test(p),
    respond: () => ok(MOCK_STUDENTS[0]),
  },
  {
    method: 'post',
    test: (p) => /\/parent\/students\/[^/]+\/generate-code/.test(p),
    respond: () => ok({ ...MOCK_STUDENTS[0], linkCode: 'LINK-MOCK-001' }),
  },
  {
    method: 'post',
    test: (p) => p === '/parent/students/link',
    respond: () => ok(MOCK_STUDENTS[0]),
  },
  {
    method: 'get',
    test: (p) => p === '/parent/code',
    respond: () => ok({ parentCode: 'PARENT-MOCK-001' }),
  },
  {
    method: 'get',
    test: (p) => p === '/student/link-status',
    respond: () => ok({ isLinked: true, parentName: 'Nguyen Thi Huong', parentId: 'mock-parent-001' }),
  },
  {
    method: 'post',
    test: (p) => p === '/student/link',
    respond: () => ok(MOCK_STUDENTS[0]),
  },
  {
    method: 'get',
    test: (p) => p === '/parent/bookings',
    respond: () => ok({ items: MOCK_BOOKINGS, totalCount: MOCK_BOOKINGS.length }),
  },

  // ── Wallet ───────────────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/wallet/balance',
    respond: () => ok(MOCK_WALLET),
  },
  {
    method: 'get',
    test: (p) => p === '/wallet/transactions',
    respond: () => ok(MOCK_TRANSACTIONS),
  },
  {
    method: 'post',
    test: (p) => p === '/wallet/deposit' || p.startsWith('/wallet/withdraw'),
    respond: () => ok({ success: true }),
  },

  // ── Notifications ────────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/notifications/mine/unread-count',
    respond: () => ({ unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.isread).length }),
  },
  {
    method: 'get',
    test: (p) => p === '/notifications/mine/unread',
    respond: () => MOCK_NOTIFICATIONS.filter((n) => !n.isread),
  },
  {
    method: 'get',
    test: (p) => p === '/notifications/mine',
    respond: () => MOCK_NOTIFICATIONS,
  },
  {
    method: '*',
    test: (p) => p.startsWith('/notifications/'),
    respond: () => ok(null),
  },

  // ── Admin Dashboard ──────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/admin/dashboard',
    respond: () => ok(MOCK_ADMIN_DASHBOARD),
  },
  {
    method: 'get',
    test: (p) => p === '/admin/dashboard/revenue',
    respond: () => ok(MOCK_ADMIN_REVENUE_CHART),
  },
  {
    method: 'get',
    test: (p) => p === '/admin/dashboard/user-growth',
    respond: () => ok(MOCK_ADMIN_USER_GROWTH),
  },
  {
    method: 'get',
    test: (p) => p === '/admin/dashboard/activities',
    respond: () => ok(MOCK_ADMIN_ACTIVITIES),
  },

  // ── Admin Vetting ────────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/tutors/pending',
    respond: () => ok(MOCK_PENDING_TUTORS),
  },
  {
    method: 'get',
    test: (p) => /^\/admin\/tutors\/[^/]+\/review/.test(p),
    respond: () => ok({ ...MOCK_PENDING_TUTORS[0], bio: 'Gia su co nhieu kinh nghiem', education: 'DH Bach Khoa', certificates: [] }),
  },
  {
    method: '*',
    test: (p) => /^\/admin\/tutors\/[^/]+\/(approve|reject|verify)/.test(p),
    respond: () => ok({ success: true, message: 'Da xu ly' }),
  },
  {
    method: 'put',
    test: (p) => /^\/admin\/tutors\/[^/]+\/approval/.test(p),
    respond: () => ok({ success: true }),
  },

  // ── Admin User Management ────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/admin/users',
    // service reads data.content as array with lowercase keys (u.userid, u.fullname, etc.)
    respond: () => ok(MOCK_ADMIN_USERS),
  },
  {
    method: 'get',
    test: (p) => /^\/admin\/users\/[^/]+$/.test(p),
    respond: () => ok({ ...MOCK_ADMIN_USERS[0], phone: '0901000001', createdAt: '2025-01-01T00:00:00Z', isBlocked: false }),
  },
  {
    method: '*',
    test: (p) => /^\/admin\/users\/[^/]+\/(block|unblock|deactivate)/.test(p),
    respond: () => ok({ success: true }),
  },
  {
    method: 'put',
    test: (p) => /^\/admin\/users\/[^/]+$/.test(p),
    respond: () => ok(MOCK_ADMIN_USERS[0]),
  },

  // ── Admin Disputes ───────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/admin/disputes/stats',
    respond: () => ok({ totalDisputes: 2, openDisputes: 1, underReviewDisputes: 1, resolvedDisputes: 0, totalAmountDisputed: 1300000 }),
  },
  {
    method: 'get',
    test: (p) => p === '/admin/disputes',
    // service reads data.content as array directly (data.content || [])
    respond: () => ok(MOCK_ADMIN_DISPUTES),
  },
  {
    method: 'get',
    test: (p) => /^\/admin\/disputes\/\d+$/.test(p),
    respond: () => ok({ ...MOCK_ADMIN_DISPUTES[0], lessonId: 1001, timeline: [] }),
  },
  {
    method: '*',
    test: (p) => /^\/admin\/disputes\/\d+\/(resolve|investigate)/.test(p),
    respond: () => ok({ success: true }),
  },

  // ── Admin Warnings ───────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/admin/warnings/suspensions',
    // component reads response?.content ?? response; if Array → setSuspensions(content)
    respond: () => ok([]),
  },
  {
    method: 'get',
    test: (p) => /^\/admin\/warnings\/users\/[^/]+$/.test(p),
    respond: (_, path) => {
      const userId = path.split('/').pop();
      return ok({ userId, fullName: 'Demo User', email: 'demo@demo.vn', totalWarnings: 0, level1Warnings: 0, level2Warnings: 0, warningsLast30Days: 0, isSuspended: false, warnings: [] });
    },
  },
  {
    method: '*',
    test: (p) => p.startsWith('/admin/warnings') || p.startsWith('/admin/suspensions'),
    respond: () => ok({ success: true }),
  },

  // ── Admin Financials ─────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/admin/financials' || p === '/admin/financial/metrics',
    respond: () => ok({
      totalRevenue: 24250000,
      totalGMV: 485000000,
      escrowBalance: 85000000,
      pendingWithdrawals: 12500000,
      revenueGrowth: 12.5,
    }),
  },
  {
    method: 'get',
    test: (p) => p.startsWith('/admin/withdrawals'),
    respond: () => ok({ withdrawals: [], totalCount: 0 }),
  },
  {
    method: 'get',
    test: (p) => p.startsWith('/admin/transactions'),
    respond: () => ok({ transactions: [], totalCount: 0 }),
  },
  {
    method: '*',
    test: (p) => /\/admin\/withdrawals\/[^/]+\/(approve|reject)/.test(p),
    respond: () => ok({ success: true }),
  },

  // ── Admin Payout ─────────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/admin/payouts/overview',
    respond: () => ok(MOCK_PAYOUT_OVERVIEW),
  },
  {
    method: 'get',
    test: (p) => p === '/admin/payouts/pending',
    respond: () => ok({ items: MOCK_PAYOUT_REQUESTS.filter((r) => r.status === 'pending'), total: MOCK_PAYOUT_REQUESTS.filter((r) => r.status === 'pending').length }),
  },
  {
    method: 'get',
    test: (p) => p === '/admin/payouts/fraud-logs',
    respond: () => ok({ items: [], total: 0, page: 1, pageSize: 20 }),
  },
  {
    method: 'get',
    test: (p) => p === '/admin/payouts',
    respond: () => ok({ items: MOCK_PAYOUT_REQUESTS, total: MOCK_PAYOUT_REQUESTS.length }),
  },
  {
    method: 'get',
    test: (p) => /^\/admin\/payouts\/\d+$/.test(p),
    respond: (_, path) => {
      const id = Number(path.split('/').pop());
      const req = MOCK_PAYOUT_REQUESTS.find((r) => r.id === id) || MOCK_PAYOUT_REQUESTS[0];
      return ok({ ...req, fraudChecks: [], timeline: [] });
    },
  },
  {
    method: '*',
    test: (p) => p.startsWith('/admin/payouts'),
    respond: () => ok({ success: true }),
  },

  // ── Admin Bookings ───────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/admin/bookings',
    // adminBooking.service: returns response.data as ApiResponse<AdminBookingListResponse>
    // component reads response.content.items and response.content.totalCount
    respond: () => ok({ items: MOCK_ADMIN_BOOKINGS, totalCount: MOCK_ADMIN_BOOKINGS.length, page: 1, pageSize: 20 }),
  },
  {
    method: 'get',
    test: (p) => /^\/admin\/bookings\/\d+$/.test(p),
    respond: (_, path) => {
      const id = Number(path.split('/').pop());
      const b = MOCK_ADMIN_BOOKINGS.find((x) => x.bookingId === id) || MOCK_ADMIN_BOOKINGS[0];
      return ok({ ...b, schedule: [{ dayOfWeek: 2, startTime: '19:00', endTime: '21:00' }], lessons: [], notes: null });
    },
  },

  // ── Admin Settings ───────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/admin/subjects',
    respond: () => ok([
      { subjectId: 1, subjectName: 'Toan' },
      { subjectId: 3, subjectName: 'Tieng Anh' },
      { subjectId: 4, subjectName: 'Hoa hoc' },
      { subjectId: 5, subjectName: 'Ngu van' },
      { subjectId: 6, subjectName: 'Tin hoc' },
    ]),
  },
  {
    method: 'get',
    test: (p) => p === '/admin/platform-config',
    respond: () => ok({ platformFeeRate: 5, trialEnabled: true }),
  },
  {
    method: '*',
    test: (p) => p.startsWith('/admin/'),
    respond: () => ok({ success: true }),
  },

  // ── Tutor Finance ────────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/tutor/finance/summary',
    respond: () => ok(MOCK_TUTOR_FINANCE.summary),
  },
  {
    method: 'get',
    test: (p) => p === '/tutor/finance/earnings',
    respond: () => ok(MOCK_TUTOR_FINANCE.earnings),
  },
  {
    method: 'get',
    test: (p) => p.startsWith('/tutor/finance/'),
    respond: () => ok({ transactions: [], totalCount: 0 }),
  },
  {
    method: 'post',
    test: (p) => p === '/tutor/finance/withdraw',
    respond: () => ok({ withdrawalId: 'wd-mock', status: 'pending', message: 'Yeu cau rut tien da gui' }),
  },

  // ── Tutor bank & withdrawals ─────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/tutor/bank',
    respond: () => ok({ bankName: 'Vietcombank', accountNumber: '1234567890', accountHolder: 'TRAN THI BINH', branch: 'TP.HCM' }),
  },
  {
    method: 'put',
    test: (p) => p === '/tutor/bank',
    respond: (config) => ok({ ...parseBody(config), message: 'Cap nhat thanh cong' }),
  },
  {
    method: 'get',
    test: (p) => p === '/tutor/withdrawals',
    respond: () => ok({ items: [], totalCount: 0, page: 1, pageSize: 10 }),
  },
  {
    method: 'post',
    test: (p) => p === '/tutor/withdrawals',
    respond: () => ok({ withdrawalId: 'wd-mock-new', amount: 0, status: 'pending', createdAt: new Date().toISOString() }),
  },
  {
    method: 'get',
    test: (p) => /^\/tutor\/withdrawals\/[^/]+$/.test(p),
    respond: () => ok({ withdrawalId: 'wd-mock', amount: 2000000, status: 'pending', createdAt: new Date().toISOString(), bankName: 'Vietcombank', accountNumber: '1234567890' }),
  },
  {
    method: 'delete',
    test: (p) => /^\/tutor\/withdrawals\/[^/]+$/.test(p),
    respond: () => ok(null),
  },

  // ── Bank verification ────────────────────────────────────
  {
    method: '*',
    test: (p) => p.startsWith('/bank/') || p.startsWith('/bank-verification'),
    respond: () => ok({ verified: true, bankName: 'Vietcombank', accountNumber: '1234567890' }),
  },

  // ── Chat ─────────────────────────────────────────────────
  {
    method: 'get',
    test: (p) => p === '/chat/channels',
    respond: () => ok([
      {
        channelId: 1,
        bookingId: 201,
        otherUserId: 'mock-tutor-002',
        otherUserName: 'Tran Thi Binh',
        otherUserAvatarUrl: 'https://i.pravatar.cc/150?img=5',
        status: 'active',
        lastMessageAt: new Date(Date.now() - 3_600_000).toISOString(),
        lastMessagePreview: 'Buoi hoc toi nha ban chuan bi khuon kho nhe!',
        unreadCount: 1,
      },
      {
        channelId: 2,
        bookingId: 203,
        otherUserId: 'mock-tutor-003',
        otherUserName: 'Le Hong Cuong',
        otherUserAvatarUrl: 'https://i.pravatar.cc/150?img=12',
        status: 'active',
        lastMessageAt: new Date(Date.now() - 86_400_000).toISOString(),
        lastMessagePreview: 'Da xac nhan lich hoc Chu Nhat nhe.',
        unreadCount: 0,
      },
    ]),
  },
  {
    method: 'get',
    test: (p) => /^\/chat\/channels\/\d+\/messages$/.test(p),
    respond: () => ok({
      items: [
        { messageId: 1, channelId: 1, senderId: 'mock-tutor-002', senderName: 'Tran Thi Binh', content: 'Chao em, buoi hoc toi 19h nhe!', messageType: 'text', createdAt: new Date(Date.now() - 7_200_000).toISOString(), isRead: true },
        { messageId: 2, channelId: 1, senderId: 'mock-parent-001', senderName: 'Nguyen Thi Huong', content: 'Da co a, em se nhac chau!', messageType: 'text', createdAt: new Date(Date.now() - 3_700_000).toISOString(), isRead: true },
        { messageId: 3, channelId: 1, senderId: 'mock-tutor-002', senderName: 'Tran Thi Binh', content: 'Buoi hoc toi nha ban chuan bi khuon kho nhe!', messageType: 'text', createdAt: new Date(Date.now() - 3_600_000).toISOString(), isRead: false },
      ],
      totalCount: 3,
    }),
  },
  {
    method: 'get',
    test: (p) => p === '/chat/unread-total-count',
    respond: () => ok({ totalUnread: 1 }),
  },
  {
    method: 'put',
    test: (p) => /^\/chat\/channels\/\d+\/read$/.test(p),
    respond: () => ok(null),
  },
  {
    method: 'post',
    test: (p) => /^\/chat\/channels\/\d+\/messages$/.test(p),
    respond: (config) => {
      const body = parseBody(config);
      return ok({ messageId: Date.now(), channelId: 1, senderId: 'mock-parent-001', content: body.content || '', messageType: 'text', createdAt: new Date().toISOString(), isRead: false });
    },
  },
  {
    method: 'post',
    test: (p) => /^\/chat\/channels\/\d+\/images$/.test(p),
    respond: () => ok({ messageId: Date.now(), messageType: 'image', content: 'https://i.pravatar.cc/300', createdAt: new Date().toISOString() }),
  },
  {
    method: 'post',
    test: (p) => p === '/chat/channels' || p.startsWith('/chat/channels'),
    respond: () => ok({ channelId: 99 }),
  },
  {
    method: '*',
    test: (p) => p.startsWith('/channels') || p.startsWith('/messages'),
    respond: () => ok({ items: [], totalCount: 0 }),
  },

  // ── Feedback ─────────────────────────────────────────────
  {
    method: '*',
    test: (p) => p.startsWith('/feedbacks') || p.startsWith('/feedback'),
    respond: (_, path) => {
      if (path.endsWith('/stats')) return ok({ averageRating: 4.8, totalFeedbacks: 89, distribution: { 5: 70, 4: 15, 3: 4, 2: 0, 1: 0 } });
      if (path.includes('/eligibility/')) return ok({ eligible: false, reason: 'Da danh gia' });
      return ok({ feedbacks: [], totalCount: 0 });
    },
  },

  // ── Certificates ─────────────────────────────────────────
  {
    method: 'get',
    test: (p) => /\/tutors\/[^/]+\/certificates/.test(p),
    respond: () => ok([]),
  },
  {
    method: '*',
    test: (p) => p.startsWith('/certificates'),
    respond: () => ok({ success: true }),
  },

  // ── Availability ─────────────────────────────────────────
  {
    method: '*',
    test: (p) => p.startsWith('/availability') || /\/tutors\/[^/]+\/availability/.test(p),
    respond: () => ok([]),
  },

  // ── Payment callback ─────────────────────────────────────
  {
    method: '*',
    test: (p) => p.startsWith('/payment'),
    respond: () => ok({ success: true }),
  },

  // ── Tutor profile updates ─────────────────────────────────
  {
    method: '*',
    test: (p) => /\/tutors\/[^/]+\//.test(p),
    respond: () => ok({ success: true }),
  },

  // ── Fallback ─────────────────────────────────────────────
  {
    method: '*',
    test: () => true,
    respond: (config) => {
      console.warn('[MOCK] No specific handler for:', config.method?.toUpperCase(), config.url);
      return ok(null);
    },
  },
];

// ── Resolve function ─────────────────────────────────────────

export function resolveMockResponse(config: InternalAxiosRequestConfig): unknown {
  const path = extractPath(config.url);
  const method = (config.method || 'get').toLowerCase();

  for (const handler of MOCK_HANDLERS) {
    const methodMatch = handler.method === '*' || handler.method === method;
    if (methodMatch && handler.test(path)) {
      return handler.respond(config, path);
    }
  }

  return ok(null);
}
