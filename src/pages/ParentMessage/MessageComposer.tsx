import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './styles.module.css';
import { Loader2, SendHorizontal, Paperclip } from 'lucide-react';
import { signalRService } from '../../services/signalr.service';

interface MessageComposerProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  channelId?: number | null;
}

const MessageComposer = ({ onSend, disabled = false, channelId }: MessageComposerProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const emitTyping = useCallback(() => {
    if (!channelId) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      signalRService.typing(channelId);
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
      if (channelId) signalRService.stopTyping(channelId);
    }, 2000);
  }, [channelId]);

  const emitStopTyping = useCallback(() => {
    if (!channelId) return;
    if (isTypingRef.current) {
      isTypingRef.current = false;
      signalRService.stopTyping(channelId);
    }
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  }, [channelId]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  const handleSend = async () => {
    if (!message.trim() || sending || disabled) {
      return;
    }

    setSending(true);
    emitStopTyping();
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      emitTyping();
    } else {
      emitStopTyping();
    }
  };

  return (
    <div className={styles.composer}>
      <button className={styles.iconButton} type="button" title="Đính kèm tệp" disabled={disabled}>
        <Paperclip size={18} />
      </button>
      <textarea
        ref={textareaRef}
        className={styles.composerInput}
        placeholder="Nhập tin nhắn..."
        rows={1}
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <button
        className={styles.sendButton}
        type="button"
        onClick={handleSend}
        disabled={!message.trim() || sending || disabled}
        title="Gửi tin nhắn"
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
