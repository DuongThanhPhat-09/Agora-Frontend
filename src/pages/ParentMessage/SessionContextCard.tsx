import styles from './styles.module.css';

const timeIcon = 'https://www.figma.com/api/mcp/asset/55b52807-db8b-490b-9245-43136c704fc7';
const homeworkIcon = 'https://www.figma.com/api/mcp/asset/c7e1d56c-5edc-4f71-8f22-da65659f2a68';

const SessionContextCard = () => {
    return (
        <div className={styles.sessionContextCard}>
            <span className={styles.sessionContextCaption}>Session #12 • Jan 21, 2025</span>
            <span className={styles.sessionContextTitle}>Math: Fractions & Decimals</span>
            <div className={styles.sessionContextMeta}>
                <span className={styles.sessionContextItem}>
                    <img alt="" src={timeIcon} />
                    60 min
                </span>
                <span className={styles.sessionContextItem}>
                    <img alt="" src={homeworkIcon} />
                    HW: 10 problems
                </span>
            </div>
        </div>
    );
};

export default SessionContextCard;
