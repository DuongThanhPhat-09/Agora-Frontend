import React, { useState, useEffect } from 'react';
import {
    validateVideoUrl,
    extractYouTubeId,
    extractVimeoId
} from '../utils/validation';
import styles from './IntroVideoSection.module.css';

// Icons
const VideoIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M9 5L12 7L9 9V5Z" fill="currentColor" />
        <path d="M2 4C2 3.44772 2.44772 3 3 3H8C8.55228 3 9 3.44772 9 4V10C9 10.5523 8.55228 11 8 11H3C2.44772 11 2 10.5523 2 10V4Z" fill="currentColor" />
    </svg>
);

const PlayIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M10 6L26 16L10 26V6Z" fill="currentColor" />
    </svg>
);

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M12.75 2.25L15.75 5.25M9.75 5.25L2.25 12.75V15.75H5.25L12.75 8.25M9.75 5.25L12.75 2.25L15.75 5.25L12.75 8.25M9.75 5.25L12.75 8.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface IntroVideoSectionProps {
    videoUrl: string | null;
    onChange: (url: string | null) => void;
    isEditMode: boolean;
}

const IntroVideoSection: React.FC<IntroVideoSectionProps> = ({
    videoUrl,
    onChange,
    isEditMode
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(videoUrl || '');
    const [error, setError] = useState<string | null>(null);
    const [embedUrl, setEmbedUrl] = useState<string | null>(null);

    // Generate embed URL when video URL changes
    useEffect(() => {
        if (videoUrl) {
            const youtubeId = extractYouTubeId(videoUrl);
            const vimeoId = extractVimeoId(videoUrl);

            if (youtubeId) {
                setEmbedUrl(`https://www.youtube.com/embed/${youtubeId}`);
            } else if (vimeoId) {
                setEmbedUrl(`https://player.vimeo.com/video/${vimeoId}`);
            } else {
                setEmbedUrl(null);
            }
        } else {
            setEmbedUrl(null);
        }
    }, [videoUrl]);

    // Handle edit start
    const handleEditStart = () => {
        setInputValue(videoUrl || '');
        setError(null);
        setIsEditing(true);
    };

    // Handle cancel
    const handleCancel = () => {
        setInputValue(videoUrl || '');
        setError(null);
        setIsEditing(false);
    };

    // Handle save
    const handleSave = () => {
        if (!inputValue.trim()) {
            onChange(null);
            setIsEditing(false);
            return;
        }

        const validation = validateVideoUrl(inputValue);
        if (!validation.isValid) {
            setError(validation.error || null);
            return;
        }

        onChange(inputValue);
        setIsEditing(false);
        setError(null);
    };

    // Handle remove video
    const handleRemove = () => {
        onChange(null);
        setInputValue('');
        setIsEditing(false);
    };

    // Preview mode - just show video
    if (!isEditMode) {
        if (!videoUrl || !embedUrl) {
            return (
                <div className={styles.container}>
                    <div className={styles.noVideo}>
                        <VideoIcon />
                        <span>Chua co video gioi thieu</span>
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.container}>
                <div className={styles.videoWrapper}>
                    <div className={styles.label}>
                        <VideoIcon />
                        <span>Intro Video</span>
                    </div>
                    <iframe
                        src={embedUrl}
                        title="Intro Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={styles.iframe}
                    />
                </div>
            </div>
        );
    }

    // Edit mode - editing input
    if (isEditing) {
        return (
            <div className={styles.container}>
                <div className={styles.editContainer}>
                    <div className={styles.label}>
                        <VideoIcon />
                        <span>Intro Video</span>
                    </div>
                    <div className={styles.editForm}>
                        <div className={styles.inputWrapper}>
                            <input
                                type="url"
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    setError(null);
                                }}
                                placeholder="Nhap link YouTube hoac Vimeo"
                                className={`${styles.input} ${error ? styles.inputError : ''}`}
                                autoFocus
                            />
                            {error && <span className={styles.error}>{error}</span>}
                        </div>
                        <div className={styles.editActions}>
                            <button className={styles.cancelBtn} onClick={handleCancel}>
                                <CloseIcon />
                            </button>
                            <button className={styles.saveBtn} onClick={handleSave}>
                                <CheckIcon />
                            </button>
                        </div>
                    </div>
                    <p className={styles.hint}>
                        Dinh dang: youtube.com/watch?v=..., youtu.be/..., vimeo.com/...
                    </p>
                </div>
            </div>
        );
    }

    // Edit mode - has video
    if (videoUrl && embedUrl) {
        return (
            <div className={styles.container}>
                <div className={styles.videoWrapper}>
                    <div className={styles.label}>
                        <VideoIcon />
                        <span>Intro Video</span>
                    </div>
                    <button className={styles.editBtn} onClick={handleEditStart}>
                        <EditIcon />
                    </button>
                    <iframe
                        src={embedUrl}
                        title="Intro Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={styles.iframe}
                    />
                    <button className={styles.removeBtn} onClick={handleRemove}>
                        Xoa video
                    </button>
                </div>
            </div>
        );
    }

    // Edit mode - no video
    return (
        <div className={styles.container}>
            <div className={styles.emptyState} onClick={handleEditStart}>
                <div className={styles.label}>
                    <VideoIcon />
                    <span>Intro Video</span>
                </div>
                <div className={styles.playButtonWrapper}>
                    <div className={styles.playButton}>
                        <PlayIcon />
                    </div>
                    <span className={styles.addText}>Them video gioi thieu</span>
                </div>
            </div>
        </div>
    );
};

export default IntroVideoSection;
