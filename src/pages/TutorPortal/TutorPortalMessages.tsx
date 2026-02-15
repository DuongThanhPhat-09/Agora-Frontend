import { useState } from 'react';
import styles from '../ParentMessage/styles.module.css';
import ChatArea from '../ParentMessage/ChatArea';
import MessageListSidebar from '../ParentMessage/MessageListSidebar';
import type { ChatChannel } from '../../services/chat.service';
import { getUserIdFromToken } from '../../services/auth.service';

const TutorPortalMessages = () => {
    const userId = getUserIdFromToken();
    const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);

    return (
        <div className={styles.page}>
            <header className={styles.topBar}>
                <div className={styles.topBarLeft}>
                    <h1 className={styles.pageTitle}>Messages</h1>
                </div>
            </header>
            <div className={styles.mainContent}>
                <MessageListSidebar
                    onChannelSelect={() => {
                        // Channel selection is handled by onChannelObjectSelect
                    }}
                    onChannelObjectSelect={setSelectedChannel}
                    selectedChannelId={selectedChannel?.channelId ?? null}
                />
                <ChatArea
                    selectedChannelId={selectedChannel?.channelId ?? null}
                    currentUserId={userId}
                    selectedChannel={selectedChannel}
                    isTutor={true}
                />
            </div>
        </div>
    );
};

export default TutorPortalMessages;
