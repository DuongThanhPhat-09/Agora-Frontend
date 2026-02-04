import styles from './styles.module.css';
import MessageBubble from './MessageBubble';
import SessionContextCard from './SessionContextCard';
import TypingIndicator from './TypingIndicator';

const tutorAvatarSmall = 'https://www.figma.com/api/mcp/asset/0ff4008a-fd18-4174-9e83-f377eb2a5123';

const ChatMessagesArea = () => {
    return (
        <div className={styles.messagesArea}>
            <SessionContextCard />
            <div className={styles.dateSeparator}>Today</div>
            <MessageBubble
                avatar={tutorAvatarSmall}
                message="Hi! I wanted to update you on Emma's progress today. We covered fractions and she's really getting the hang of it!"
                time="2:28 PM"
            />
            <MessageBubble
                avatar={tutorAvatarSmall}
                message="She completed all practice problems correctly and asked great questions. For homework, I've assigned 10 fraction problems from chapter 4."
                time="2:29 PM"
            />
            <MessageBubble
                isSender
                message="That's wonderful to hear! Thank you for the detailed update. Emma mentioned she enjoyed today's lesson."
                time="2:32 PM"
            />
            <MessageBubble
                isSender
                message="Should I help her with the homework or let her try independently first?"
                time="2:33 PM"
            />
            <TypingIndicator />
        </div>
    );
};

export default ChatMessagesArea;
