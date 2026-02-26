import { useState, useEffect } from 'react';
import type { RecentActivity } from '../../../types/admin.types';
import { formatRelativeTime, formatCurrency } from '../../../utils/formatters';

interface RecentActivitiesFeedProps {
    activities: RecentActivity[];
    loading?: boolean;
    autoRefresh?: boolean;
    refreshInterval?: number; // milliseconds
}

const RecentActivitiesFeed = ({
    activities,
    loading,
    autoRefresh = false,
    refreshInterval = 30000,
}: RecentActivitiesFeedProps) => {
    const [refreshKey, setRefreshKey] = useState(0);

    // Auto-refresh timer
    useEffect(() => {
        if (!autoRefresh) return;

        const timer = setInterval(() => {
            setRefreshKey((prev) => prev + 1);
        }, refreshInterval);

        return () => clearInterval(timer);
    }, [autoRefresh, refreshInterval]);

    // Get icon and color based on activity type
    const getActivityIcon = (type: string): { icon: string; color: string } => {
        switch (type) {
            case 'tutor_approved':
                return { icon: 'check_circle', color: '#166534' };
            case 'tutor_rejected':
                return { icon: 'cancel', color: '#991b1b' };
            case 'dispute_resolved':
                return { icon: 'gavel', color: 'var(--color-gold)' };
            case 'withdrawal_approved':
                return { icon: 'account_balance_wallet', color: '#15803d' };
            case 'withdrawal_rejected':
                return { icon: 'money_off', color: '#dc2626' };
            case 'user_blocked':
                return { icon: 'block', color: '#991b1b' };
            case 'warning_issued':
                return { icon: 'warning', color: '#ea580c' };
            default:
                return { icon: 'info', color: '#64748b' };
        }
    };

    if (loading) {
        return (
            <div className="admin-activities-feed" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#64748b' }}>Đang tải hoạt động...</p>
            </div>
        );
    }

    if (!activities || activities.length === 0) {
        return (
            <div className="admin-activities-feed" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#cbd5e1' }}>
                    history
                </span>
                <p style={{ color: '#94a3b8' }}>Chưa có hoạt động nào</p>
            </div>
        );
    }

    return (
        <div className="admin-activities-feed">
            {/* Header */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)' }}>
                    🕒 Hoạt động gần đây
                </h3>
                {autoRefresh && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                        <div
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#22c55e',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            }}
                        ></div>
                        <span>Cập nhật trực tiếp</span>
                    </div>
                )}
            </div>

            {/* Activities List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activities.map((activity) => {
                    const { icon, color } = getActivityIcon(activity.activitytype);

                    return (
                        <div
                            key={activity.activityid}
                            style={{
                                display: 'flex',
                                gap: '16px',
                                padding: '16px',
                                background: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f1f5f9';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f8fafc';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            {/* Icon */}
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    background: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    border: '1px solid #e2e8f0',
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px', color }}>
                                    {icon}
                                </span>
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p
                                    style={{
                                        margin: '0 0 4px',
                                        fontSize: '14px',
                                        color: 'var(--color-navy)',
                                        fontWeight: 500,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {activity.description}
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        fontSize: '13px',
                                        color: '#64748b',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <span>Bởi: {activity.performedby}</span>
                                    <span>•</span>
                                    <span>{formatRelativeTime(activity.createdat)}</span>

                                    {/* Additional metadata based on type */}
                                    {activity.metadata?.amount && (
                                        <>
                                            <span>•</span>
                                            <span style={{ fontWeight: 600, color: 'var(--color-gold)' }}>
                                                {formatCurrency(activity.metadata.amount)}
                                            </span>
                                        </>
                                    )}

                                    {activity.metadata?.severity && (
                                        <>
                                            <span>•</span>
                                            <span
                                                style={{
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    background:
                                                        activity.metadata.severity === 'high'
                                                            ? '#fee2e2'
                                                            : activity.metadata.severity === 'medium'
                                                            ? '#fef3c7'
                                                            : '#f1f5f9',
                                                    color:
                                                        activity.metadata.severity === 'high'
                                                            ? '#991b1b'
                                                            : activity.metadata.severity === 'medium'
                                                            ? '#92400e'
                                                            : '#475569',
                                                }}
                                            >
                                                {activity.metadata.severity === 'high'
                                                    ? 'Cao'
                                                    : activity.metadata.severity === 'medium'
                                                    ? 'TB'
                                                    : 'Thấp'}
                                            </span>
                                        </>
                                    )}

                                    {activity.metadata?.disputeid && (
                                        <>
                                            <span>•</span>
                                            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                                #{activity.metadata.disputeid}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentActivitiesFeed;
