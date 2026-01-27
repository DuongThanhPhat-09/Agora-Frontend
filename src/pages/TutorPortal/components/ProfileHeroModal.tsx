import React, { useState, useRef, useEffect } from 'react';
import EditModal from './EditModal';
import FormField from './FormField';
import {
    validateAvatar,
    validateHeadline,
    validateCity,
    validateDistrict,
    validateTeachingMode,
    validateSubjects,
    validateGradeLevels,
    validateCustomTags
} from '../utils/validation';
import styles from './ProfileHeroModal.module.css';

// Mock data for cities/districts
const CITIES = [
    { value: 'hanoi', label: 'Ha Noi' },
    { value: 'hcm', label: 'TP. Ho Chi Minh' },
    { value: 'danang', label: 'Da Nang' },
    { value: 'haiphong', label: 'Hai Phong' },
    { value: 'cantho', label: 'Can Tho' },
];

const DISTRICTS: Record<string, { value: string; label: string }[]> = {
    hanoi: [
        { value: 'ba-dinh', label: 'Ba Dinh' },
        { value: 'hoan-kiem', label: 'Hoan Kiem' },
        { value: 'dong-da', label: 'Dong Da' },
        { value: 'hai-ba-trung', label: 'Hai Ba Trung' },
        { value: 'cau-giay', label: 'Cau Giay' },
        { value: 'thanh-xuan', label: 'Thanh Xuan' },
    ],
    hcm: [
        { value: 'quan-1', label: 'Quan 1' },
        { value: 'quan-2', label: 'Quan 2' },
        { value: 'quan-3', label: 'Quan 3' },
        { value: 'quan-7', label: 'Quan 7' },
        { value: 'binh-thanh', label: 'Binh Thanh' },
        { value: 'phu-nhuan', label: 'Phu Nhuan' },
    ],
    danang: [
        { value: 'hai-chau', label: 'Hai Chau' },
        { value: 'son-tra', label: 'Son Tra' },
        { value: 'ngu-hanh-son', label: 'Ngu Hanh Son' },
    ],
    haiphong: [
        { value: 'hong-bang', label: 'Hong Bang' },
        { value: 'le-chan', label: 'Le Chan' },
    ],
    cantho: [
        { value: 'ninh-kieu', label: 'Ninh Kieu' },
        { value: 'cai-rang', label: 'Cai Rang' },
    ],
};

const SUBJECTS = [
    { id: 1, name: 'Toan' },
    { id: 2, name: 'Vat Ly' },
    { id: 3, name: 'Hoa Hoc' },
    { id: 4, name: 'Sinh Hoc' },
    { id: 5, name: 'Tieng Anh' },
    { id: 6, name: 'Ngu Van' },
    { id: 7, name: 'Lich Su' },
    { id: 8, name: 'Dia Ly' },
    { id: 9, name: 'Tin Hoc' },
    { id: 10, name: 'IELTS' },
];

const GRADE_LEVELS = [
    { value: 1, label: 'Lop 1' },
    { value: 2, label: 'Lop 2' },
    { value: 3, label: 'Lop 3' },
    { value: 4, label: 'Lop 4' },
    { value: 5, label: 'Lop 5' },
    { value: 6, label: 'Lop 6' },
    { value: 7, label: 'Lop 7' },
    { value: 8, label: 'Lop 8' },
    { value: 9, label: 'Lop 9' },
    { value: 10, label: 'Lop 10' },
    { value: 11, label: 'Lop 11' },
    { value: 12, label: 'Lop 12' },
    { value: 13, label: 'Dai hoc' },
];

const TEACHING_MODES = [
    { value: 'Online', label: 'Day Online' },
    { value: 'Offline', label: 'Day truc tiep' },
    { value: 'Hybrid', label: 'Ca hai hinh thuc' },
];

// Icons
const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 16V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 4V14M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CloseIcon = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

interface SubjectSelection {
    subjectId: number;
    subjectName: string;
    gradeLevels: number[];
}

interface ProfileHeroData {
    avatarUrl: string;
    avatarFile: File | null;
    headline: string;
    teachingAreaCity: string;
    teachingAreaDistrict: string;
    teachingMode: 'Online' | 'Offline' | 'Hybrid' | '';
    subjects: SubjectSelection[];
    customTags: string[];
}

interface ProfileHeroModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProfileHeroData) => void;
    initialData: ProfileHeroData;
}

