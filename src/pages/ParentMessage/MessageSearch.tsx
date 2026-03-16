import styles from './styles.module.css';
import { Search } from 'lucide-react';

interface MessageSearchProps {
    onSearch: (query: string) => void;
}

const MessageSearch = ({ onSearch }: MessageSearchProps) => {
    return (
        <div className={styles.searchBlock}>
            <div className={styles.searchInputWrapper}>
                <Search size={14} className={styles.searchIcon} />
                <input 
                    className={styles.searchInput} 
                    placeholder="Tìm kiếm tin nhắn..." 
                    type="text" 
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
            <div className={styles.tabGroup}>
                <button className={`${styles.tabButton} ${styles.tabButtonActive}`} type="button">
                    Trò chuyện
                </button>
                <button className={styles.tabButton} type="button">
                    Báo cáo tự động
                </button>
            </div>
        </div>
    );
};

export default MessageSearch;
