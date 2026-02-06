import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from './AddChildModal.module.css';

interface AddChildModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddChildModal: React.FC<AddChildModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !mounted) return null;

    return createPortal(
        <>
            {/* Overlay */}
            <div
                className={styles.modalOverlay}
                onClick={handleOverlayClick}
            />

            {/* Sidebar Modal */}
            <div className={styles.sidebarModal}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Link a Child</h2>
                    <button className={styles.closeBtn} onClick={onClose} type="button">
                        <X size={18} strokeWidth={2} />
                    </button>
                </div>

                {/* Form Content */}
                <div className={styles.content}>
                    <p className={styles.description}>Enter the child's details to send an invitation link.</p>
                </div>
            </div>
        </>,
        document.body
    );
};

export default AddChildModal;
