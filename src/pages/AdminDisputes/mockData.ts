import type {
    DisputeForAdmin,
    DisputeDetail,
    BookingInfo,
    LessonInfo,
    TutorWarning,
} from '../../types/admin.types';

/**
 * Mock data for Admin Disputes Module
 * Used for development and testing before backend integration
 */

// ============================================
// MOCK DISPUTE LIST DATA
// ============================================

export const mockDisputes: DisputeForAdmin[] = [
    {
        disputeid: '8821',
        bookingid: 'BK-1001',
        disputetype: 'no_show_tutor',
        status: 'pending',
        priority: 'high',
        filedby: 'student',
        studentname: 'Nguyễn Minh Anh',
        studentavatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6nPy0_cZA794Sg0K6k7-mZMsB-Mq_jr8XELGDnDjPPsLfmrhcV1NDh_qlM4AWYj-orlbdH8cmxG7gXgcKNmGKbHbY6JNwMe4j1B_Q-Z7JSv6El5lnrRdRA7pm33EOE_aLhD-TWTdV-YLqcTbCl3a4R2uuPqNNzvLCRuGUqpAhFJiE7dpXUxtIYqm-evHUMeTuJZyNGC5f38sovWYKkpfaXTGDM_w-Og3LpcJ6UboTtdZuhvEsYhagQp4IfhHvJKwDsnIaYMgtrm4',
        tutorname: 'Trần Văn Hùng',
        tutoravatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfoPTqviyQwfEXTgibH4wMRXkJD6CN5H2GH6xtjpn3E2nlgadR4YcLpz_kpxv_BG43eqpj6koea1XRsQNJSPU-XOleaLq5dYlPwXqm3iVs65w7_0ixup07F0wxHdX0lbhLf8ZU1S1VvWUzh9LRSd8UJbUeUZr3ezKZOIdEAQBDQ_w4HAbodf1qfJiXm9vTrewxtSQduiB86tbj0DL5XT8A2h8R2gJ8oQbf_yRlBQP4g7qtAHdf2gDfxRKyy5LyUHRoyioarN-oy4w',
        escrowamount: 500000,
        createdat: '2024-01-20T10:00:00Z',
        deadlineat: '2024-01-23T10:00:00Z',
    },
    {
        disputeid: '8822',
        bookingid: 'BK-1002',
        disputetype: 'poor_quality',
        status: 'investigating',
        priority: 'medium',
        filedby: 'student',
        studentname: 'Lê Thị Hương',
        studentavatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4ZkjNRJFYQ5d44SUKMdNbhGHwlaQbTvXu6muMXS06rK0aVxYP780rruPH-XcXfgv2y0FFqRgmCYv8glTMPISlctepzpUwANlHi2L0qWQDbhC8_bDwy5ggytDc7VUFq8EmxKVZjPRnXOVwcgqsq9FCEDFD_4IV29HxviNkgkefs4jEFKIfrovLSZqkKwtF0hZ9hc-HdYdz56qetY6gU0kY8piGRS1v0GiXk0TdyIN2VUe0SyYOUa6USEQZKh3qAlOIK4emGgm-nTs',
        tutorname: 'Phạm Minh Tuấn',
        tutoravatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgGVmiMa1qOpPl9ptdzQmoDOvRv81iK__Lau7oXY35Hqed699ccruST3HLpnAMp3WlqMTb7zYb1-h0qfuKV9IsGZnxHmY7n6iefXknJzQNVDyjF8kumQ8J_m4icZqU8xOkRrOROSijpdgfJMVnCVe70oyoPBUCIFJF8Kd1kppqA1bc7r2XBJE450VchjmKDRkOGcqirsPk1-zHHuhck8iKU51odEqRY9uulyEoruIju4pXIkbh_t_Xqz4AMiAr2rZGDJWpz0QzpyY',
        escrowamount: 300000,
        createdat: '2024-01-21T14:30:00Z',
        deadlineat: '2024-01-26T14:30:00Z',
    },
    {
        disputeid: '8823',
        bookingid: 'BK-1003',
        disputetype: 'inappropriate_behavior',
        status: 'pending',
        priority: 'high',
        filedby: 'student',
        studentname: 'Hoàng Văn Đức',
        studentavatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXH0JZiBytEovqHxhoTP7ycg5FCGsD3jhOi1e3TmhKKGDiwzurTOcqS4lTKZV8PaZTxHLdnIQ_Xn_tgl0-lU0NNPXNfrCn3O5T8Y_FTx2l-DMpVsohxsowHZSTd2FM5WkDAZZyuUV1mGKMMGVoS9iKcn2G7qKfqeW0wsv4r9X6VsPTupbLu7mky6himXAtv25ihSi3NpcSx-pUNxWz5GGQLBQKgb7cEY4b_rPmoefsbnhBE3EYFIOmJ9fUTWSoaHnpxWvPGhJ8Heo',
        tutorname: 'Nguyễn Thị Lan',
        tutoravatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMBrilX3h5Zs6XdyMjSCYGqJO_4gM3TLx6vbZtPLycGNYtfEO4cYD9lY8VVI0dwD-nJilY0gHxA-j1evOJYhy4GOPwUVcCs-i1krQmX8HuAf_zXDAfcMqpDIQWWt8GfWeFdOf2NLBThkjHseWDV3277IO8WrJojWT2eYuiyAg9nPspFFyDJWGL5IE5jWAt_ahFm5Mr2vh3SeUniGNFvJj-mQOGXw2fSb2MnC2FMCJkriNgS4xHQhIMPtR2wykda8VIaG4kYr7kKN8',
        escrowamount: 1200000,
        createdat: '2024-01-22T09:15:00Z',
        deadlineat: '2024-01-23T09:15:00Z',
    },
];

