import type {
    DashboardMetrics,
    RevenueChartData,
    UserGrowthChartData,
    RecentActivity,
} from '../../types/admin.types';

/**
 * Mock data for Admin Dashboard
 * Used for development and testing before backend integration
 */

// ============================================
// MOCK DASHBOARD METRICS
// ============================================

export const mockDashboardMetrics: DashboardMetrics = {
    totalusers: 12450,
    totalstudents: 8320,
    totaltutors: 4130,
    activebookings: 156,
    pendingreview: 42,
    urgentreviews: 5,
    activedisputes: 8,
    totalgmv: 1423000000, // VND - Gross Merchandise Value (all booking revenue)
    netrevenue: 213450000, // VND - Platform fees collected
    escrowbalance: 45600000, // VND - Money held in escrow
    monthlyrevenue: 142300000, // VND
    monthlygrowth: 5.2,
    usergrowth: 12.0,
};

// ============================================
// MOCK REVENUE CHART DATA (Last 30 days)
// ============================================

const generateLast30Days = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date);
    }
    return dates;
};

const generateRevenueData = (): number[] => {
    // Simulate realistic revenue fluctuation
    const baseRevenue = 7000000; // 7M VND per day average
    const data: number[] = [];

    for (let i = 0; i < 30; i++) {
        // Add randomness ±30%
        const variance = (Math.random() - 0.5) * 0.6;
        const dayRevenue = baseRevenue * (1 + variance);

        // Weekend boost (Saturday, Sunday)
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dayOfWeek = date.getDay();
        const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1.0;

        data.push(Math.round(dayRevenue * weekendMultiplier));
    }

    return data;
};

export const mockRevenueChartData: RevenueChartData[] = (() => {
    const dates = generateLast30Days();
    const revenues = generateRevenueData();

    return dates.map((date, index) => ({
        date: date.toISOString().split('T')[0], // YYYY-MM-DD
        revenue: revenues[index],
        displaydate: `${date.getDate()}/${date.getMonth() + 1}`,
    }));
})();

// ============================================
// MOCK USER GROWTH CHART DATA (Last 6 months)
// ============================================

const getLast6Months = (): { month: string; year: number }[] => {
    const months: { month: string; year: number }[] = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthNames = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
        months.push({
            month: monthNames[date.getMonth()],
            year: date.getFullYear(),
        });
    }

    return months;
};

export const mockUserGrowthChartData: UserGrowthChartData[] = (() => {
    const months = getLast6Months();

    // Simulate growing user base
    let studentCount = 7000;
    let tutorCount = 3200;

    return months.map((m, index) => {
        // Gradual growth each month
        studentCount += Math.round(200 + Math.random() * 400);
        tutorCount += Math.round(100 + Math.random() * 200);

        return {
            month: m.month,
            students: studentCount,
            tutors: tutorCount,
            totalusers: studentCount + tutorCount,
        };
    });
})();

// ============================================
// MOCK RECENT ACTIVITIES
// ============================================

