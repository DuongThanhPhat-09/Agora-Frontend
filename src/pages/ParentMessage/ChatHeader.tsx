import styles from './styles.module.css';

const tutorAvatar = 'https://www.figma.com/api/mcp/asset/3ee4e6d4-e39b-4753-a0d0-0ec3d0ba2b44';
const badgeAssigned = 'https://www.figma.com/api/mcp/asset/d7adf34e-7b26-4007-8282-2540aba0e56e';
const callIcon = 'https://www.figma.com/api/mcp/asset/e7357708-29a2-4580-956e-8751b3cafcbd';
const videoIcon = 'https://www.figma.com/api/mcp/asset/dbce7cb1-79c1-43f3-9c44-3b84b6c1bc06';
const moreIcon = 'https://www.figma.com/api/mcp/asset/4275581e-11bc-41b8-859c-6e795005d430';

interface ChatHeaderProps {
    selectedChannelId: number | null;
}

const ChatHeader = ({ selectedChannelId }: ChatHeaderProps) => {
    // Hiện tại sử dụng dữ liệu mẫu, sau này sẽ fetch từ API
    // TODO: Fetch channel info từ API khi có selectedChannelId

    return (
        <div className={styles.chatHeader}>
            <div className={styles.chatHeaderInfo}>
                <img alt="" className={styles.chatAvatar} src={tutorAvatar} />
                <div className={styles.chatHeaderText}>
                    <div className={styles.chatHeaderTitleRow}>
                        <span className={styles.chatName}>Sarah Mitchell</span>
                        <span className={styles.messageDot}>•</span>
                        <span className={styles.chatSession}>Session #12</span>
                    </div>
                    <div className={styles.chatHeaderMetaRow}>
                        <span className={styles.chatRole}>Math Tutor • Online now</span>
                        <span className={styles.messageBadge}>
                            <img alt="" className={styles.messageBadgeIcon} src={badgeAssigned} />
                            <span>HW Assigned</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className={styles.chatHeaderActions}>
                <button className={styles.iconButton} type="button">
                    <img alt="" src={callIcon} />
                </button>
                <button className={styles.iconButton} type="button">
                    <img alt="" src={videoIcon} />
                </button>
                <button className={styles.iconButton} type="button">
                    <img alt="" src={moreIcon} />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
