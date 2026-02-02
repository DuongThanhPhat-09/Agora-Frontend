import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import EditModal from './EditModal';
import { uploadIdCard } from '../../../services/supabase.service';
import { submitVerification } from '../../../services/verification.service';
import styles from './IdentityVerificationModal.module.css';

// Icons
const IdCardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="8" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 16C5 14.5 6.5 13.5 8 13.5C9.5 13.5 11 14.5 11 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 9H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

const CameraIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const SpinnerIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.spinner}>
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M10 2C14.4183 2 18 5.58172 18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export interface IdentityVerificationData {
    idNumber: string;
    fullNameOnId: string;
    dateOfBirth: string;
    idFrontImage: File | null;
    idFrontImageUrl?: string;
    idBackImage: File | null;
    idBackImageUrl?: string;
    selfieWithId: File | null;
    selfieWithIdUrl?: string;
    verificationStatus: 'not_submitted' | 'pending' | 'verified' | 'rejected';
    rejectionReason?: string;
}

interface IdentityVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: IdentityVerificationData) => void;
    initialData?: IdentityVerificationData;
}

// Validation functions
const validateIdImage = (file: File | null, existingUrl?: string): { isValid: boolean; error?: string } => {
    if (!file && !existingUrl) {
        return { isValid: false, error: 'Vui lòng tải lên ảnh' };
    }
    if (file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return { isValid: false, error: 'Kích thước ảnh không được vượt quá 5MB' };
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            return { isValid: false, error: 'Chỉ chấp nhận định dạng JPG hoặc PNG' };
        }
    }
    return { isValid: true };
};

