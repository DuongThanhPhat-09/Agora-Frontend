import React, { useState, useRef } from 'react';
import { Modal } from 'antd';
import styles from './IntroVideoSection.module.css';

// Constants
const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

// Icons
const VideoIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M9 5L12 7L9 9V5Z" fill="currentColor" />
        <path d="M2 4C2 3.44772 2.44772 3 3 3H8C8.55228 3 9 3.44772 9 4V10C9 10.5523 8.55228 11 8 11H3C2.44772 11 2 10.5523 2 10V4Z" fill="currentColor" />
    </svg>
);

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M12.75 2.25L15.75 5.25M9.75 5.25L2.25 12.75V15.75H5.25L12.75 8.25M9.75 5.25L12.75 2.25L15.75 5.25L12.75 8.25M9.75 5.25L12.75 8.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 16V4M12 4L7 9M12 4L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 16V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LoadingSpinner = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.spinner}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M22 12C22 6.47715 17.5228 2 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const DeleteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 5H15M6 5V4C6 3.44772 6.44772 3 7 3H11C11.5523 3 12 3.44772 12 4V5M7 8V13M11 8V13M4 5L5 15C5 15.5523 5.44772 16 6 16H12C12.5523 16 13 15.5523 13 15L14 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface IntroVideoSectionProps {
    videoUrl: string | null;
    onChange: (url: string | null) => void;
    onUploadVideo?: (file: File) => Promise<string | null>;
    isEditMode: boolean;
    isUploading?: boolean;
}

const IntroVideoSection: React.FC<IntroVideoSectionProps> = ({
    videoUrl,
    onChange,
    onUploadVideo,
    isEditMode,
    isUploading = false
}) => {
    const [error, setError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validate and process file
    const processFile = async (file: File) => {
        // Validate file type
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
            setError('Định dạng không hợp lệ. Chỉ chấp nhận MP4, WebM, MOV, AVI.');
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE_BYTES) {
            setError(`File quá lớn. Kích thước tối đa là ${MAX_FILE_SIZE_MB}MB.`);
            return;
        }

        setError(null);

        // Upload file
        if (onUploadVideo) {
            const uploadedUrl = await onUploadVideo(file);
            if (!uploadedUrl) {
                setError('Upload thất bại. Vui lòng thử lại.');
            }
        }
    };

    // Handle file selection from input
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        await processFile(file);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Drag & Drop handlers
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await processFile(files[0]);
        }
    };

    // Handle remove video - show confirmation modal
    const showDeleteConfirm = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        onChange(null);
        setError(null);
        setIsDeleteModalOpen(false);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    // Trigger file input
    const triggerFileInput = () => {
        setError(null);
        fileInputRef.current?.click();
    };

    // Preview mode - just show video
    if (!isEditMode) {
        if (!videoUrl) {
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
                    <video
                        src={videoUrl}
                        controls
                        className={styles.videoPlayer}
                    />
                </div>
            </div>
        );
    }

    // Edit mode - uploading state
    if (isUploading) {
        return (
            <div className={styles.container}>
                <div className={styles.uploadingState}>
                    <div className={styles.label}>
                        <VideoIcon />
                        <span>Intro Video</span>
                    </div>
                    <div className={styles.uploadingContent}>
                        <LoadingSpinner />
                        <span className={styles.uploadingText}>Dang tai len video...</span>
                        <span className={styles.uploadingHint}>Vui long doi trong giay lat</span>
                    </div>
                </div>
            </div>
        );
    }

    // Edit mode - has video
    if (videoUrl) {
        return (
            <div className={styles.container}>
                <div className={styles.videoWrapper}>
                    <div className={styles.label}>
                        <VideoIcon />
                        <span>Intro Video</span>
                    </div>
                    <div className={styles.actionButtons}>
                        <button className={styles.editBtn} onClick={triggerFileInput} title="Thay đổi video">
                            <EditIcon />
                        </button>
                        <button className={styles.deleteBtn} onClick={showDeleteConfirm} title="Xóa video">
                            <DeleteIcon />
                        </button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                        onChange={handleFileSelect}
                        className={styles.fileInput}
                    />
                    <video
                        src={videoUrl}
                        controls
                        className={styles.videoPlayer}
                    />
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}

                {/* Delete Confirmation Modal */}
                <Modal
                    title="Xác nhận xóa video"
                    open={isDeleteModalOpen}
                    onOk={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                >
                    <p>Bạn có chắc chắn muốn xóa video giới thiệu này không?</p>
                    <p style={{ color: '#666', fontSize: '14px' }}>Hành động này không thể hoàn tác.</p>
                </Modal>
            </div>
        );
    }

    // Edit mode - no video (upload area)
    return (
        <div className={styles.container}>
            <div
                className={`${styles.uploadContainer} ${isDragging ? styles.uploadContainerDragging : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className={styles.label}>
                    <VideoIcon />
                    <span>Intro Video</span>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                    onChange={handleFileSelect}
                    className={styles.fileInput}
                />
                <div className={styles.uploadDropzone} onClick={triggerFileInput}>
                    <div className={`${styles.uploadIconWrapper} ${isDragging ? styles.uploadIconDragging : ''}`}>
                        <UploadIcon />
                    </div>
                    <span className={styles.uploadTitle}>
                        {isDragging ? 'Thả video để tải lên' : 'Kéo thả hoặc click để tải video'}
                    </span>
                    <span className={styles.uploadHint}>
                        MP4, WebM, MOV, AVI - Tối đa {MAX_FILE_SIZE_MB}MB
                    </span>
                    {error && <span className={styles.error}>{error}</span>}
                </div>
            </div>
        </div>
    );
};

export default IntroVideoSection;
