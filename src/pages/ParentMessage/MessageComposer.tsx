import { useState } from 'react';
import styles from './styles.module.css';
import { Loader2, SendHorizontal } from 'lucide-react';

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
          <Loader2 size={20} className={styles.sendingSpinner} color="#ffffff" />
        ) : (
          <SendHorizontal size={20} color="#ffffff" />
        )}
      </button>
    </div>
  );
};

export default MessageComposer;
