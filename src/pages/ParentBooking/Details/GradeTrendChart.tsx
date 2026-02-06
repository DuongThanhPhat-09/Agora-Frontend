import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import styles from './styles.module.css';

const data = [
    { week: 'W1', score: 78 },
    { week: 'W2', score: 80 },
    { week: 'W3', score: 82 },
    { week: 'W4', score: 84 },
];

const GradeTrendChart = () => {
    return (
        <div className={styles.chartCard} data-name="Grade Trend Chart" data-node-id="2253:13090">
            <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Grade Trend</div>
                <div className={styles.tabGroup}>
                    <button className={styles.tabActive}>Overall</button>
                    <button className={styles.tabButton}>Math</button>
                    <button className={styles.tabButton}>Physics</button>
                </div>
            </div>
            <div className={styles.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                        <XAxis dataKey="week" axisLine={false} tickLine={false} hide />
                        <YAxis axisLine={false} tickLine={false} hide domain={[70, 90]} />
                        <Tooltip contentStyle={{ display: 'none' }} />
                        <Line type="monotone" dataKey="score" stroke="#171717" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
                <div className={styles.chartOverlay}>
                    <img src="https://www.figma.com/api/mcp/asset/0fa4ce48-1ebf-49f6-ace3-43bf5685f281" alt="" className={styles.chartIcon} />
                    <div className={styles.chartLabel}>Grade trend line chart</div>
                    <div className={styles.chartNote}>Current grade: B+ (+1.2 from last month)</div>
                </div>
            </div>
            <div className={styles.cardFootnote}>Based on 6 quizzes in last 4 weeks</div>
        </div>
    );
};

export default GradeTrendChart;
