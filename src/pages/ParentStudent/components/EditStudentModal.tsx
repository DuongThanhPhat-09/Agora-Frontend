import { useState, useEffect } from 'react';
// message import removed
import styles from './AddStudentModal.module.css';
import { Trash2 } from 'lucide-react';
import type { StudentType } from '../../../types/student.type';
import type { ICreateParentStudent } from '../../../services/student.service';

interface EditStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, payload: ICreateParentStudent) => Promise<void>;
    student: StudentType | null;
}

const EditStudentModal = ({ isOpen, onClose, onSubmit, student }: EditStudentModalProps) => {
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        school: '',
        gradeLevel: '',
        learningGoals: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    // Pre-fill form when student changes
    useEffect(() => {
        if (student) {
            setFormData({
                fullName: student.fullName,
                birthDate: student.birthDate,
                school: student.school,
                gradeLevel: student.gradeLevel || '',
                learningGoals: student.learningGoals || '',
            });
        }
    }, [student]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!student) return;

        // Validate
        const newErrors: Record<string, string> = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
        if (!formData.school.trim()) newErrors.school = 'School is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit(student.studentId, {
                fullname: formData.fullName,
                birthdate: formData.birthDate,
                school: formData.school,
                gradelevel: formData.gradeLevel || undefined,
                learninggoals: formData.learningGoals || undefined,
            });
            onClose();
        } catch (err) {
            console.error('Error in modal submit:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Edit Student</h2>
                    <button className={styles.modalCloseBtn} onClick={onClose} type="button" disabled={submitting}>
                        <Trash2 size={20} />
                    </button>
                </div>

                <form className={styles.addStudentForm} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Full Name <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`${styles.formInput} ${errors.fullName ? styles.formInputError : ''}`}
                            placeholder="Enter student's full name"
                            disabled={submitting}
                        />
                        {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Birth Date <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className={`${styles.formInput} ${errors.birthDate ? styles.formInputError : ''}`}
                            disabled={submitting}
                        />
                        {errors.birthDate && <span className={styles.errorMessage}>{errors.birthDate}</span>}
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            School <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="school"
                            value={formData.school}
                            onChange={handleChange}
                            className={`${styles.formInput} ${errors.school ? styles.formInputError : ''}`}
                            placeholder="Enter school name"
                            disabled={submitting}
                        />
                        {errors.school && <span className={styles.errorMessage}>{errors.school}</span>}
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Grade Level
                        </label>
                        <input
                            type="text"
                            name="gradeLevel"
                            value={formData.gradeLevel}
                            onChange={handleChange}
                            className={styles.formInput}
                            placeholder="Enter grade level (e.g., Grade 8)"
                            disabled={submitting}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>
                            Learning Goals
                        </label>
                        <textarea
                            name="learningGoals"
                            value={formData.learningGoals}
                            onChange={handleChange}
                            className={styles.formTextarea}
                            placeholder="Enter learning goals..."
                            rows={3}
                            disabled={submitting}
                        />
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" className={styles.modalBtn} onClick={onClose} disabled={submitting}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.modalBtnPrimary} disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentModal;
