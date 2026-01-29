import { useState, useCallback, useMemo } from 'react';
import type { IdentityVerificationData } from '../components/IdentityVerificationModal';

// Re-export for convenience
export type { IdentityVerificationData };

// Types
export interface SubjectSelection {
    subjectId: number;
    subjectName: string;
    gradeLevels: number[];
}

export interface CredentialData {
    id: number;
    name: string;
    institution: string;
    issueYear: number | null;
    certificateUrl?: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    type: 'education' | 'license' | 'certificate';
}

export interface AvailabilitySlot {
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

export interface TutorProfileFormData {
    // Hero section
    avatarUrl: string;
    avatarFile: File | null;
    fullName: string;
    headline: string;
    teachingAreaCity: string;
    teachingAreaDistrict: string;
    teachingMode: 'Online' | 'Offline' | 'Hybrid' | '';
    subjects: SubjectSelection[];
    customTags: string[];

    // Display only (not editable)
    averageRating: number;
    totalReviews: number;

    // Pricing
    hourlyRate: number;
    trialLessonPrice: number | null;
    allowNegotiation: boolean;

    // About
    bio: string;
    education: string;
    gpaScale: 4 | 10 | null;
    gpa: number | null;
    experience: string;

    // Video
    videoIntroUrl: string | null;

    // Credentials
    credentials: CredentialData[];

    // Schedule
    availability: AvailabilitySlot[];

