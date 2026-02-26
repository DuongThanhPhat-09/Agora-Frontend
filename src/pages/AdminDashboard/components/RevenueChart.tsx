import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueChartData } from '../../../types/admin.types';
import { formatCurrency, formatCompactNumber } from '../../../utils/formatters';

interface RevenueChartProps {
    data: RevenueChartData[];
    loading?: boolean;
}

const RevenueChart = ({ data, loading }: RevenueChartProps) => {
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
                    <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                        {data.displaydate}
                    </p>
                    <p style={{ margin: 0, fontSize: '16px', color: 'var(--color-gold)', fontWeight: 700 }}>
                        {formatCurrency(data.revenue)}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Calculate total revenue
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const avgRevenue = totalRevenue / data.length;

    return (
        <div className="admin-chart-container">
            {/* Chart Header */}
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)' }}>
                    📈 Doanh thu 30 ngày qua
                </h3>
                <div style={{ display: 'flex', gap: '32px', fontSize: '14px' }}>
                    <div>
                        <span style={{ color: '#64748b' }}>Tổng: </span>
                        <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>
                            {formatCurrency(totalRevenue)}
                        </span>
                    </div>
                    <div>
                        <span style={{ color: '#64748b' }}>Trung bình/ngày: </span>
                        <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                            {formatCurrency(avgRevenue)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="displaydate"
                        stroke="#94a3b8"
                        style={{ fontSize: '12px' }}
                        tickMargin={10}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => formatCompactNumber(value)}
                        tickMargin={10}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-gold)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: 'var(--color-gold)', strokeWidth: 2, stroke: '#ffffff' }}
                        activeDot={{ r: 6, fill: 'var(--color-gold)' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueChart;