export const mockRecentActivities: RecentActivity[] = [
    {
        activityid: 'ACT-001',
        activitytype: 'tutor_approved',
        description: 'Gia sư Nguyễn Văn A đã được phê duyệt',
        performedby: 'Admin Trần',
        affecteduserid: 'TUT-001',
        affectedusername: 'Nguyễn Văn A',
        createdat: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        metadata: {
            tutorsubjects: ['Toán học', 'Vật lý'],
        },
    },
    {
        activityid: 'ACT-002',
        activitytype: 'dispute_resolved',
        description: 'Khiếu nại #8821 đã được giải quyết - Hoàn tiền 100%',
        performedby: 'Admin Nguyễn',
        affecteduserid: 'STU-001',
        affectedusername: 'Nguyễn Minh Anh',
        createdat: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
        metadata: {
            disputeid: '8821',
            resolution: 'refund_100',
        },
    },
    {
        activityid: 'ACT-003',
        activitytype: 'withdrawal_approved',
        description: 'Rút tiền 5,000,000 VND đã được phê duyệt',
        performedby: 'Admin Lê',
        affecteduserid: 'TUT-002',
        affectedusername: 'Trần Văn Hùng',
        createdat: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
        metadata: {
            amount: 5000000,
            withdrawalid: 'WD-001',
        },
    },
    {
        activityid: 'ACT-004',
        activitytype: 'tutor_rejected',
        description: 'Gia sư Lê Thị B đã bị từ chối - Thiếu chứng chỉ',
        performedby: 'Admin Phạm',
        affecteduserid: 'TUT-003',
        affectedusername: 'Lê Thị B',
        createdat: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        metadata: {
            rejectreason: 'Thiếu chứng chỉ giảng dạy hợp lệ',
        },
    },
    {
        activityid: 'ACT-005',
        activitytype: 'user_blocked',
        description: 'Người dùng Hoàng Văn C đã bị khóa tài khoản',
        performedby: 'Admin Vũ',
        affecteduserid: 'USR-001',
        affectedusername: 'Hoàng Văn C',
        createdat: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        metadata: {
            reason: 'Vi phạm chính sách nhiều lần',
        },
    },
    {
        activityid: 'ACT-006',
        activitytype: 'tutor_approved',
        description: 'Gia sư Phạm Thị D đã được phê duyệt',
        performedby: 'Admin Trần',
        affecteduserid: 'TUT-004',
        affectedusername: 'Phạm Thị D',
        createdat: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
        metadata: {
            tutorsubjects: ['Hóa học', 'Sinh học'],
        },
    },
    {
        activityid: 'ACT-007',
        activitytype: 'warning_issued',
        description: 'Cảnh báo đã được gửi đến gia sư Nguyễn Thị E',
        performedby: 'Admin Đỗ',
        affecteduserid: 'TUT-005',
        affectedusername: 'Nguyễn Thị E',
        createdat: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hours ago
        metadata: {
            severity: 'medium',
            reason: 'Đến trễ buổi học 2 lần',
        },
    },
    {
        activityid: 'ACT-008',
        activitytype: 'withdrawal_rejected',
        description: 'Rút tiền 2,000,000 VND đã bị từ chối',
        performedby: 'Admin Lê',
        affecteduserid: 'TUT-006',
        affectedusername: 'Võ Văn F',
        createdat: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
        metadata: {
            amount: 2000000,
            reason: 'Thông tin ngân hàng không khớp',
        },
    },
    {
        activityid: 'ACT-009',
        activitytype: 'dispute_resolved',
        description: 'Khiếu nại #8822 đã được giải quyết - Hoàn tiền 50%',
        performedby: 'Admin Nguyễn',
        affecteduserid: 'STU-002',
        affectedusername: 'Lê Thị Hương',
        createdat: new Date(Date.now() - 1000 * 60 * 420).toISOString(), // 7 hours ago
        metadata: {
            disputeid: '8822',
            resolution: 'refund_50',
        },
    },
    {
        activityid: 'ACT-010',
        activitytype: 'tutor_approved',
        description: 'Gia sư Đặng Văn G đã được phê duyệt',
        performedby: 'Admin Trần',
        affecteduserid: 'TUT-007',
        affectedusername: 'Đặng Văn G',
        createdat: new Date(Date.now() - 1000 * 60 * 480).toISOString(), // 8 hours ago
        metadata: {
            tutorsubjects: ['Tiếng Anh', 'Văn học'],
        },
    },
];

// ============================================
// MOCK API FUNCTIONS
// ============================================

const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get dashboard metrics
 */
export const mockGetDashboardMetrics = async (): Promise<DashboardMetrics> => {
    await delay(600);
    return mockDashboardMetrics;
};

/**
 * Get revenue chart data
 */
export const mockGetRevenueChart = async (days: number = 30): Promise<RevenueChartData[]> => {
    await delay(700);

    if (days !== 30) {
        // If different range requested, slice the data
        return mockRevenueChartData.slice(-days);
    }

    return mockRevenueChartData;
};

/**
 * Get user growth chart data
 */
export const mockGetUserGrowthChart = async (months: number = 6): Promise<UserGrowthChartData[]> => {
    await delay(700);

    if (months !== 6) {
        return mockUserGrowthChartData.slice(-months);
    }

    return mockUserGrowthChartData;
};

/**
 * Get recent activities
 */
export const mockGetRecentActivities = async (limit: number = 10): Promise<RecentActivity[]> => {
    await delay(500);
    return mockRecentActivities.slice(0, limit);
};
