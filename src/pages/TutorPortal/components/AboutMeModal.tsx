import React, { useState, useEffect } from 'react';
import EditModal from './EditModal';
import FormField from './FormField';
import {
    validateBio,
    validateEducation,
    validateGPA,
    validateExperience
} from '../utils/validation';
import styles from './AboutMeModal.module.css';

interface AboutMeData {
    bio: string;
    education: string;
    gpaScale: 4 | 10 | null;
    gpa: number | null;
    experience: string;
}

interface AboutMeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: AboutMeData) => void;
    initialData: AboutMeData;
}

const GPA_SCALES = [
    { value: '', label: 'Chon thang diem' },
    { value: '4', label: 'Thang 4.0' },
    { value: '10', label: 'Thang 10' },
];

const AboutMeModal: React.FC<AboutMeModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData
}) => {
    const [formData, setFormData] = useState<AboutMeData>(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData(initialData);
            setErrors({});
        }
    }, [isOpen, initialData]);

    // Handle GPA scale change
    const handleGpaScaleChange = (value: string) => {
        const scale = value ? (parseInt(value) as 4 | 10) : null;
        setFormData(prev => ({
            ...prev,
            gpaScale: scale,
            gpa: null // Reset GPA when scale changes
        }));
    };

    // Handle GPA value change
    const handleGpaChange = (value: string) => {
        if (!value.trim()) {
            setFormData(prev => ({ ...prev, gpa: null }));
            return;
        }
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setFormData(prev => ({ ...prev, gpa: numValue }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate bio
        const bioValidation = validateBio(formData.bio);
        if (!bioValidation.isValid) {
            newErrors.bio = bioValidation.error || '';
        }

        // Validate education
        const educationValidation = validateEducation(formData.education);
        if (!educationValidation.isValid) {
            newErrors.education = educationValidation.error || '';
        }

        // Validate GPA
        const gpaValidation = validateGPA(formData.gpa, formData.gpaScale);
        if (!gpaValidation.isValid) {
            newErrors.gpa = gpaValidation.error || '';
        }

        // Validate experience
        const experienceValidation = validateExperience(formData.experience);
        if (!experienceValidation.isValid) {
            newErrors.experience = experienceValidation.error || '';
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

    return (
        <EditModal
            isOpen={isOpen}
            onClose={onClose}
            onSave={handleSave}
            title="Chinh sua gioi thieu ban than"
            isLoading={isLoading}
            size="large"
        >
            <div className={styles.form}>
                {/* Bio */}
                <FormField
                    type="textarea"
                    name="bio"
                    label="Gioi thieu ban than"
                    value={formData.bio}
                    onChange={(value) => setFormData(prev => ({ ...prev, bio: value }))}
                    placeholder="Hay viet mot doan gioi thieu ve ban than, kinh nghiem va phuong phap giang day cua ban..."
                    maxLength={2000}
                    rows={6}
                    required
                    error={errors.bio}
                    hint="100-2000 ky tu"
                />

                {/* Education */}
                <FormField
                    type="text"
                    name="education"
                    label="Trinh do hoc van"
                    value={formData.education}
                    onChange={(value) => setFormData(prev => ({ ...prev, education: value }))}
                    placeholder="VD: Cu nhan Su pham Toan - Dai hoc Su pham Ha Noi"
                    maxLength={255}
                    required
                    error={errors.education}
                />

                {/* GPA */}
                <div className={styles.gpaRow}>
                    <FormField
                        type="select"
                        name="gpaScale"
                        label="Thang diem"
                        value={formData.gpaScale?.toString() || ''}
                        onChange={handleGpaScaleChange}
                        options={GPA_SCALES.slice(1)}
                        placeholder="Chon thang diem"
                    />
                    <FormField
                        type="number"
                        name="gpa"
                        label="Diem GPA"
                        value={formData.gpa?.toString() || ''}
                        onChange={handleGpaChange}
                        placeholder={formData.gpaScale === 4 ? 'VD: 3.5' : formData.gpaScale === 10 ? 'VD: 8.5' : 'Chon thang diem truoc'}
                        disabled={!formData.gpaScale}
                        error={errors.gpa}
                    />
                </div>

                {/* Experience */}
                <FormField
                    type="textarea"
                    name="experience"
                    label="Kinh nghiem giang day"
                    value={formData.experience}
                    onChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                    placeholder="Mo ta kinh nghiem giang day cua ban: so nam kinh nghiem, cac lop da day, thanh tich hoc sinh..."
                    maxLength={2000}
                    rows={5}
                    required
                    error={errors.experience}
                    hint="50-2000 ky tu"
                />

                {/* Writing Tips */}
                <div className={styles.tips}>
                    <h4>Meo viet gioi thieu hieu qua</h4>
                    <ul>
                        <li>Neu ro phuong phap giang day dac trung cua ban</li>
                        <li>Chia se thanh tich cua hoc sinh truoc do</li>
                        <li>Giai thich tai sao ban dam me viec giang day</li>
                        <li>Su dung ngon ngu than thien, de tiep can</li>
                    </ul>
                </div>
            </div>
        </EditModal>
    );
};

export default AboutMeModal;
