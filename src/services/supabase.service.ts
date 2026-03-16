/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from '../lib/supabase';
import type { UploadResult } from '../types/verification.types';
import { getCurrentUser } from './auth.service';

const ID_CARDS_BUCKET = 'id-cards';

/**
 * Upload ID card image to Supabase Storage
 * @param file - Image file to upload
 * @param side - 'front' or 'back'
 * @returns Upload result with path
 */
export const uploadIdCard = async (
    file: File,
    side: 'front' | 'back'
): Promise<UploadResult> => {
    try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            return {
                path: '',
                error: 'Vui lòng chỉ upload file ảnh (JPG, PNG, etc.)'
            };
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return {
                path: '',
                error: 'Kích thước file không được vượt quá 5MB'
            };
        }


        // Get current user
        const user = getCurrentUser();
        if (!user) {
            return {
                path: '',
                error: 'Không tìm thấy thông tin user. Vui lòng đăng nhập lại.'
            };
        }

        // Get userId from JWT token
        let userId = null;

        if (user.accessToken) {
            try {
                // Decode JWT token
                const base64Url = user.accessToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                const payload = JSON.parse(jsonPayload);

                // Try different field names in JWT
                userId = payload.userId || payload.nameid || payload.sub || payload.id;

                console.log('📋 Decoded userId from JWT:', userId);
            } catch (error) {
                console.error('❌ Error decoding JWT:', error);
            }
        }

        // Fallback: try to get from user object directly
        if (!userId) {
            userId = user.id || user.userId || user.ID || user.UserId;
        }

        if (!userId) {
            console.error('❌ Cannot find userId. User data:', user);
            return {
                path: '',
                error: 'Không tìm thấy User ID. Vui lòng đăng nhập lại.'
            };
        }

        // Generate file path: userId/cccd_front.{ext} or userId/cccd_back.{ext}
        const fileExt = file.name.split('.').pop();
        const fileName = `cccd_${side}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        console.log('📤 Uploading ID card to Supabase:', { filePath, size: file.size });

        // Upload to Supabase Storage using admin client (bypasses RLS)
        const { data, error } = await supabaseAdmin.storage
            .from(ID_CARDS_BUCKET)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true // Overwrite if exists
            });

        if (error) {
            console.error('❌ Supabase upload error:', error);
            return {
                path: '',
                error: `Lỗi upload: ${error.message}`
            };
        }

        console.log('✅ Upload successful:', data);

        // Return the file path only - backend will generate fresh signed URLs on demand
        return {
            path: filePath,
            publicUrl: filePath
        };

    } catch (error: any) {
        console.error('❌ Upload error:', error);
        return {
            path: '',
            error: error.message || 'Có lỗi xảy ra khi upload'
        };
    }
};

/**
 * Delete ID card image from Supabase Storage
 * @param path - File path to delete
 */
export const deleteIdCard = async (path: string): Promise<boolean> => {
    try {
        const { error } = await supabaseAdmin.storage
            .from(ID_CARDS_BUCKET)
            .remove([path]);

        if (error) {
            console.error('❌ Delete error:', error);
            return false;
        }

        console.log('✅ Deleted:', path);
        return true;
    } catch (error) {
        console.error('❌ Delete error:', error);
        return false;
    }
};

/**
 * Get download URL for an ID card image
 * @param path - File path in Supabase
 * @param expiresIn - URL expiration time in seconds (default: 1 year)
 * @returns Signed download URL with token
 */
export const getIdCardUrl = async (path: string, expiresIn: number = 31536000): Promise<string | null> => {
    try {
        const { data, error } = await supabaseAdmin.storage
            .from(ID_CARDS_BUCKET)
            .createSignedUrl(path, expiresIn);

        if (error) {
            console.error('❌ Error creating signed URL:', error);
            return null;
        }

        return data?.signedUrl || null;
    } catch (error) {
        console.error('❌ Error getting URL:', error);
        return null;
    }
};
