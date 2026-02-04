import { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    getVerificationProgress,
    updateVideo,
    updateAvatar,
    updateBasicInfo,
    updateIntroduction,
    updatePricing as updatePricingApi,
    type VerificationSections,
    type BasicInfoUpdateData,
    type IntroductionUpdateData,
    type PricingUpdateData
} from '../../../services/tutorProfile.service';
import { getUserIdFromToken } from '../../../services/auth.service';
import { getAvailability, DAY_OF_WEEK_MAP } from '../../../services/availability.service';
import type { AvailabilitySlot as ApiAvailabilitySlot } from '../../../services/availability.service';
import type { IdentityVerificationData } from '../components/IdentityVerificationModal';

// Re-export for convenience
export type { IdentityVerificationData };

// Types
export interface SubjectSelection {
    subjectId: number;
    subjectName: string;
    gradeLevels: string[];  // ['grade_10', 'grade_11', ...]
    tags: string[];  // Tags for this subject (max 5, required)
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
    dayOfWeek: number;  // 0=CN, 1=T2, 2=T3, 3=T4, 4=T5, 5=T6, 6=T7 (for display)
    apiDayOfWeek: number;  // 2-8 (API format)
    startTime: string;
    endTime: string;
    dayName: string;  // "Thứ 2", "Thứ 3", etc.
}

// Section status from API
export type SectionStatus = 'in_progress' | 'updated';

export interface SectionStatuses {
    video: SectionStatus;
    basicInfo: SectionStatus;
    introduction: SectionStatus;
    certificates: SectionStatus;
    identityCard: SectionStatus;
    pricing: SectionStatus;
}

export interface TutorProfileFormData {
    // Hero section (basicInfo)
    avatarUrl: string;
    avatarFile: File | null;
    fullName: string;
    headline: string;
    teachingAreaCity: string;
    teachingAreaDistrict: string;
    teachingMode: 'online' | 'offline' | 'both' | '';
    subjects: SubjectSelection[];  // Now includes tags per subject

    // Display only (not editable)
    averageRating: number;
    totalReviews: number;

    // Pricing
    hourlyRate: number;
    trialLessonPrice: number | null;
    allowPriceNegotiation: boolean;

    // About (introduction)
    bio: string;
    education: string;
    gpaScale: 4 | 10 | null;
    gpa: number | null;
    experience: string;

    // Video
    videoIntroUrl: string | null;

    // Credentials (certificates)
    credentials: CredentialData[];

    // Schedule
    availability: AvailabilitySlot[];

    // Identity Verification (identityCard)
    identityVerification: IdentityVerificationData;
}

