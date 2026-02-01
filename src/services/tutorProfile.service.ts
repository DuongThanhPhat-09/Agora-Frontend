/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getCurrentUser } from './auth.service';

const API_BASE_URL = 'http://localhost:5166/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================
// Types for Tutor Verification Progress API
// ============================================

export type SectionStatus = 'in_progress' | 'updated';

export interface SubjectSelection {
    subjectId: number;
    subjectName: string;
    gradeLevels: number[];
}

export interface VideoSection {
    videoUrl: string | null;
    status: SectionStatus;
    updatedAt: string | null;
}

export interface BasicInfoSection {
    avatarUrl: string | null;
    headline: string | null;
    teachingAreaCity: string | null;
    teachingAreaDistrict: string | null;
    teachingMode: string | null;
    subjects: SubjectSelection[];
    status: SectionStatus;
    updatedAt: string | null;
}

export interface IntroductionSection {
    bio: string | null;
    education: string | null;
    gpa: number | null;
    gpaScale: number | null;
    experience: string | null;
    status: SectionStatus;
    updatedAt: string | null;
}

export interface Certificate {
    id: number;
    name: string;
    institution: string;
    issueYear: number | null;
    certificateUrl?: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    type: 'education' | 'license' | 'certificate';
}

export interface CertificatesSection {
    totalCount: number;
    certificates: Certificate[];
    status: SectionStatus;
    updatedAt: string | null;
}

export interface IdentityCardSection {
    frontImageUrl: string | null;
    backImageUrl: string | null;
    isVerified: boolean;
    status: SectionStatus;
    updatedAt: string | null;
}

export interface PricingSection {
    hourlyRate: number;
    trialLessonPrice: number | null;
    allowPriceNegotiation: boolean;
    status: SectionStatus;
    updatedAt: string | null;
}

export interface VerificationSections {
    video: VideoSection;
    basicInfo: BasicInfoSection;
    introduction: IntroductionSection;
    certificates: CertificatesSection;
    identityCard: IdentityCardSection;
    pricing: PricingSection;
}

export interface VerificationProgressResponse {
    content: {
        sections: VerificationSections;
    };
    statusCode: number;
    message: string;
    error: string | null;
}

// Generic API response type
export interface ApiResponse<T = any> {
    content: T;
    statusCode: number;
    message: string;
    error: string | null;
}

// ============================================
// Helper Functions
// ============================================

const getAuthHeaders = () => {
    const user = getCurrentUser();
    return {
        Authorization: `Bearer ${user?.accessToken}`
    };
};

// ============================================
// API Functions
// ============================================

/**
 * Get tutor verification progress
 * GET /api/tutor-verification/{id}/progress
 * 
 * @param userId - User ID (same as tutor ID)
 * @returns Verification progress with all sections
 */
export const getVerificationProgress = async (userId: string): Promise<VerificationProgressResponse> => {
    try {
        console.log('📊 Fetching verification progress for:', userId);

        const response = await api.get(`/tutor-verification/${userId}/progress`, {
            headers: getAuthHeaders()
        });

        console.log('✅ Verification progress fetched:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Error fetching verification progress:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};

/**
 * Upload/Update intro video
 * PUT /api/tutor-verification/{id}/tutor-profile/video
 * 
 * @param userId - User ID (same as tutor ID)
 * @param videoFile - Video file to upload
 * @returns API response
 */
export const updateVideo = async (
    userId: string,
    videoFile: File
): Promise<ApiResponse> => {
    try {
        console.log('🎥 Uploading video for:', userId);
        console.log('File info:', {
            name: videoFile.name,
            size: `${(videoFile.size / 1024 / 1024).toFixed(2)} MB`,
            type: videoFile.type
        });

        const formData = new FormData();
        formData.append('VideoFile', videoFile);

        const response = await api.put(
            `/tutor-verification/${userId}/tutor-profile/video`,
            formData,
            {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        console.log('✅ Video uploaded successfully:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Error uploading video:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};

// ============================================
// TODO: Add more update endpoints here
// - PUT /api/tutor-verification/{id}/tutor-profile/basic-info
// - PUT /api/tutor-verification/{id}/tutor-profile/introduction
// - PUT /api/tutor-verification/{id}/certificates
// - PUT /api/tutor-verification/{id}/identity-card
// - PUT /api/tutor-verification/{id}/pricing
// ============================================
