import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import styles from './styles.module.css';

const data = [
    { name: 'Math', value: 40, color: '#262626' },
    { name: 'Physics', value: 35, color: '#525252' },
    { name: 'English', value: 25, color: '#a3a3a3' },
];

const SubjectDistributionChart = () => {
    return (
        <div className={styles.chartCard} data-name="Subject Distribution" data-node-id="2253:13113">
            <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Subject Distribution</div>
                <div className={styles.cardMeta}>Study time</div>
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
                    <div className={styles.chartLabel}>Subject distribution donut chart</div>
                </div>
            </div>
            <div className={styles.legendGrid}>
                <div className={styles.legendItem}>
                    <span className={styles.legendSwatch} style={{ backgroundColor: '#262626' }} />
                    <span className={styles.legendText}>Math (40%)</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.legendSwatch} style={{ backgroundColor: '#525252' }} />
                    <span className={styles.legendText}>Physics (35%)</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.legendSwatch} style={{ backgroundColor: '#a3a3a3' }} />
                    <span className={styles.legendText}>English (25%)</span>
                </div>
            </div>
        </div>
    );
};

export default SubjectDistributionChart;
