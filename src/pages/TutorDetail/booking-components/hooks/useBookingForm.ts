import { useState, useEffect, useMemo } from "react";
import { getStudents, getMyLinkStatus } from "../../../../services/student.service";
import { createBooking } from "../../../../services/booking.service";
import { getCurrentUserRole, getUserIdFromToken } from "../../../../services/auth.service";
import { useFormDraft } from "../../../../hooks/useFormDraft";
import type { StudentType } from "../../../../types/student.type";
import type { CreateBookingPayload } from "../../../../services/booking.service";
import type { BookingFormData } from "../types";

interface Args {
    isOpen: boolean;
    tutorId: string;
    onClose: () => void;
}

/**
 * Encapsulate all booking modal state, draft persistence, role-aware
 * student fetching, and the submit flow. The orchestrator consumes this
 * hook and stays focused on rendering.
 */
export function useBookingForm({ isOpen, tutorId, onClose }: Args) {
    const userRole = getCurrentUserRole();
    const currentUserId = getUserIdFromToken();

    const defaultFormData: BookingFormData = useMemo(() => ({
        studentId: userRole === "Student" ? (currentUserId || "") : "",
        subjectId: 0,
        teachingMode: "online",
        startDate: new Date().toISOString().split("T")[0],
        schedule: [],
        locationCity: "",
        locationDistrict: "",
        locationWard: "",
        locationDetail: "",
        promotionCode: "",
    }), [userRole, currentUserId]);

    const [step, setStep] = useState(0);
    const [students, setStudents] = useState<StudentType[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [successBookingId, setSuccessBookingId] = useState<number | null>(null);
    const [slotDuration, setSlotDuration] = useState(2);
    const [formData, setFormData] = useState<BookingFormData>(defaultFormData);

    const { saveDraft, loadDraft, clearDraft } = useFormDraft<{
        formData: BookingFormData;
        step: number;
        slotDuration: number;
    }>(`draft_booking_${tutorId}`);

    // Fetch student profile for Student role (to get correct studentId)
    useEffect(() => {
        if (!isOpen || userRole !== "Student") return;
        getMyLinkStatus().then(res => {
            const profile = res?.content?.studentProfile;
            if (profile?.studentId) {
                setFormData(d => ({ ...d, studentId: profile.studentId }));
            }
        }).catch(() => {/* ignore */ });
    }, [isOpen, userRole]);

    // Fetch students on modal open (only for Parent role)
    useEffect(() => {
        if (!isOpen) return;
        if (userRole !== "Parent") return;
        const fetchStudents = async () => {
            setLoadingStudents(true);
            try {
                const response = await getStudents();
                const data = response.content || [];
                setStudents(data);
            } catch (err: any) {
                console.error("Failed to fetch students:", err);
                const msg = err.response?.data?.message || "Không thể tải danh sách học sinh";
                alert(`Lỗi: ${msg}`);
                setStudents([]);
            } finally {
                setLoadingStudents(false);
            }
        };
        fetchStudents();
    }, [isOpen, userRole]);

    // Load draft on open, reset UI state on close
    useEffect(() => {
        if (isOpen) {
            const draft = loadDraft();
            if (draft) {
                setFormData(draft.formData || defaultFormData);
                setStep(draft.step || 0);
                setSlotDuration(draft.slotDuration || 2);
            }
        } else {
            setStep(0);
            setSubmitError(null);
            setBookingSuccess(false);
            setSuccessBookingId(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Auto-save draft on form data changes
    useEffect(() => {
        if (isOpen && !bookingSuccess) {
            saveDraft({ formData, step, slotDuration });
        }
    }, [formData, step, slotDuration, isOpen, bookingSuccess, saveDraft]);

    // Auto-dismiss error toast after 5 seconds
    useEffect(() => {
        if (!submitError) return;
        const timer = setTimeout(() => setSubmitError(null), 5000);
        return () => clearTimeout(timer);
    }, [submitError]);

    const handleSubmit = async () => {
        setSubmitting(true);
        setSubmitError(null);
        try {
            const payload: CreateBookingPayload = {
                studentId: formData.studentId,
                tutorId: tutorId,
                subjectId: formData.subjectId,
                teachingMode: formData.teachingMode,
                startDate: formData.startDate,
                schedule: formData.schedule.map((s) => ({
                    dayOfWeek: s.dayOfWeek,
                    startTime: s.startTime,
                    endTime: s.endTime,
                })),
                locationCity: formData.locationCity || undefined,
                locationDistrict: formData.locationDistrict || undefined,
                locationWard: formData.locationWard || undefined,
                locationDetail: formData.locationDetail || undefined,
                promotionCode: formData.promotionCode || undefined,
            };

            const result = await createBooking(payload);
            setSuccessBookingId(result.content?.bookingId || null);
            setBookingSuccess(true);
            clearDraft();
            // Auto-close after 5 seconds
            setTimeout(() => {
                onClose();
            }, 5000);
        } catch (err: any) {
            console.error("createBooking failed:", err);
            const msg = err.response?.data?.message || "Có lỗi xảy ra khi tạo booking. Vui lòng thử lại.";
            setSubmitError(msg);
            // Không đóng modal để user sửa lỗi
        } finally {
            setSubmitting(false);
        }
    };

    return {
        // Form state
        formData,
        setFormData,
        // Step navigation
        step,
        setStep,
        // Slot duration
        slotDuration,
        setSlotDuration,
        // Students fetch (Parent role only)
        students,
        loadingStudents,
        // User context
        userRole,
        // Submission
        submitting,
        submitError,
        setSubmitError,
        handleSubmit,
        // Success state
        bookingSuccess,
        successBookingId,
    };
}