// ============================================
// MOCK DETAILED DISPUTE DATA
// ============================================

const mockBookingInfo: BookingInfo = {
    bookingid: 'BK-1001',
    studentid: 'STU-001',
    studentname: 'Nguyễn Minh Anh',
    studentavatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6nPy0_cZA794Sg0K6k7-mZMsB-Mq_jr8XELGDnDjPPsLfmrhcV1NDh_qlM4AWYj-orlbdH8cmxG7gXgcKNmGKbHbY6JNwMe4j1B_Q-Z7JSv6El5lnrRdRA7pm33EOE_aLhD-TWTdV-YLqcTbCl3a4R2uuPqNNzvLCRuGUqpAhFJiE7dpXUxtIYqm-evHUMeTuJZyNGC5f38sovWYKkpfaXTGDM_w-Og3LpcJ6UboTtdZuhvEsYhagQp4IfhHvJKwDsnIaYMgtrm4',
    studentjoinedat: '2023-06-15T00:00:00Z',
    tutorid: 'TUT-001',
    tutorname: 'Trần Văn Hùng',
    tutoravatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfoPTqviyQwfEXTgibH4wMRXkJD6CN5H2GH6xtjpn3E2nlgadR4YcLpz_kpxv_BG43eqpj6koea1XRsQNJSPU-XOleaLq5dYlPwXqm3iVs65w7_0ixup07F0wxHdX0lbhLf8ZU1S1VvWUzh9LRSd8UJbUeUZr3ezKZOIdEAQBDQ_w4HAbodf1qfJiXm9vTrewxtSQduiB86tbj0DL5XT8A2h8R2gJ8oQbf_yRlBQP4g7qtAHdf2gDfxRKyy5LyUHRoyioarN-oy4w',
    tutorrating: 4.8,
    tutortotalclasses: 156,
    subjectname: 'Toán học',
    gradelevel: 'Lớp 12',
    scheduleddate: '2024-01-20T14:00:00Z',
    durationminutes: 90,
    totalprice: 500000,
    bookingstatus: 'disputed',
    paymentstatus: 'escrowed',
};

const mockLessonInfo: LessonInfo = {
    lessonid: 'LSN-001',
    scheduledstarttime: '2024-01-20T14:00:00Z',
    scheduledendtime: '2024-01-20T15:30:00Z',
    actualstarttime: null,
    actualendtime: null,
    lessonstatus: 'cancelled',
    tutorarrived: false,
    studentarrived: true,
    studentwaitedminutes: 30,
};

const mockTutorWarnings: TutorWarning[] = [
    {
        warningid: 'WARN-001',
        tutorid: 'TUT-001',
        reason: 'Vắng mặt buổi học mà không báo trước',
        severity: 'high',
        issuedby: 'Admin Nguyễn',
        issuedat: '2024-01-10T10:00:00Z',
        relatedbookingid: 'BK-0999',
    },
    {
        warningid: 'WARN-002',
        tutorid: 'TUT-001',
        reason: 'Bắt đầu buổi học muộn 15 phút',
        severity: 'low',
        issuedby: 'Admin Trần',
        issuedat: '2023-12-05T09:00:00Z',
        relatedbookingid: 'BK-0888',
    },
];

