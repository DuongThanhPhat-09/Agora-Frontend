import { useState } from 'react';
import styles from './styles.module.css';
import ChatArea from './ChatArea';
import HeaderTopBar from './HeaderTopBar';
import MessageListSidebar from './MessageListSidebar';

const ParentMessage = () => {
  const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      <HeaderTopBar />
      <div className={styles.mainContent}>
        <MessageListSidebar onChannelSelect={setSelectedChannelId} selectedChannelId={selectedChannelId} />
        <ChatArea selectedChannelId={selectedChannelId} />
      </div>
    </div>
  );
};

export default ParentMessage;
