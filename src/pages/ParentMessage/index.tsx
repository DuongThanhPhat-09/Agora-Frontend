import { useState } from 'react';
import styles from './styles.module.css';
import ChatArea from './ChatArea';
import MessageListSidebar from './MessageListSidebar';

const ParentMessage = () => {
  const userId = "USR-PAR-01";
  const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      {/* <HeaderTopBar /> */}
      <div className={styles.mainContent}>
        <MessageListSidebar onChannelSelect={setSelectedChannelId} selectedChannelId={selectedChannelId} />
        <ChatArea selectedChannelId={selectedChannelId} currentUserId={userId} />
      </div>
    </div>
  );
};

export default ParentMessage;