export const mockDisputeDetails: Record<string, DisputeDetail> = {
    '8821': {
        // Basic dispute info
        disputeid: '8821',
        bookingid: 'BK-1001',
        disputetype: 'no_show_tutor',
        status: 'pending',
        priority: 'high',
        filedby: 'student',
        description: 'Gia sư không xuất hiện trong buổi học lúc 2:00 PM. Tôi đã đợi 30 phút nhưng không thấy gia sư tham gia. Tôi có công việc quan trọng và không thể đợi thêm.',
        evidencefiles: JSON.stringify([
            {
                filename: 'screenshot_waiting_room.png',
                fileurl: 'https://via.placeholder.com/800x600/f1f5f9/334155?text=Waiting+Room+Screenshot',
                filetype: 'image/png',
                filesize: 125340,
                uploadedat: '2024-01-20T14:35:00Z',
            },
            {
                filename: 'chat_log.pdf',
                fileurl: '#',
                filetype: 'application/pdf',
                filesize: 45120,
                uploadedat: '2024-01-20T14:40:00Z',
            },
        ]),
        screenshots: JSON.stringify([
            'https://via.placeholder.com/800x600/e0f2fe/0369a1?text=Screenshot+1:+Empty+Classroom',
            'https://via.placeholder.com/800x600/fef3c7/92400e?text=Screenshot+2:+Time+Stamp',
        ]),
        adminresponse: null,
        resolutiontype: null,
        createdat: '2024-01-20T14:32:00Z',
        updatedat: '2024-01-20T14:32:00Z',
        resolvedat: null,
        deadlineat: '2024-01-23T14:32:00Z',

        // Context data
        bookingcontext: mockBookingInfo,
        lessoncontext: mockLessonInfo,
        tutorwarnings: mockTutorWarnings,

        // Escrow info
        escrowamount: 500000,
    },
};

// ============================================
// MOCK API FUNCTIONS
// ============================================

/**
 * Simulate network delay
 */
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all disputes (with optional filtering)
 */
export const mockGetDisputes = async (status?: string): Promise<DisputeForAdmin[]> => {
    await delay();

    if (status && status !== 'all') {
        return mockDisputes.filter((d) => d.status === status);
    }

    return mockDisputes;
};

/**
 * Get detailed dispute information
 */
export const mockGetDisputeDetail = async (disputeId: string): Promise<DisputeDetail> => {
    await delay(700);

    const detail = mockDisputeDetails[disputeId];
    if (!detail) {
        throw new Error(`Dispute ${disputeId} not found`);
    }

    return detail;
};

/**
 * Resolve dispute
 */
export const mockResolveDispute = async (
    disputeId: string,
    resolutionType: string,
    adminNotes: string
): Promise<void> => {
    await delay(800);

    console.log(`[MOCK] Resolving dispute ${disputeId}:`, {
        resolutionType,
        adminNotes,
    });

    // Simulate success
    return;
};

/**
 * Issue warning to tutor
 */
export const mockIssueWarning = async (
    disputeId: string,
    tutorId: string,
    reason: string,
    severity: 'low' | 'medium' | 'high'
): Promise<void> => {
    await delay(600);

    console.log(`[MOCK] Issuing warning to tutor ${tutorId}:`, {
        disputeId,
        reason,
        severity,
    });

    // Add warning to mock data
    const newWarning: TutorWarning = {
        warningid: `WARN-${Date.now()}`,
        tutorid: tutorId,
        reason,
        severity,
        issuedby: 'Current Admin',
        issuedat: new Date().toISOString(),
        relatedbookingid: mockDisputeDetails[disputeId]?.bookingid || null,
    };

    mockTutorWarnings.unshift(newWarning);

    return;
};

/**
 * Suspend tutor profile
 */
export const mockSuspendTutor = async (
    tutorId: string,
    reason: string,
    durationDays: number
): Promise<void> => {
    await delay(700);

    console.log(`[MOCK] Suspending tutor ${tutorId} for ${durationDays} days:`, {
        reason,
    });

    return;
};

/**
 * Lock user account
 */
export const mockLockAccount = async (userId: string, reason: string): Promise<void> => {
    await delay(800);

    console.log(`[MOCK] Locking account ${userId}:`, {
        reason,
    });

    return;
};
