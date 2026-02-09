import { useState } from 'react';
import styles from './styles.module.css';
import { Send, Loader2 } from 'lucide-react';

const attachIcon = 'https://www.figma.com/api/mcp/asset/9eb5351d-9a24-43a9-8521-a6e4ca4ace17';

interface MessageComposerProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

const MessageComposer = ({ onSend, disabled = false }: MessageComposerProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || sending || disabled) {
      return;
    }

    setSending(true);
    try {
      await onSend(message);
      setMessage('');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.composer}>
      <button className={styles.iconButton} type="button" title="Attach File" disabled={disabled}>
        <img alt="" src={attachIcon} />
      </button>
      <textarea
        className={styles.composerInput}
        placeholder="Type your message..."
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        // disabled={disabled}
      />
      <button
        className={styles.sendButton}
        type="button"
        onClick={handleSend}
        disabled={!message.trim() || sending || disabled}
        title="Send Message"
      >
        {sending ? (
          <Loader2 size={20} className={styles.sendingSpinner} />
        ) : (
          <img
            alt=""
            src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='white'%3E%3Ccircle%20cx='12'%20cy='12'%20r='10'%20stroke='white'%20stroke-width='2'%20/%3E%3Cpath%20d='M22%202%20l-6%205a2%202%200%200%200%200.414%200.207l-4.293%204.293a1%201%200%200%200-1.414%20L9.172%2010.828a2%202%200%200%200-2.172%202l-4.586-204.586a2%202%200%200%200-207-1.414l-4.293-204.293a1%201%200%200%200%201.414%20l-4.586%204.586a2%202%200%200%200%202.172l-2-172%202z'/%3E%3C/svg%3E"
          />
        )}
      </button>
    </div>
  );
};

export default MessageComposer;
