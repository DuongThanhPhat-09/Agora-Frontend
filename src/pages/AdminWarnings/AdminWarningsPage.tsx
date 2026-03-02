import React, { useState, useEffect, useCallback } from 'react';
import { Spin, Tag, Input, Empty, Tooltip } from 'antd';
import { getActiveSuspensions, getUserWarnings, unsuspendUser } from '../../services/admin.service';
import { toast } from 'react-toastify';

// ============================================
// Types (matching backend DTOs)
// ============================================
interface SuspensionListItem {
    suspensionId: number;
    userId?: string;
    userName?: string;
    userEmail?: string;
    suspensionType: string;
    reason?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    createdByName?: string;
    timeRemainingDisplay?: string;
    suspensionTypeDisplay?: string;
}

interface WarningHistoryItem {
    warningId: number;
    warningLevel: number;
    reason?: string;
    relatedBookingId?: number;
    createdAt?: string;
    issuedByName?: string;
    warningLevelDisplay?: string;
    warningLevelColor?: string;
}

interface UserWarningSummary {
    userId?: string;
    fullName?: string;
    email?: string;
    totalWarnings: number;
    level1Warnings: number;
    level2Warnings: number;
    warningsLast30Days: number;
    isSuspended: boolean;
    suspensionType?: string;
    suspensionEndDate?: string;
    warnings: WarningHistoryItem[];
}

// ============================================
// Constants
// ============================================
const TABS = [
    { key: 'suspensions', label: 'Đình chỉ đang hoạt động' },
    { key: 'lookup', label: 'Tra cứu cảnh báo' },
] as const;

type TabKey = typeof TABS[number]['key'];

// ============================================
// Component
// ============================================
const AdminWarningsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('suspensions');

    // Suspensions tab state
    const [suspensions, setSuspensions] = useState<SuspensionListItem[]>([]);
    const [suspensionsLoading, setSuspensionsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Lookup tab state
    const [searchUserId, setSearchUserId] = useState('');
    const [warningSummary, setWarningSummary] = useState<UserWarningSummary | null>(null);
    const [lookupLoading, setLookupLoading] = useState(false);

    // Fetch suspensions
    const fetchSuspensions = useCallback(async () => {
        try {
            setSuspensionsLoading(true);
            const response = await getActiveSuspensions(currentPage, pageSize);
            const data = response.data || response;
            if (Array.isArray(data)) {
                setSuspensions(data);
            } else if (data?.items) {
                setSuspensions(data.items);
            } else {
                setSuspensions([]);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách đình chỉ.');
        } finally {
            setSuspensionsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        if (activeTab === 'suspensions') fetchSuspensions();
    }, [activeTab, fetchSuspensions]);

    // Unsuspend handler
    const handleUnsuspend = async (userId: string, userName?: string) => {
        const confirmed = window.confirm(
            `Bạn có chắc muốn gỡ đình chỉ cho ${userName || userId}?`
        );
        if (!confirmed) return;

        try {
            await unsuspendUser(userId);
            toast.success(`Đã gỡ đình chỉ cho ${userName || userId}`);
            fetchSuspensions();
        } catch (error) {
            toast.error('Không thể gỡ đình chỉ. Vui lòng thử lại.');
        }
    };

    // Lookup warnings
    const handleLookup = async () => {
        if (!searchUserId.trim()) {
            toast.warn('Vui lòng nhập User ID.');
            return;
        }
        try {
            setLookupLoading(true);
            const response = await getUserWarnings(searchUserId.trim());
            const data = response.data || response;
            setWarningSummary(data);
        } catch (error: any) {
            if (error?.response?.status === 404) {
                toast.error('Không tìm thấy user.');
            } else {
                toast.error('Lỗi khi tra cứu cảnh báo.');
            }
            setWarningSummary(null);
        } finally {
            setLookupLoading(false);
        }
    };

    // Format date
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1a2238', marginBottom: '4px' }}>
                    ⚠️ Quản lý cảnh báo & đình chỉ
                </h1>
                <p style={{ fontSize: '14px', color: '#666' }}>
                    Xem danh sách đình chỉ đang hoạt động và tra cứu lịch sử cảnh báo theo user
                </p>
            </header>

            {/* Tabs */}
            <div style={{
                display: 'flex', gap: '4px', marginBottom: '20px',
                background: '#f5f5f5', borderRadius: '10px', padding: '4px',
            }}>
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            flex: 1, padding: '10px 16px', borderRadius: '8px', border: 'none',
                            background: activeTab === tab.key ? '#fff' : 'transparent',
                            color: activeTab === tab.key ? '#1a2238' : '#666',
                            fontWeight: activeTab === tab.key ? 600 : 400,
                            fontSize: '14px', cursor: 'pointer',
                            boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'suspensions' && (
                <SuspensionsTab
                    suspensions={suspensions}
                    loading={suspensionsLoading}
                    onUnsuspend={handleUnsuspend}
                    formatDate={formatDate}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            )}

            {activeTab === 'lookup' && (
                <LookupTab
                    searchUserId={searchUserId}
                    onSearchChange={setSearchUserId}
                    onSearch={handleLookup}
                    loading={lookupLoading}
                    summary={warningSummary}
                    formatDate={formatDate}
                />
            )}
        </div>
    );
};