// Initial empty data
const initialFormData: TutorProfileFormData = {
    avatarUrl: '',
    avatarFile: null,
    fullName: '',
    headline: '',
    teachingAreaCity: '',
    teachingAreaDistrict: '',
    teachingMode: '',
    subjects: [],

    averageRating: 0,
    totalReviews: 0,

    hourlyRate: 0,
    trialLessonPrice: null,
    allowPriceNegotiation: false,

    bio: '',
    education: '',
    gpaScale: null,
    gpa: null,
    experience: '',

    videoIntroUrl: null,

    credentials: [],

    availability: [],

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

const initialSectionStatuses: SectionStatuses = {
    video: 'in_progress',
    basicInfo: 'in_progress',
    introduction: 'in_progress',
    certificates: 'in_progress',
    identityCard: 'in_progress',
    pricing: 'in_progress'
};

/**
 * Helper: Map teaching mode from API format to frontend format
 */
function mapTeachingModeFromApi(mode: string | null): 'online' | 'offline' | 'both' | '' {
    if (!mode) return '';
    const modeMap: Record<string, 'online' | 'offline' | 'both'> = {
        'online': 'online',
        'Online': 'online',
        'offline': 'offline',
        'Offline': 'offline',
        'both': 'both',
        'Both': 'both',
        'hybrid': 'both',
        'Hybrid': 'both'
    };
    return modeMap[mode] || '';
}

/**
 * Helper: Map teaching mode from frontend format to API format (PascalCase)
 */
function mapTeachingModeToApi(mode: 'online' | 'offline' | 'both' | ''): string {
    const modeMap: Record<string, string> = {
        'online': 'Online',
        'offline': 'Offline',
        'both': 'Both'
    };
    return modeMap[mode] || '';
}

/**
 * Map API response sections to form data
 */
function mapSectionsToFormData(sections: VerificationSections): Partial<TutorProfileFormData> {
    return {
        // Video section
        videoIntroUrl: sections.video.videoUrl,

        // Basic info section
        avatarUrl: sections.basicInfo.avatarUrl || '',
        headline: sections.basicInfo.headline || '',
        teachingAreaCity: sections.basicInfo.teachingAreaCity || '',
        teachingAreaDistrict: sections.basicInfo.teachingAreaDistrict || '',
        // Map teaching mode from API to frontend format
        teachingMode: mapTeachingModeFromApi(sections.basicInfo.teachingMode),
        // Map subjects with gradeLevels converted to string format
        // Note: API may return gradeLevels/tags as JSON string instead of array
        subjects: (sections.basicInfo.subjects || []).map(s => {
            let gradeLevels: string[] = [];
            let tags: string[] = [];

            // Parse gradeLevels
            if (typeof s.gradeLevels === 'string') {
                try {
                    gradeLevels = JSON.parse(s.gradeLevels);
                } catch {
                    gradeLevels = [];
                }
            } else if (Array.isArray(s.gradeLevels)) {
                gradeLevels = s.gradeLevels.map(g => typeof g === 'string' ? g : `grade_${g}`);
            }

            // Parse tags (may also be JSON string from API)
            if (typeof s.tags === 'string') {
                try {
                    tags = JSON.parse(s.tags);
                } catch {
                    tags = [];
                }
            } else if (Array.isArray(s.tags)) {
                tags = s.tags;
            }

            return {
                subjectId: s.subjectId,
                subjectName: s.subjectName || '',
                gradeLevels,
                tags
            };
        }),

        // Introduction section
        bio: sections.introduction.bio || '',
        education: sections.introduction.education || '',
        gpa: sections.introduction.gpa,
        gpaScale: sections.introduction.gpaScale as 4 | 10 | null,
        experience: sections.introduction.experience || '',

        // Certificates section
        credentials: sections.certificates.certificates.map(cert => ({
            id: cert.id,
            name: cert.name,
            institution: cert.institution,
            issueYear: cert.issueYear,
            certificateUrl: cert.certificateUrl,
            verificationStatus: cert.verificationStatus,
            type: cert.type
        })),

        // Identity card section
        identityVerification: {
            idNumber: '',
            fullNameOnId: '',
            dateOfBirth: '',
            idFrontImage: null,
            idFrontImageUrl: sections.identityCard.frontImageUrl || undefined,
            idBackImage: null,
            idBackImageUrl: sections.identityCard.backImageUrl || undefined,
            selfieWithId: null,
            verificationStatus: sections.identityCard.isVerified ? 'verified' :
                sections.identityCard.status === 'updated' ? 'pending' : 'not_submitted'
        },

        // Pricing section
        hourlyRate: sections.pricing.hourlyRate || 0,
        trialLessonPrice: sections.pricing.trialLessonPrice,
        allowPriceNegotiation: sections.pricing.allowPriceNegotiation || false
    };
}

/**
 * Extract section statuses from API response
 */
function mapSectionStatuses(sections: VerificationSections): SectionStatuses {
    return {
        video: sections.video.status,
        basicInfo: sections.basicInfo.status,
        introduction: sections.introduction.status,
        certificates: sections.certificates.status,
        identityCard: sections.identityCard.status,
        pricing: sections.pricing.status
    };
}

export function useTutorProfileForm() {
    const [formData, setFormData] = useState<TutorProfileFormData>(initialFormData);
    const [savedData, setSavedData] = useState<TutorProfileFormData>(initialFormData);
    const [sectionStatuses, setSectionStatuses] = useState<SectionStatuses>(initialSectionStatuses);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Get user ID
    const userId = getUserIdFromToken();

    // Fetch initial data from API
    const fetchProgress = useCallback(async () => {
        if (!userId) {
            console.error('❌ Cannot fetch progress: userId not found');
            setError('User not authenticated');
            setIsInitialLoading(false);
            return;
        }

        try {
            setError(null);
            const response = await getVerificationProgress(userId);

            if (response.statusCode === 200 && response.content?.sections) {
                const mappedData = mapSectionsToFormData(response.content.sections);
                const statuses = mapSectionStatuses(response.content.sections);

                setFormData(prev => ({ ...prev, ...mappedData }));
                setSavedData(prev => ({ ...prev, ...mappedData }));
                setSectionStatuses(statuses);

                console.log('✅ Profile data loaded from API');
            }
        } catch (err: any) {
            console.error('❌ Failed to fetch progress:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to load profile data';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsInitialLoading(false);
        }
    }, [userId]);

    // Fetch availability from API
    const fetchAvailabilityData = useCallback(async () => {
        if (!userId) return;

        try {
            const response = await getAvailability(userId);

            if (response.content && Array.isArray(response.content)) {
                // Map API response to local format
                // API dayofweek: 2=T2, 3=T3, 4=T4, 5=T5, 6=T6, 7=T7, 8=CN
                // Display dayOfWeek: 0=CN, 1=T2, 2=T3, 3=T4, 4=T5, 5=T6, 6=T7
                const mappedAvailability: AvailabilitySlot[] = response.content.map((slot: ApiAvailabilitySlot) => {
                    // Convert API day (2-8) to display day (0-6)
                    // API 2=T2 -> display 1, API 3=T3 -> display 2, ..., API 8=CN -> display 0
                    const displayDayOfWeek = slot.dayofweek === 8 ? 0 : slot.dayofweek - 1;

                    return {
                        id: slot.availabilityid,
                        dayOfWeek: displayDayOfWeek,
                        apiDayOfWeek: slot.dayofweek,
                        startTime: slot.starttime,
                        endTime: slot.endtime,
                        dayName: DAY_OF_WEEK_MAP[slot.dayofweek] || ''
                    };
                });

                setFormData(prev => ({ ...prev, availability: mappedAvailability }));
                setSavedData(prev => ({ ...prev, availability: mappedAvailability }));
            }
        } catch (err: unknown) {
            // Don't show error if 404 (no availability yet)
            const axiosError = err as { response?: { status?: number } };
            if (axiosError.response?.status !== 404) {
                console.error('Failed to fetch availability:', err);
            }
        }
    }, [userId]);

    // Load data on mount
    useEffect(() => {
        fetchProgress();
        fetchAvailabilityData();
    }, [fetchProgress, fetchAvailabilityData]);

    // Check if form has unsaved changes
    const isDirty = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(savedData);
    }, [formData, savedData]);

    // Update hero section
    const updateHeroSection = useCallback((data: Partial<TutorProfileFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    }, []);

    // Update pricing (calls API)
    const updatePricing = useCallback(async (data: {
        hourlyRate: number;
        trialLessonPrice: number | null;
        allowPriceNegotiation: boolean;
    }): Promise<boolean> => {
        if (!userId) {
            toast.error('Không tìm thấy thông tin người dùng');
            return false;
        }

        // Validate hourlyRate
        if (data.hourlyRate < 50000 || data.hourlyRate > 2000000) {
            toast.error('Giá theo giờ phải nằm trong khoảng 50,000 - 2,000,000 VND');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log('💰 Saving pricing...');

            const apiData: PricingUpdateData = {
                hourlyRate: data.hourlyRate,
                trialLessonPrice: data.trialLessonPrice,
                allowPriceNegotiation: data.allowPriceNegotiation
            };

            const response = await updatePricingApi(userId, apiData);

            if (response.statusCode === 200) {
                toast.success(response.message || 'Cập nhật giá thành công!');

                // Refetch progress to get updated data
                const progressResponse = await getVerificationProgress(userId);

                if (progressResponse.statusCode === 200 && progressResponse.content?.sections) {
                    const mappedData = mapSectionsToFormData(progressResponse.content.sections);
                    const statuses = mapSectionStatuses(progressResponse.content.sections);

                    setFormData(prev => ({ ...prev, ...mappedData }));
                    setSavedData(prev => ({ ...prev, ...mappedData }));
                    setSectionStatuses(statuses);
                    setLastSaved(new Date());
                }

                return true;
            } else {
                toast.error(response.message || 'Không thể cập nhật giá');
                return false;
            }
        } catch (err: any) {
            console.error('❌ Error saving pricing:', err);
            const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật giá';
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // Update about section (calls API)
    const updateAbout = useCallback(async (data: {
        bio: string;
        education: string;
        gpaScale: 4 | 10 | null;
        gpa: number | null;
        experience: string;
    }): Promise<boolean> => {
        if (!userId) {
            toast.error('Không tìm thấy thông tin người dùng');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log('📝 Saving introduction...');

            const apiData: IntroductionUpdateData = {
                bio: data.bio,
                education: data.education,
                gpa: data.gpa,
                gpaScale: data.gpaScale,
                experience: data.experience
            };

            const response = await updateIntroduction(userId, apiData);

            if (response.statusCode === 200) {
                toast.success(response.message || 'Cập nhật giới thiệu thành công!');

                // Refetch progress to get updated data
                const progressResponse = await getVerificationProgress(userId);

                if (progressResponse.statusCode === 200 && progressResponse.content?.sections) {
                    const mappedData = mapSectionsToFormData(progressResponse.content.sections);
                    const statuses = mapSectionStatuses(progressResponse.content.sections);

                    setFormData(prev => ({ ...prev, ...mappedData }));
                    setSavedData(prev => ({ ...prev, ...mappedData }));
                    setSectionStatuses(statuses);
                    setLastSaved(new Date());
                }

                return true;
            } else {
                toast.error(response.message || 'Không thể cập nhật giới thiệu');
                return false;
            }
        } catch (err: any) {
            console.error('❌ Error saving introduction:', err);
            const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật giới thiệu';
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // Update video URL (for URL input)
    const updateVideoUrl = useCallback((url: string | null) => {
        setFormData(prev => ({ ...prev, videoIntroUrl: url }));
    }, []);

    // Upload video file via API
    const uploadVideo = useCallback(async (file: File): Promise<string | null> => {
        if (!userId) {
            console.error('❌ Cannot upload video: userId not found');
            return null;
        }

        setIsVideoUploading(true);
        setError(null);

        try {
            // Call the API to upload video
            const response = await updateVideo(userId, file);

            if (response.statusCode === 200) {
                console.log('✅ Video uploaded successfully');

                // Show success toast with API message
                toast.success(response.message || 'Video uploaded successfully!');

                // Refetch progress to get the new video URL
                const progressResponse = await getVerificationProgress(userId);

                if (progressResponse.statusCode === 200 && progressResponse.content?.sections) {
                    const videoUrl = progressResponse.content.sections.video.videoUrl;
                    const statuses = mapSectionStatuses(progressResponse.content.sections);

                    setFormData(prev => ({ ...prev, videoIntroUrl: videoUrl }));
                    setSavedData(prev => ({ ...prev, videoIntroUrl: videoUrl }));
                    setSectionStatuses(statuses);
                    setLastSaved(new Date());

                    return videoUrl;
                }
            } else {
                // Show error toast if statusCode is not 200
                toast.error(response.message || 'Failed to upload video');
            }

            return null;
        } catch (err: any) {
            console.error('❌ Error uploading video:', err);
            const errorMessage = err.response?.data?.message || 'Failed to upload video';
            setError(errorMessage);

            // Show error toast
            toast.error(errorMessage);

            return null;
        } finally {
            setIsVideoUploading(false);
        }
    }, [userId]);

    // Save basic info to API (calls both avatar and basic-info endpoints)
    const saveBasicInfo = useCallback(async (data: {
        avatarFile: File | null;
        headline: string;
        teachingAreaCity: string;
        teachingAreaDistrict: string;
        teachingMode: 'online' | 'offline' | 'both' | '';
        subjects: SubjectSelection[];
    }): Promise<boolean> => {
        if (!userId) {
            toast.error('Không tìm thấy thông tin người dùng');
            return false;
        }

        if (!data.teachingMode) {
            toast.error('Vui lòng chọn hình thức dạy học');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log('📝 Saving basic info...');

            // Step 1: Upload avatar if provided
            if (data.avatarFile) {
                console.log('🖼️ Uploading avatar first...');
                const avatarResponse = await updateAvatar(userId, data.avatarFile);
                if (avatarResponse.statusCode !== 200) {
                    toast.error(avatarResponse.message || 'Không thể tải lên ảnh đại diện');
                    return false;
                }
                console.log('✅ Avatar uploaded successfully');
            }

            // Step 2: Update basic info (JSON)
            const apiData: BasicInfoUpdateData = {
                headline: data.headline,
                teachingAreaCity: data.teachingAreaCity,
                teachingAreaDistrict: data.teachingAreaDistrict,
                teachingMode: mapTeachingModeToApi(data.teachingMode),
                subjects: data.subjects.map(s => ({
                    subjectId: s.subjectId,
                    gradeLevels: s.gradeLevels,  // Already in string format: ["grade_10", ...]
                    tags: s.tags || []  // Tags for this subject
                }))
            };

            const response = await updateBasicInfo(userId, apiData);

            if (response.statusCode === 200) {
                toast.success(response.message || 'Cập nhật thông tin thành công!');

                // Refetch progress to get updated data
                const progressResponse = await getVerificationProgress(userId);

                if (progressResponse.statusCode === 200 && progressResponse.content?.sections) {
                    const mappedData = mapSectionsToFormData(progressResponse.content.sections);
                    const statuses = mapSectionStatuses(progressResponse.content.sections);

                    setFormData(prev => ({ ...prev, ...mappedData }));
                    setSavedData(prev => ({ ...prev, ...mappedData }));
                    setSectionStatuses(statuses);
                    setLastSaved(new Date());
                }

                return true;
            } else {
                toast.error(response.message || 'Không thể cập nhật thông tin');
                return false;
            }
        } catch (err: any) {
            console.error('❌ Error saving basic info:', err);
            const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin';
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

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

    // Save draft (TODO: implement with API when available)
    const saveDraft = useCallback(async () => {
        setIsLoading(true);
        // TODO: Call save draft API
        await new Promise(resolve => setTimeout(resolve, 500));
        setSavedData(formData);
        setLastSaved(new Date());
        setIsLoading(false);
    }, [formData]);

    // Publish changes (TODO: implement with API when available)
    const publishChanges = useCallback(async () => {
        setIsLoading(true);
        // TODO: Call publish API
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
        // All sections must be "updated"
        return Object.values(sectionStatuses).every(status => status === 'updated');
    }, [sectionStatuses]);

    return {
        formData,
        sectionStatuses,
        isDirty,
        isLoading,
        isInitialLoading,
        isVideoUploading,
        lastSaved,
        error,
        canPublish,
        fetchProgress,
        fetchAvailability: fetchAvailabilityData,
        updateHeroSection,
        updatePricing,
        updateAbout,
        updateVideoUrl,
        uploadVideo,
        saveBasicInfo,
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