    // Identity Verification
    identityVerification: IdentityVerificationData;
}

// Initial mock data
const initialFormData: TutorProfileFormData = {
    avatarUrl: '',
    avatarFile: null,
    fullName: 'Sarah Mitchell',
    headline: 'Gia su Toan & Vat Ly | 10+ Nam Kinh Nghiem',
    teachingAreaCity: 'hanoi',
    teachingAreaDistrict: 'cau-giay',
    teachingMode: 'Hybrid',
    subjects: [
        { subjectId: 1, subjectName: 'Toan', gradeLevels: [10, 11, 12] },
        { subjectId: 2, subjectName: 'Vat Ly', gradeLevels: [10, 11, 12] }
    ],
    customTags: ['AP/IB', 'Luyen thi'],

    averageRating: 4.9,
    totalReviews: 127,

    hourlyRate: 250000,
    trialLessonPrice: 150000,
    allowNegotiation: true,

    bio: `Toi la mot nha giao duc dam me voi hon 10 nam kinh nghiem giang day Toan va Vat Ly cho hoc sinh trung hoc. Toi co bang Thac si Toan ung dung tu MIT va da giup hang tram hoc sinh dat duoc muc tieu hoc tap cua ho.

Triet ly giang day cua toi tap trung vao viec xay dung nen tang vung chac va phat trien ky nang giai quyet van de. Toi tin rang moi hoc sinh deu co the xuat sac trong cac mon STEM voi su huong dan va phuong phap tiep can phu hop.`,

    education: 'Thac si Toan ung dung - MIT (2010-2012)',
    gpaScale: 4,
    gpa: 3.8,
    experience: `10+ nam kinh nghiem giang day Toan va Vat Ly cap 3. Da giup 200+ hoc sinh cai thien diem so va thi dau dai hoc thanh cong. Chuyen sau luyen thi AP, IB va SAT Math.`,

    videoIntroUrl: null,

    credentials: [
        {
            id: 1,
            name: 'Thac si Khoa hoc Toan ung dung',
            institution: 'Vien Cong nghe Massachusetts (MIT)',
            issueYear: 2012,
            type: 'education',
            verificationStatus: 'verified'
        },
        {
            id: 2,
            name: 'Chung chi giang day - Massachusetts',
            institution: 'Ban Giao duc Bang',
            issueYear: 2013,
            type: 'license',
            verificationStatus: 'verified'
        }
    ],

    availability: [
        { id: 1, dayOfWeek: 1, startTime: '14:00', endTime: '16:00' },
        { id: 2, dayOfWeek: 1, startTime: '16:30', endTime: '18:30' },
        { id: 3, dayOfWeek: 3, startTime: '14:00', endTime: '16:00' },
        { id: 4, dayOfWeek: 5, startTime: '09:00', endTime: '11:00' }
    ],

    identityVerification: {
        idNumber: '',
        fullNameOnId: '',
        dateOfBirth: '',
        idFrontImage: null,
        idBackImage: null,
        selfieWithId: null,
        verificationStatus: 'not_submitted'
    }
};

export function useTutorProfileForm() {
    const [formData, setFormData] = useState<TutorProfileFormData>(initialFormData);
    const [savedData, setSavedData] = useState<TutorProfileFormData>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Check if form has unsaved changes
    const isDirty = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(savedData);
    }, [formData, savedData]);

    // Update hero section
    const updateHeroSection = useCallback((data: Partial<TutorProfileFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    }, []);

    // Update pricing
    const updatePricing = useCallback((data: {
        hourlyRate: number;
        trialLessonPrice: number | null;
        allowNegotiation: boolean;
    }) => {
        setFormData(prev => ({ ...prev, ...data }));
    }, []);

    // Update about section
    const updateAbout = useCallback((data: {
        bio: string;
        education: string;
        gpaScale: 4 | 10 | null;
        gpa: number | null;
        experience: string;
    }) => {
        setFormData(prev => ({ ...prev, ...data }));
    }, []);

    // Update video URL
    const updateVideoUrl = useCallback((url: string | null) => {
        setFormData(prev => ({ ...prev, videoIntroUrl: url }));
    }, []);

    // Add credential
    const addCredential = useCallback((credential: Omit<CredentialData, 'id'>) => {
        const newId = Math.max(0, ...formData.credentials.map(c => c.id)) + 1;
        setFormData(prev => ({
            ...prev,
            credentials: [...prev.credentials, { ...credential, id: newId }]
        }));
    }, [formData.credentials]);

    // Update credential
    const updateCredential = useCallback((id: number, data: Partial<CredentialData>) => {
        setFormData(prev => ({
            ...prev,
            credentials: prev.credentials.map(c =>
                c.id === id ? { ...c, ...data } : c
            )
        }));
    }, []);

    // Remove credential
    const removeCredential = useCallback((id: number) => {
        setFormData(prev => ({
            ...prev,
            credentials: prev.credentials.filter(c => c.id !== id)
        }));
    }, []);

    // Add availability slot
    const addAvailabilitySlot = useCallback((slot: Omit<AvailabilitySlot, 'id'>) => {
        const newId = Math.max(0, ...formData.availability.map(s => s.id)) + 1;
        setFormData(prev => ({
            ...prev,
            availability: [...prev.availability, { ...slot, id: newId }]
        }));
    }, [formData.availability]);

    // Remove availability slot
    const removeAvailabilitySlot = useCallback((id: number) => {
        setFormData(prev => ({
            ...prev,
            availability: prev.availability.filter(s => s.id !== id)
        }));
    }, []);

    // Update identity verification
    const updateIdentityVerification = useCallback((data: IdentityVerificationData) => {
        setFormData(prev => ({
            ...prev,
            identityVerification: data
        }));
    }, []);

    // Save draft
    const saveDraft = useCallback(async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setSavedData(formData);
        setLastSaved(new Date());
        setIsLoading(false);
    }, [formData]);

    // Publish changes
    const publishChanges = useCallback(async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSavedData(formData);
        setLastSaved(new Date());
        setIsLoading(false);
    }, [formData]);

    // Reset to saved state
    const resetChanges = useCallback(() => {
        setFormData(savedData);
    }, [savedData]);

    // Check if profile is complete enough to publish
    const canPublish = useMemo(() => {
        const hasBasicInfo =
            !!formData.avatarUrl &&
            formData.headline.length >= 10 &&
            !!formData.teachingAreaCity &&
            !!formData.teachingAreaDistrict &&
            !!formData.teachingMode;

        const hasSubjects =
            formData.subjects.length >= 1 &&
            formData.subjects.every(s => s.gradeLevels.length > 0);

        const hasPricing = formData.hourlyRate >= 50000;

        const hasBio = formData.bio.length >= 100;

        const hasExperience = formData.experience.length >= 50;

        return hasBasicInfo && hasSubjects && hasPricing && hasBio && hasExperience;
    }, [formData]);

    return {
        formData,
        isDirty,
        isLoading,
        lastSaved,
        canPublish,
        updateHeroSection,
        updatePricing,
        updateAbout,
        updateVideoUrl,
        addCredential,
        updateCredential,
        removeCredential,
        addAvailabilitySlot,
        removeAvailabilitySlot,
        updateIdentityVerification,
        saveDraft,
        publishChanges,
        resetChanges
    };
}