// ============================================
// Suspensions Tab
// ============================================
interface SuspensionsTabProps {
    suspensions: SuspensionListItem[];
    loading: boolean;
    onUnsuspend: (userId: string, userName?: string) => void;
    formatDate: (d?: string) => string;
    currentPage: number;
    onPageChange: (p: number) => void;
}

const SuspensionsTab: React.FC<SuspensionsTabProps> = ({
    suspensions, loading, onUnsuspend, formatDate,
}) => {
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '60px' }}><Spin size="large" /></div>;
    }

    if (suspensions.length === 0) {
        return (
            <div style={{
                textAlign: 'center', padding: '60px', background: '#fff',
                borderRadius: '12px', border: '1px solid rgba(26,34,56,0.06)',
            }}>
                <Empty description="Không có đình chỉ nào đang hoạt động" />
            </div>
        );
    }

    return (
        <div style={{
            background: '#fff', borderRadius: '12px', overflow: 'hidden',
            border: '1px solid rgba(26,34,56,0.06)',
        }}>
            {/* Table Header */}
            <div style={{
                display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1fr 1fr 100px',
                padding: '12px 20px', background: '#fafafa', fontSize: '12px',
                fontWeight: 600, color: '#999', textTransform: 'uppercase',
                borderBottom: '1px solid rgba(26,34,56,0.06)',
            }}>
                <span>Người dùng</span>
                <span>Loại</span>
                <span>Lý do</span>
                <span>Thời hạn</span>
                <span>Còn lại</span>
                <span>Hành động</span>
            </div>

            {/* Rows */}
            {suspensions.map((s) => (
                <div
                    key={s.suspensionId}
                    style={{
                        display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1fr 1fr 100px',
                        padding: '14px 20px', alignItems: 'center',
                        borderBottom: '1px solid rgba(26,34,56,0.04)',
                        fontSize: '13px',
                    }}
                >
                    {/* User */}
                    <div>
                        <div style={{ fontWeight: 600, color: '#1a2238' }}>
                            {s.userName || 'N/A'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#999' }}>
                            {s.userEmail || s.userId}
                        </div>
                    </div>

                    {/* Type */}
                    <div>
                        <Tag color={s.suspensionType === 'account_locked' ? 'red' : 'orange'}>
                            {s.suspensionTypeDisplay || s.suspensionType}
                        </Tag>
                    </div>

                    {/* Reason */}
                    <Tooltip title={s.reason}>
                        <div style={{
                            color: '#666', overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap', maxWidth: '100%',
                        }}>
                            {s.reason || '—'}
                        </div>
                    </Tooltip>

                    {/* Duration */}
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {formatDate(s.startDate)}
                        {s.endDate && <><br />{formatDate(s.endDate)}</>}
                    </div>

                    {/* Remaining */}
                    <div style={{
                        fontSize: '12px', fontWeight: 500,
                        color: s.timeRemainingDisplay === 'Sắp gỡ' ? '#52c41a' : '#ff4d4f',
                    }}>
                        {s.timeRemainingDisplay || '—'}
                    </div>

                    {/* Actions */}
                    <div>
                        {s.userId && (
                            <button
                                onClick={() => onUnsuspend(s.userId!, s.userName)}
                                style={{
                                    padding: '5px 12px', borderRadius: '6px', border: '1px solid #52c41a',
                                    background: 'transparent', color: '#52c41a', fontSize: '12px',
                                    cursor: 'pointer', fontWeight: 500,
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#52c41a';
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#52c41a';
                                }}
                            >
                                Gỡ
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// ============================================
// Lookup Tab
// ============================================
interface LookupTabProps {
    searchUserId: string;
    onSearchChange: (v: string) => void;
    onSearch: () => void;
    loading: boolean;
    summary: UserWarningSummary | null;
    formatDate: (d?: string) => string;
}

const LookupTab: React.FC<LookupTabProps> = ({
    searchUserId, onSearchChange, onSearch, loading, summary, formatDate,
}) => {
    return (
        <div>
            {/* Search Bar */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <Input
                    placeholder="Nhập User ID để tra cứu..."
                    value={searchUserId}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onPressEnter={onSearch}
                    style={{ maxWidth: '400px', borderRadius: '8px' }}
                    size="large"
                />
                <button
                    onClick={onSearch}
                    disabled={loading}
                    style={{
                        padding: '8px 24px', borderRadius: '8px', border: 'none',
                        background: '#4F46E5', color: '#fff', fontSize: '14px',
                        fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    {loading ? 'Đang tìm...' : 'Tra cứu'}
                </button>
            </div>

            {/* Results */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin />
                </div>
            )}

            {!loading && summary && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* User Info Card */}
                    <div style={{
                        background: '#fff', borderRadius: '12px', padding: '20px',
                        border: '1px solid rgba(26,34,56,0.06)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1a2238' }}>
                                    {summary.fullName || summary.userId}
                                </h3>
                                <span style={{ fontSize: '12px', color: '#999' }}>{summary.email}</span>
                            </div>
                            {summary.isSuspended && (
                                <Tag color="red" style={{ fontSize: '12px' }}>
                                    🔒 Đang bị đình chỉ ({summary.suspensionType})
                                </Tag>
                            )}
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                            <StatCard label="Tổng cảnh báo" value={summary.totalWarnings} color="#ff4d4f" />
                            <StatCard label="Mức 1" value={summary.level1Warnings} color="#F59E0B" />
                            <StatCard label="Mức 2" value={summary.level2Warnings} color="#EF4444" />
                            <StatCard label="30 ngày qua" value={summary.warningsLast30Days} color="#1890ff" />
                        </div>
                    </div>

                    {/* Warnings History */}
                    {summary.warnings.length > 0 && (
                        <div style={{
                            background: '#fff', borderRadius: '12px', padding: '20px',
                            border: '1px solid rgba(26,34,56,0.06)',
                        }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 600, color: '#1a2238' }}>
                                Lịch sử cảnh báo
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {summary.warnings.map((w) => (
                                    <div
                                        key={w.warningId}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '12px', borderRadius: '8px', background: '#fafafa',
                                        }}
                                    >
                                        <div style={{
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            background: w.warningLevelColor || (w.warningLevel === 2 ? '#EF4444' : '#F59E0B'),
                                            flexShrink: 0,
                                        }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                                <span style={{ fontWeight: 600, fontSize: '13px', color: '#1a2238' }}>
                                                    {w.warningLevelDisplay || `Mức ${w.warningLevel}`}
                                                </span>
                                                <span style={{ fontSize: '11px', color: '#999' }}>
                                                    {formatDate(w.createdAt)}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                {w.reason || '—'}
                                            </div>
                                            {w.issuedByName && (
                                                <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                                                    Cảnh báo bởi: {w.issuedByName}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {summary.warnings.length === 0 && (
                        <div style={{
                            textAlign: 'center', padding: '40px', background: '#fff',
                            borderRadius: '12px', border: '1px solid rgba(26,34,56,0.06)',
                            color: '#999', fontSize: '14px',
                        }}>
                            Người dùng này chưa có cảnh báo nào
                        </div>
                    )}
                </div>
            )}

            {!loading && !summary && searchUserId && (
                <Empty description="Nhấn 'Tra cứu' để tìm kiếm" />
            )}
        </div>
    );
};

// ============================================
// Helper Component
// ============================================
const StatCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div style={{
        padding: '12px', borderRadius: '8px',
        background: `${color}08`, textAlign: 'center',
        border: `1px solid ${color}20`,
    }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color }}>{value}</div>
        <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{label}</div>
    </div>
);

export default AdminWarningsPage;
