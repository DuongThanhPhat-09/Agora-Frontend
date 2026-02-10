import styles from './styles.module.css';

const childAvatar = 'https://www.figma.com/api/mcp/asset/8397f283-3923-4e6f-91b5-a13184236336';
const dropdownIcon = 'https://www.figma.com/api/mcp/asset/ab348460-d8b8-4c24-b3bc-8c3ae5d66975';
const reportIcon = 'https://www.figma.com/api/mcp/asset/ffb87ef5-d7d8-4cdf-9f1d-30b4aa67af5e';
const newMessageIcon = 'https://www.figma.com/api/mcp/asset/8b4d4a45-d472-42fc-8c48-b1e31d99ef7f';

const HeaderTopBar = () => {
    return (
        <header className={styles.topBar}>
            <div className={styles.topBarLeft}>
                <h1 className={styles.pageTitle}>Messages</h1>
                <button className={styles.childSelector} type="button">
                    <img alt="" className={styles.childAvatar} src={childAvatar} />
                    <span className={styles.childName}>Emma Chen • Grade 8</span>
                    <img alt="" className={styles.dropdownIcon} src={dropdownIcon} />
                </button>
            </div>
            <div className={styles.topBarActions}>
                <button className={styles.secondaryButton} type="button">
                    <img alt="" className={styles.buttonIcon} src={reportIcon} />
                    Auto-Reports
                </button>
                <button className={styles.primaryButton} type="button">
                    <img alt="" className={styles.buttonIcon} src={newMessageIcon} />
                    New Message
                </button>
            </div>
        </header>
    );
};

export default HeaderTopBar;
