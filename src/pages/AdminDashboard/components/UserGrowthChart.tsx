import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { UserGrowthData } from '../../../types/admin.types';
type UserGrowthChartData = UserGrowthData;
import { formatNumber } from '../../../utils/formatters';

interface UserGrowthChartProps {
    data: UserGrowthChartData[];
    loading?: boolean;
}

const UserGrowthChart = ({ data, loading }: UserGrowthChartProps) => {
    if (loading) {
        return (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#64748b' }}>Đang tải dữ liệu biểu đồ...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#94a3b8' }}>Không có dữ liệu</p>
            </div>
        );
    }

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div
                    style={{
                        background: '#ffffff',
                        padding: '12px 16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                        {data.month}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', background: '#2563eb', borderRadius: '2px' }}></div>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>Học viên:</span>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                                {formatNumber(data.students)}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', background: 'var(--color-gold)', borderRadius: '2px' }}></div>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>Gia sư:</span>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                                {formatNumber(data.tutors)}
                            </span>
                        </div>
                        <div style={{ marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>Tổng:</span>
                            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)', marginLeft: '8px' }}>
                                {formatNumber(data.totalusers)}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Calculate growth stats
    const latestMonth = data[data.length - 1];
    const previousMonth = data[data.length - 2];
    const studentGrowth = previousMonth
        ? ((latestMonth.students - previousMonth.students) / previousMonth.students) * 100
        : 0;
    const tutorGrowth = previousMonth
        ? ((latestMonth.tutors - previousMonth.tutors) / previousMonth.tutors) * 100
        : 0;

    return (
        <div className="admin-chart-container">
            {/* Chart Header */}
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)' }}>
                    👥 Tăng trưởng người dùng (6 tháng)
                </h3>
                <div style={{ display: 'flex', gap: '32px', fontSize: '14px' }}>
                    <div>
                        <span style={{ color: '#64748b' }}>Học viên: </span>
                        <span style={{ fontWeight: 700, color: '#2563eb' }}>
                            {formatNumber(latestMonth.students)}
                        </span>
                        {studentGrowth !== 0 && (
                            <span
                                style={{
                                    marginLeft: '8px',
                                    fontSize: '12px',
                                    color: studentGrowth > 0 ? '#166534' : '#991b1b',
                                    fontWeight: 600,
                                }}
                            >
                                {studentGrowth > 0 ? '+' : ''}{studentGrowth.toFixed(1)}%
                            </span>
                        )}
                    </div>
                    <div>
                        <span style={{ color: '#64748b' }}>Gia sư: </span>
                        <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>
                            {formatNumber(latestMonth.tutors)}
                        </span>
                        {tutorGrowth !== 0 && (
                            <span
                                style={{
                                    marginLeft: '8px',
                                    fontSize: '12px',
                                    color: tutorGrowth > 0 ? '#166534' : '#991b1b',
                                    fontWeight: 600,
                                }}
                            >
                                {tutorGrowth > 0 ? '+' : ''}{tutorGrowth.toFixed(1)}%
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="month"
                        stroke="#94a3b8"
                        style={{ fontSize: '12px' }}
                        tickMargin={10}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        style={{ fontSize: '12px' }}
                        tickMargin={10}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="rect"
                        formatter={(value) => {
                            if (value === 'students') return 'Học viên';
                            if (value === 'tutors') return 'Gia sư';
                            return value;
                        }}
                    />
                    <Bar
                        dataKey="students"
                        fill="#2563eb"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="tutors"
                        fill="var(--color-gold)"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserGrowthChart;
