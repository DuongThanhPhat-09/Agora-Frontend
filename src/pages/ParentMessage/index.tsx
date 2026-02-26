import { useState } from 'react';
import styles from './styles.module.css';
import ChatArea from './ChatArea';
import MessageListSidebar from './MessageListSidebar';
import HeaderTopBar from './HeaderTopBar';
import type { ChatChannel } from '../../services/chat.service';
import { getUserIdFromToken } from '../../services/auth.service';

const ParentMessage = () => {
  const userId = getUserIdFromToken();
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);

  return (
    <div className={styles.page}>
      <HeaderTopBar />
      <div className={styles.mainContent}>
        <MessageListSidebar
          onChannelSelect={() => {
            // Channel selection is now handled by onChannelObjectSelect
          }}
          onChannelObjectSelect={setSelectedChannel}
          selectedChannelId={selectedChannel?.channelId ?? null}
        />
        <ChatArea
          selectedChannelId={selectedChannel?.channelId ?? null}
          currentUserId={userId}
          selectedChannel={selectedChannel}
        />
      </div>
    </div>
  );
};

export default ParentMessage;
