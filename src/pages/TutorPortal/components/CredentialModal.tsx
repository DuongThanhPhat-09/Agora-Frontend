import React, { useState, useEffect, useRef } from 'react';
import EditModal from './EditModal';
import FormField from './FormField';
import {
    validateCredentialName,
    validateInstitution,
    validateIssueYear,
    validateCertificateFile
} from '../utils/validation';
import styles from './CredentialModal.module.css';

// Icons
const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 16V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 4V14M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const FileIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M11 1H5C3.89543 1 3 1.89543 3 3V17C3 18.1046 3.89543 19 5 19H15C16.1046 19 17 18.1046 17 17V7L11 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 1V7H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CloseIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PendingIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export interface CredentialData {
    id?: number;
    name: string;
    institution: string;
    issueYear: number | null;
    certificateFile: File | null;
    certificateUrl?: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
}

interface CredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CredentialData) => void;
    initialData?: CredentialData;
    isEditing?: boolean;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1990 + 1 }, (_, i) => ({
    value: String(CURRENT_YEAR - i),
    label: String(CURRENT_YEAR - i)
}));

const CredentialModal: React.FC<CredentialModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    isEditing = false
}) => {
    const defaultData: CredentialData = {
        name: '',
        institution: '',
        issueYear: null,
        certificateFile: null,
        verificationStatus: 'pending'
    };

    const [formData, setFormData] = useState<CredentialData>(initialData || defaultData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || defaultData);
            setErrors({});
            setFilePreview(initialData?.certificateUrl || null);
        }
    }, [isOpen, initialData]);

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validation = validateCertificateFile(file);
            if (!validation.isValid) {
                setErrors(prev => ({ ...prev, certificateFile: validation.error || '' }));
                return;
            }

            setFormData(prev => ({ ...prev, certificateFile: file }));
            setErrors(prev => ({ ...prev, certificateFile: '' }));

            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFilePreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
        }
    };

    // Remove uploaded file
    const handleRemoveFile = () => {
        setFormData(prev => ({ ...prev, certificateFile: null }));
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle year change
    const handleYearChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            issueYear: value ? parseInt(value) : null
        }));
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate name
        const nameValidation = validateCredentialName(formData.name);
        if (!nameValidation.isValid) {
            newErrors.name = nameValidation.error || '';
        }

        // Validate institution
        const institutionValidation = validateInstitution(formData.institution);
        if (!institutionValidation.isValid) {
            newErrors.institution = institutionValidation.error || '';
        }

        // Validate year
        const yearValidation = validateIssueYear(formData.issueYear);
        if (!yearValidation.isValid) {
            newErrors.issueYear = yearValidation.error || '';
        }

        // Validate certificate file (required for new credentials)
        if (!isEditing && !formData.certificateFile && !formData.certificateUrl) {
            const fileValidation = validateCertificateFile(formData.certificateFile);
            if (!fileValidation.isValid) {
                newErrors.certificateFile = fileValidation.error || '';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle save
    const handleSave = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);

        onSave(formData);
        onClose();
    };

    const getStatusBadge = () => {
        switch (formData.verificationStatus) {
            case 'verified':
                return (
                    <div className={`${styles.statusBadge} ${styles.verified}`}>
                        <CheckIcon />
                        <span>Da xac minh</span>
                    </div>
                );
            case 'rejected':
                return (
                    <div className={`${styles.statusBadge} ${styles.rejected}`}>
                        <CloseIcon />
                        <span>Bi tu choi</span>
                    </div>
                );
            default:
                return (
                    <div className={`${styles.statusBadge} ${styles.pending}`}>
                        <PendingIcon />
                        <span>Dang cho duyet</span>
                    </div>
                );
        }
    };

    return (
        <EditModal
            isOpen={isOpen}
            onClose={onClose}
            onSave={handleSave}
            title={isEditing ? 'Chinh sua chung chi' : 'Them chung chi moi'}
            isLoading={isLoading}
            saveLabel={isEditing ? 'Cap nhat' : 'Gui duyet'}
            size="medium"
        >
            <div className={styles.form}>
                {/* Verification Status (only show when editing) */}
                {isEditing && (
                    <div className={styles.statusSection}>
                        <label className={styles.sectionLabel}>Trang thai xac minh</label>
                        {getStatusBadge()}
                    </div>
                )}

                {/* Credential Name */}
                <FormField
                    type="text"
                    name="credentialName"
                    label="Ten chung chi / bang cap"
                    value={formData.name}
                    onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                    placeholder="VD: TOEFL iBT 115, IELTS 8.0, Bang Cu nhan..."
                    maxLength={200}
                    required
                    error={errors.name}
                />

                {/* Institution */}
                <FormField
                    type="text"
                    name="institution"
                    label="To chuc cap"
                    value={formData.institution}
                    onChange={(value) => setFormData(prev => ({ ...prev, institution: value }))}
                    placeholder="VD: ETS Global, British Council, Dai hoc..."
                    maxLength={200}
                    required
                    error={errors.institution}
                />

                {/* Issue Year */}
                <FormField
                    type="select"
                    name="issueYear"
                    label="Nam cap"
                    value={formData.issueYear?.toString() || ''}
                    onChange={handleYearChange}
                    options={YEARS}
                    placeholder="Chon nam"
                    error={errors.issueYear}
                />

                {/* Certificate Upload */}
                <div className={styles.uploadSection}>
                    <label className={styles.sectionLabel}>
                        File chung chi <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.hint}>Định dạng: JPG, PNG, PDF. Tối đa 10MB</p>

                    {/* File Preview */}
                    {(formData.certificateFile || formData.certificateUrl) && (
                        <div className={styles.filePreview}>
                            {filePreview && filePreview.startsWith('data:image') ? (
                                <img src={filePreview} alt="Certificate preview" className={styles.previewImage} />
                            ) : (
                                <div className={styles.fileInfo}>
                                    <FileIcon />
                                    <span>{formData.certificateFile?.name || 'Uploaded file'}</span>
                                </div>
                            )}
                            <button type="button" className={styles.removeFileBtn} onClick={handleRemoveFile}>
                                <CloseIcon />
                            </button>
                        </div>
                    )}

                    {/* Upload Area */}
                    {!formData.certificateFile && !formData.certificateUrl && (
                        <div
                            className={styles.uploadArea}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <UploadIcon />
                            <span>Nhan de tai len file chung chi</span>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                    />

                    {errors.certificateFile && (
                        <span className={styles.error}>{errors.certificateFile}</span>
                    )}
                </div>

                {/* Note */}
                <div className={styles.note}>
                    <p>
                        Chung chi cua ban se duoc doi ngu Agora xac minh trong vong 24-48 gio.
                        Ban se nhan duoc thong bao khi qua trinh xac minh hoan tat.
                    </p>
                </div>
            </div>
        </EditModal>
    );
};

export default CredentialModal;