const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData
}) => {
    const defaultData: IdentityVerificationData = {
        idNumber: '',
        fullNameOnId: '',
        dateOfBirth: '',
        idFrontImage: null,
        idBackImage: null,
        selfieWithId: null,
        verificationStatus: 'not_submitted'
    };

    const [formData, setFormData] = useState<IdentityVerificationData>(initialData || defaultData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isFrontUploading, setIsFrontUploading] = useState(false);
    const [isBackUploading, setIsBackUploading] = useState(false);
    const [frontPath, setFrontPath] = useState<string | null>(null);
    const [backPath, setBackPath] = useState<string | null>(null);
    const [previews, setPreviews] = useState<{
        front: string | null;
        back: string | null;
        selfie: string | null;
    }>({
        front: initialData?.idFrontImageUrl || null,
        back: initialData?.idBackImageUrl || null,
        selfie: initialData?.selfieWithIdUrl || null
    });

    const frontInputRef = useRef<HTMLInputElement>(null);
    const backInputRef = useRef<HTMLInputElement>(null);
    const selfieInputRef = useRef<HTMLInputElement>(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || defaultData);
            setPreviews({
                front: initialData?.idFrontImageUrl || null,
                back: initialData?.idBackImageUrl || null,
                selfie: initialData?.selfieWithIdUrl || null
            });
            setErrors({});
            setFrontPath(null);
            setBackPath(null);
        }
    }, [isOpen, initialData]);

    // Handle file upload for front image
    const handleFrontSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateIdImage(file);
        if (!validation.isValid) {
            setErrors(prev => ({ ...prev, front: validation.error || '' }));
            return;
        }

        // Create preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviews(prev => ({ ...prev, front: reader.result as string }));
        };
        reader.readAsDataURL(file);

        setFormData(prev => ({ ...prev, idFrontImage: file }));
        setErrors(prev => ({ ...prev, front: '' }));
        setIsFrontUploading(true);

        // Upload to Supabase
        const result = await uploadIdCard(file, 'front');

        if (result.error) {
            toast.error(result.error);
            setFormData(prev => ({ ...prev, idFrontImage: null }));
            setPreviews(prev => ({ ...prev, front: null }));
            setIsFrontUploading(false);
            return;
        }

        toast.success('Upload ảnh mặt trước thành công!');
        setFrontPath(result.publicUrl || result.path);
        setIsFrontUploading(false);
    };

    // Handle file upload for back image
    const handleBackSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateIdImage(file);
        if (!validation.isValid) {
            setErrors(prev => ({ ...prev, back: validation.error || '' }));
            return;
        }

        // Create preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviews(prev => ({ ...prev, back: reader.result as string }));
        };
        reader.readAsDataURL(file);

        setFormData(prev => ({ ...prev, idBackImage: file }));
        setErrors(prev => ({ ...prev, back: '' }));
        setIsBackUploading(true);

        // Upload to Supabase
        const result = await uploadIdCard(file, 'back');

        if (result.error) {
            toast.error(result.error);
            setFormData(prev => ({ ...prev, idBackImage: null }));
            setPreviews(prev => ({ ...prev, back: null }));
            setIsBackUploading(false);
            return;
        }

        toast.success('Upload ảnh mặt sau thành công!');
        setBackPath(result.publicUrl || result.path);
        setIsBackUploading(false);
    };

    // Handle selfie upload (optional, stored locally)
    const handleSelfieSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateIdImage(file);
        if (!validation.isValid) {
            setErrors(prev => ({ ...prev, selfie: validation.error || '' }));
            return;
        }

        setFormData(prev => ({ ...prev, selfieWithId: file }));
        setErrors(prev => ({ ...prev, selfie: '' }));

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviews(prev => ({ ...prev, selfie: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    // Remove uploaded file
    const handleRemoveFile = (type: 'front' | 'back' | 'selfie') => {
        const fieldMap = {
            front: 'idFrontImage',
            back: 'idBackImage',
            selfie: 'selfieWithId'
        } as const;

        const urlMap = {
            front: 'idFrontImageUrl',
            back: 'idBackImageUrl',
            selfie: 'selfieWithIdUrl'
        } as const;

        setFormData(prev => ({
            ...prev,
            [fieldMap[type]]: null,
            [urlMap[type]]: undefined
        }));
        setPreviews(prev => ({ ...prev, [type]: null }));

        if (type === 'front') {
            setFrontPath(null);
            if (frontInputRef.current) frontInputRef.current.value = '';
        } else if (type === 'back') {
            setBackPath(null);
            if (backInputRef.current) backInputRef.current.value = '';
        } else {
            if (selfieInputRef.current) selfieInputRef.current.value = '';
        }
    };

    // Validate form before submit
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate front image - must have uploaded path
        if (!frontPath && !formData.idFrontImageUrl) {
            newErrors.front = 'Vui lòng tải lên ảnh mặt trước CCCD';
        }

        // Validate back image - must have uploaded path
        if (!backPath && !formData.idBackImageUrl) {
            newErrors.back = 'Vui lòng tải lên ảnh mặt sau CCCD';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit verification
    const handleSave = async () => {
        if (!validateForm()) return;

        // Check if still uploading
        if (isFrontUploading || isBackUploading) {
            toast.warning('Vui lòng chờ upload ảnh hoàn tất!');
            return;
        }

        // Use uploaded paths or existing URLs
        const frontImagePath = frontPath || formData.idFrontImageUrl;
        const backImagePath = backPath || formData.idBackImageUrl;

        if (!frontImagePath || !backImagePath) {
            toast.error('Vui lòng upload đầy đủ ảnh CCCD cả 2 mặt!');
            return;
        }

        setIsLoading(true);

        try {
            const response = await submitVerification(frontImagePath, backImagePath);

            if (response.success) {
                toast.success('Xác thực danh tính thành công! Admin sẽ xét duyệt trong 24-48h.');

                // Update form data with pending status
                const updatedData: IdentityVerificationData = {
                    ...formData,
                    idFrontImageUrl: frontImagePath,
                    idBackImageUrl: backImagePath,
                    verificationStatus: 'pending'
                };

                onSave(updatedData);
                onClose();
            } else {
                toast.error(response.message || 'Có lỗi xảy ra khi gửi xác thực');
            }
        } catch (error) {
            console.error('Submit verification error:', error);
            toast.error('Không thể kết nối với server. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = () => {
        switch (formData.verificationStatus) {
            case 'verified':
                return (
                    <div className={`${styles.statusBadge} ${styles.verified}`}>
                        <CheckIcon />
                        <span>Đã xác minh</span>
                    </div>
                );
            case 'rejected':
                return (
                    <div className={`${styles.statusBadge} ${styles.rejected}`}>
                        <CloseIcon />
                        <span>Bị từ chối</span>
                    </div>
                );
            case 'pending':
                return (
                    <div className={`${styles.statusBadge} ${styles.pending}`}>
                        <PendingIcon />
                        <span>Đang chờ duyệt</span>
                    </div>
                );
            default:
                return (
                    <div className={`${styles.statusBadge} ${styles.notSubmitted}`}>
                        <IdCardIcon />
                        <span>Chưa xác minh</span>
                    </div>
                );
        }
    };

    const isAlreadyVerified = formData.verificationStatus === 'verified';
    const isReadyToSubmit = (frontPath || formData.idFrontImageUrl) &&
        (backPath || formData.idBackImageUrl) &&
        !isFrontUploading && !isBackUploading;

    return (
        <EditModal
            isOpen={isOpen}
            onClose={onClose}
            onSave={handleSave}
            title="Xác minh danh tính"
            isLoading={isLoading}
            saveLabel={isAlreadyVerified ? 'Đóng' : 'Gửi xác minh'}
            size="large"
            saveDisabled={!isReadyToSubmit && !isAlreadyVerified}
        >
            <div className={styles.form}>
                {/* Verification Status */}
                <div className={styles.statusSection}>
                    <label className={styles.sectionLabel}>Trạng thái xác minh</label>
                    {getStatusBadge()}
                    {formData.verificationStatus === 'rejected' && formData.rejectionReason && (
                        <div className={styles.rejectionReason}>
                            <strong>Lý do từ chối:</strong> {formData.rejectionReason}
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className={styles.instructions}>
                    <h4>Hướng dẫn xác minh</h4>
                    <ul>
                        <li>Chụp ảnh CCCD/CMND rõ ràng, không bị mờ, không bị cắt góc</li>
                        <li>Đảm bảo ánh sáng đủ, không bị chói sáng</li>
                        <li>Toàn bộ thẻ CCCD phải nằm trong khung hình</li>
                        <li>File ảnh dưới 5MB, định dạng JPG hoặc PNG</li>
                    </ul>
                </div>

                {/* ID Card Images */}
                <div className={styles.imageUploads}>
                    {/* Front Image */}
                    <div className={styles.uploadSection}>
                        <label className={styles.sectionLabel}>
                            Mặt trước CCCD/CMND <span className={styles.required}>*</span>
                        </label>
                        {previews.front ? (
                            <div className={styles.imagePreview}>
                                <img src={previews.front} alt="ID Front" />
                                {isFrontUploading && (
                                    <div className={styles.uploadOverlay}>
                                        <SpinnerIcon />
                                        <span>Đang upload...</span>
                                    </div>
                                )}
                                {!isAlreadyVerified && !isFrontUploading && (
                                    <button
                                        type="button"
                                        className={styles.removeBtn}
                                        onClick={() => handleRemoveFile('front')}
                                    >
                                        <CloseIcon />
                                    </button>
                                )}
                                {frontPath && !isFrontUploading && (
                                    <div className={styles.uploadSuccess}>
                                        <CheckIcon />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className={styles.uploadArea}
                                onClick={() => !isAlreadyVerified && frontInputRef.current?.click()}
                            >
                                <IdCardIcon />
                                <span>Tải lên mặt trước</span>
                                <span className={styles.uploadHint}>JPG, PNG - Tối đa 5MB</span>
                            </div>
                        )}
                        <input
                            ref={frontInputRef}
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleFrontSelected}
                            className={styles.fileInput}
                            disabled={isAlreadyVerified || isFrontUploading}
                        />
                        {errors.front && <span className={styles.error}>{errors.front}</span>}
                    </div>

                    {/* Back Image */}
                    <div className={styles.uploadSection}>
                        <label className={styles.sectionLabel}>
                            Mặt sau CCCD/CMND <span className={styles.required}>*</span>
                        </label>
                        {previews.back ? (
                            <div className={styles.imagePreview}>
                                <img src={previews.back} alt="ID Back" />
                                {isBackUploading && (
                                    <div className={styles.uploadOverlay}>
                                        <SpinnerIcon />
                                        <span>Đang upload...</span>
                                    </div>
                                )}
                                {!isAlreadyVerified && !isBackUploading && (
                                    <button
                                        type="button"
                                        className={styles.removeBtn}
                                        onClick={() => handleRemoveFile('back')}
                                    >
                                        <CloseIcon />
                                    </button>
                                )}
                                {backPath && !isBackUploading && (
                                    <div className={styles.uploadSuccess}>
                                        <CheckIcon />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className={styles.uploadArea}
                                onClick={() => !isAlreadyVerified && backInputRef.current?.click()}
                            >
                                <IdCardIcon />
                                <span>Tải lên mặt sau</span>
                                <span className={styles.uploadHint}>JPG, PNG - Tối đa 5MB</span>
                            </div>
                        )}
                        <input
                            ref={backInputRef}
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleBackSelected}
                            className={styles.fileInput}
                            disabled={isAlreadyVerified || isBackUploading}
                        />
                        {errors.back && <span className={styles.error}>{errors.back}</span>}
                    </div>
                </div>

                {/* Selfie with ID (Optional) */}
                <div className={styles.uploadSection}>
                    <label className={styles.sectionLabel}>
                        Ảnh selfie cầm CCCD <span className={styles.optional}>(Không bắt buộc)</span>
                    </label>
                    <p className={styles.selfieHint}>
                        Chụp ảnh bạn cầm CCCD bên cạnh khuôn mặt để tăng độ tin cậy
                    </p>
                    {previews.selfie ? (
                        <div className={styles.imagePreview}>
                            <img src={previews.selfie} alt="Selfie with ID" />
                            {!isAlreadyVerified && (
                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={() => handleRemoveFile('selfie')}
                                >
                                    <CloseIcon />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div
                            className={styles.uploadArea}
                            onClick={() => !isAlreadyVerified && selfieInputRef.current?.click()}
                        >
                            <CameraIcon />
                            <span>Tải lên ảnh selfie</span>
                            <span className={styles.uploadHint}>JPG, PNG - Tối đa 5MB</span>
                        </div>
                    )}
                    <input
                        ref={selfieInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleSelfieSelected}
                        className={styles.fileInput}
                        disabled={isAlreadyVerified}
                    />
                    {errors.selfie && <span className={styles.error}>{errors.selfie}</span>}
                </div>

                {/* Privacy Note */}
                <div className={styles.privacyNote}>
                    <p>
                        Thông tin CCCD/CMND của bạn được bảo mật tuyệt đối và chỉ được sử dụng
                        để xác minh danh tính. Chúng tôi cam kết không chia sẻ thông tin này
                        với bất kỳ bên thứ ba nào.
                    </p>
                </div>
            </div>
        </EditModal>
    );
};

export default IdentityVerificationModal;