const ProfileHeroModal: React.FC<ProfileHeroModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData
}) => {
    const [formData, setFormData] = useState<ProfileHeroData>(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [avatarPreview, setAvatarPreview] = useState<string>(initialData.avatarUrl);
    const [newTag, setNewTag] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData(initialData);
            setAvatarPreview(initialData.avatarUrl);
            setErrors({});
            setNewTag('');
        }
    }, [isOpen, initialData]);

    // Handle avatar upload
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validation = validateAvatar(file);
            if (!validation.isValid) {
                setErrors(prev => ({ ...prev, avatar: validation.error || '' }));
                return;
            }

            setFormData(prev => ({ ...prev, avatarFile: file }));
            setErrors(prev => ({ ...prev, avatar: '' }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle city change (reset district)
    const handleCityChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            teachingAreaCity: value,
            teachingAreaDistrict: ''
        }));
    };

    // Handle subject toggle
    const handleSubjectToggle = (subjectId: number, subjectName: string) => {
        setFormData(prev => {
            const existing = prev.subjects.find(s => s.subjectId === subjectId);
            if (existing) {
                return {
                    ...prev,
                    subjects: prev.subjects.filter(s => s.subjectId !== subjectId)
                };
            } else {
                if (prev.subjects.length >= 5) {
                    setErrors(e => ({ ...e, subjects: 'Chi duoc chon toi da 5 mon hoc' }));
                    return prev;
                }
                return {
                    ...prev,
                    subjects: [...prev.subjects, { subjectId, subjectName, gradeLevels: [] }]
                };
            }
        });
        setErrors(prev => ({ ...prev, subjects: '' }));
    };

    // Handle grade level toggle for a subject
    const handleGradeLevelToggle = (subjectId: number, gradeLevel: number) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.map(subject => {
                if (subject.subjectId === subjectId) {
                    const hasLevel = subject.gradeLevels.includes(gradeLevel);
                    return {
                        ...subject,
                        gradeLevels: hasLevel
                            ? subject.gradeLevels.filter(l => l !== gradeLevel)
                            : [...subject.gradeLevels, gradeLevel]
                    };
                }
                return subject;
            })
        }));
    };

    // Handle custom tag add
    const handleAddTag = () => {
        if (!newTag.trim()) return;
        if (formData.customTags.length >= 10) {
            setErrors(prev => ({ ...prev, customTags: 'Chi duoc them toi da 10 the' }));
            return;
        }
        if (newTag.length > 50) {
            setErrors(prev => ({ ...prev, customTags: 'The khong duoc vuot qua 50 ky tu' }));
            return;
        }
        if (formData.customTags.includes(newTag.trim())) {
            setErrors(prev => ({ ...prev, customTags: 'The nay da ton tai' }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            customTags: [...prev.customTags, newTag.trim()]
        }));
        setNewTag('');
        setErrors(prev => ({ ...prev, customTags: '' }));
    };

    // Handle custom tag remove
    const handleRemoveTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            customTags: prev.customTags.filter(t => t !== tag)
        }));
    };

    // Validate all fields
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate headline
        const headlineValidation = validateHeadline(formData.headline);
        if (!headlineValidation.isValid) {
            newErrors.headline = headlineValidation.error || '';
        }

        // Validate city
        const cityValidation = validateCity(formData.teachingAreaCity);
        if (!cityValidation.isValid) {
            newErrors.city = cityValidation.error || '';
        }

        // Validate district
        const districtValidation = validateDistrict(formData.teachingAreaDistrict);
        if (!districtValidation.isValid) {
            newErrors.district = districtValidation.error || '';
        }

        // Validate teaching mode
        const modeValidation = validateTeachingMode(formData.teachingMode);
        if (!modeValidation.isValid) {
            newErrors.teachingMode = modeValidation.error || '';
        }

        // Validate subjects
        const subjectsValidation = validateSubjects(formData.subjects);
        if (!subjectsValidation.isValid) {
            newErrors.subjects = subjectsValidation.error || '';
        }

        // Validate grade levels for each selected subject
        const subjectsWithoutLevels = formData.subjects.filter(s => s.gradeLevels.length === 0);
        if (subjectsWithoutLevels.length > 0) {
            newErrors.gradeLevels = 'Vui long chon cap do cho moi mon hoc';
        }

        // Validate custom tags
        const tagsValidation = validateCustomTags(formData.customTags);
        if (!tagsValidation.isValid) {
            newErrors.customTags = tagsValidation.error || '';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle save
    const handleSave = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        // Simulate API call
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
            title="Chinh sua thong tin co ban"
            isLoading={isLoading}
            size="large"
        >
            <div className={styles.form}>
                {/* Avatar Upload */}
                <div className={styles.avatarSection}>
                    <label className={styles.sectionLabel}>Anh dai dien</label>
                    <div className={styles.avatarUpload}>
                        <div
                            className={styles.avatarPreview}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar preview" />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    <UploadIcon />
                                    <span>Tai anh len</span>
                                </div>
                            )}
                            <div className={styles.avatarOverlay}>
                                <UploadIcon />
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleAvatarChange}
                            className={styles.fileInput}
                        />
                        <div className={styles.avatarHint}>
                            <p>Dinh dang: JPG, PNG</p>
                            <p>Kich thuoc toi da: 5MB</p>
                        </div>
                    </div>
                    {errors.avatar && <span className={styles.error}>{errors.avatar}</span>}
                </div>

                {/* Headline */}
                <FormField
                    type="text"
                    name="headline"
                    label="Tieu de gioi thieu"
                    value={formData.headline}
                    onChange={(value) => setFormData(prev => ({ ...prev, headline: value }))}
                    placeholder="VD: Gia su Toan - Ly 10 nam kinh nghiem"
                    maxLength={200}
                    required
                    error={errors.headline}
                    hint="10-200 ky tu, mo ta ngan gon ve ban than"
                />

                {/* Location */}
                <div className={styles.row}>
                    <FormField
                        type="select"
                        name="city"
                        label="Thanh pho"
                        value={formData.teachingAreaCity}
                        onChange={handleCityChange}
                        options={CITIES}
                        placeholder="Chon thanh pho"
                        required
                        error={errors.city}
                    />
                    <FormField
                        type="select"
                        name="district"
                        label="Quan/Huyen"
                        value={formData.teachingAreaDistrict}
                        onChange={(value) => setFormData(prev => ({ ...prev, teachingAreaDistrict: value }))}
                        options={DISTRICTS[formData.teachingAreaCity] || []}
                        placeholder="Chon quan/huyen"
                        required
                        disabled={!formData.teachingAreaCity}
                        error={errors.district}
                    />
                </div>

                {/* Teaching Mode */}
                <FormField
                    type="radio"
                    name="teachingMode"
                    label="Hinh thuc day hoc"
                    value={formData.teachingMode}
                    onChange={(value) => setFormData(prev => ({ ...prev, teachingMode: value as ProfileHeroData['teachingMode'] }))}
                    options={TEACHING_MODES}
                    required
                    error={errors.teachingMode}
                />

                {/* Subjects */}
                <div className={styles.subjectsSection}>
                    <label className={styles.sectionLabel}>
                        Mon hoc <span className={styles.required}>*</span>
                        <span className={styles.hint}>(Chon 1-5 mon)</span>
                    </label>
                    <div className={styles.subjectGrid}>
                        {SUBJECTS.map(subject => (
                            <button
                                key={subject.id}
                                type="button"
                                className={`${styles.subjectChip} ${formData.subjects.find(s => s.subjectId === subject.id) ? styles.selected : ''}`}
                                onClick={() => handleSubjectToggle(subject.id, subject.name)}
                            >
                                {subject.name}
                            </button>
                        ))}
                    </div>
                    {errors.subjects && <span className={styles.error}>{errors.subjects}</span>}
                </div>

                {/* Grade Levels per Subject */}
                {formData.subjects.length > 0 && (
                    <div className={styles.gradeLevelsSection}>
                        <label className={styles.sectionLabel}>
                            Cap do day <span className={styles.required}>*</span>
                        </label>
                        {formData.subjects.map(subject => (
                            <div key={subject.subjectId} className={styles.subjectGradeLevels}>
                                <span className={styles.subjectName}>{subject.subjectName}</span>
                                <div className={styles.gradeLevelGrid}>
                                    {GRADE_LEVELS.map(level => (
                                        <button
                                            key={level.value}
                                            type="button"
                                            className={`${styles.gradeChip} ${subject.gradeLevels.includes(level.value) ? styles.selected : ''}`}
                                            onClick={() => handleGradeLevelToggle(subject.subjectId, level.value)}
                                        >
                                            {level.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {errors.gradeLevels && <span className={styles.error}>{errors.gradeLevels}</span>}
                    </div>
                )}

                {/* Custom Tags */}
                <div className={styles.tagsSection}>
                    <label className={styles.sectionLabel}>
                        The tuy chinh
                        <span className={styles.hint}>(Khong bat buoc, toi da 10 the)</span>
                    </label>
                    <div className={styles.tagInput}>
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Nhap the va nhan Enter"
                            maxLength={50}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag();
                                }
                            }}
                        />
                        <button type="button" onClick={handleAddTag}>Them</button>
                    </div>
                    {formData.customTags.length > 0 && (
                        <div className={styles.tagsList}>
                            {formData.customTags.map(tag => (
                                <span key={tag} className={styles.tag}>
                                    {tag}
                                    <button type="button" onClick={() => handleRemoveTag(tag)}>
                                        <CloseIcon />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                    {errors.customTags && <span className={styles.error}>{errors.customTags}</span>}
                </div>
            </div>
        </EditModal>
    );
};

export default ProfileHeroModal;
