import styles from './DeleteConfirmModal.module.css';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    studentName: string;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, studentName }: DeleteConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.deleteModalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.deleteModalIcon}>
                    <Trash2 size={48} />
                </div>
                <h2 className={styles.deleteModalTitle}>Delete Student</h2>
                <p className={styles.deleteModalText}>
                    Are you sure you want to delete <strong>{studentName}</strong>? This action cannot be undone.
                </p>
                <div className={styles.deleteModalActions}>
                    <button type="button" className={styles.modalBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className={styles.modalBtnDanger} onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
