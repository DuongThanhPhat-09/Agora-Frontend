import styles from './styles.module.css';
import ChatArea from './ChatArea';
import HeaderTopBar from './HeaderTopBar';
import MessageListSidebar from './MessageListSidebar';

const ParentMessage = () => {
    return (
        <div className={styles.page}>
            <HeaderTopBar />
            <div className={styles.mainContent}>
                <MessageListSidebar />
                <ChatArea />
            </div>
        </div>
    );
};

export default ParentMessage;
