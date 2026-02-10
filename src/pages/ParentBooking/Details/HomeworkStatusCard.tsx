import styles from './styles.module.css';

const HomeworkStatusCard = () => {
    return (
        <div className={styles.chartCard} data-name="Homework Status" data-node-id="2253:13165">
            <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Homework Status</div>
                <button className={styles.linkButton}>View homework list</button>
            </div>
            <div className={styles.infoList}>
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>On track</div>
                    <div className={styles.infoValue}>3 assignments</div>
                </div>
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Pending</div>
                    <div className={styles.infoValue}>2 assignments</div>
                </div>
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Overdue</div>
                    <div className={styles.infoValueMuted}>1 assignment</div>
                </div>
            </div>
            <div className={styles.highlightBox}>
                <div className={styles.highlightLabel}>Next due:</div>
                <div className={styles.highlightValue}>Math Problem Set #12 - Due Jan 23</div>
            </div>
        </div>
    );
};

export default HomeworkStatusCard;
