import styles from './styles.module.css';

const searchIcon = 'https://www.figma.com/api/mcp/asset/56ad9189-7085-4c6a-989b-04082762f59b';

const MessageSearch = () => {
    return (
        <div className={styles.searchBlock}>
            <div className={styles.searchInputWrapper}>
                <img alt="" className={styles.searchIcon} src={searchIcon} />
                <input className={styles.searchInput} placeholder="Search messages..." type="text" />
            </div>
            <div className={styles.tabGroup}>
                <button className={`${styles.tabButton} ${styles.tabButtonActive}`} type="button">
                    Chat
                </button>
                <button className={styles.tabButton} type="button">
                    Auto-Reports
                </button>
            </div>
        </div>
    );
};

export default MessageSearch;
