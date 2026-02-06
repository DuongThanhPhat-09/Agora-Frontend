import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import styles from './styles.module.css';

const data = [
    { name: 'Present', value: 4, color: '#262626' },
    { name: 'Late', value: 0, color: '#525252' },
    { name: 'Absent', value: 1, color: '#a3a3a3' },
];

const AttendanceChart = () => {
    return (
        <div className={styles.chartCard} data-name="Attendance Chart" data-node-id="2253:13138">
            <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Attendance</div>
                <button className={styles.linkButton}>View attendance log</button>
            </div>
            <div className={styles.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="value" innerRadius={50} outerRadius={70} stroke="none">
                            {data.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ display: 'none' }} />
                    </PieChart>
                </ResponsiveContainer>
                <div className={styles.chartOverlay}>
                    <img src="https://www.figma.com/api/mcp/asset/5216498a-387e-4667-8663-f7719b4cabbe" alt="" className={styles.chartIconWide} />
                    <div className={styles.chartLabel}>Attendance donut chart</div>
                    <div className={styles.chartNote}>4/5 sessions this week</div>
                </div>
            </div>
            <div className={styles.legendGrid}>
                <div className={styles.legendItem}>
                    <span className={styles.legendSwatch} style={{ backgroundColor: '#262626' }} />
                    <span className={styles.legendText}>Present (4)</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.legendSwatch} style={{ backgroundColor: '#525252' }} />
                    <span className={styles.legendText}>Late (0)</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.legendSwatch} style={{ backgroundColor: '#a3a3a3' }} />
                    <span className={styles.legendText}>Absent (1)</span>
                </div>
            </div>
        </div>
    );
};

export default AttendanceChart;
