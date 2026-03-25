import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './styles.module.css';
import { Loader2, SendHorizontal, Paperclip } from 'lucide-react';
import { signalRService } from '../../services/signalr.service';
import { toast } from 'react-toastify';

interface MessageComposerProps {
  onSend: (content: string) => void;
  onSendImage?: (file: File) => Promise<void>;
  disabled?: boolean;
  channelId?: number | null;
}

const MessageComposer = ({ onSend, onSendImage, disabled = false, channelId }: MessageComposerProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận file hình ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file vượt quá 5MB');
      return;
    }

    if (onSendImage) {
      setUploadingImage(true);
      try {
        await onSendImage(file);
      } catch {
        toast.error('Không thể gửi hình ảnh. Vui lòng thử lại.');
      } finally {
        setUploadingImage(false);
        // Reset input để có thể chọn lại cùng file
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={styles.composer}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <button
        className={styles.iconButton}
        type="button"
        title="Gửi hình ảnh"
        disabled={disabled || uploadingImage}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploadingImage ? <Loader2 size={18} className={styles.sendingSpinner} /> : <Paperclip size={18} />}
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
