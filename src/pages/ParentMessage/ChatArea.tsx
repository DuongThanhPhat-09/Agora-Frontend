import styles from './styles.module.css';
import ChatHeader from './ChatHeader';
import ChatMessagesArea from './ChatMessagesArea';
import MessageComposer from './MessageComposer';
import QuickTemplates from './QuickTemplates';

const ChatArea = () => {
    return (
        <section className={styles.chatArea}>
            <ChatHeader />
            <ChatMessagesArea />
            <div className={styles.chatFooter}>
                <QuickTemplates />
                <MessageComposer />
            </div>
        </section>
    );
};

export default ChatArea;
