import { useState, useCallback } from 'react';
import type { OnboardingState, OnboardingStep, OnboardingSubject, Combo } from '../types';
import { HOURS } from '../constants';

const slotKey = (dayOfWeek: number, startHour: number) => `${dayOfWeek}-${startHour}`;

const createSubject = (subjectId: number, subjectName: string): OnboardingSubject => ({
    subjectId,
    subjectName,
    hourlyRate: null,
});

const clampStep = (n: number): OnboardingStep => Math.min(4, Math.max(1, n)) as OnboardingStep;

export function useOnboardingState() {
    const [state, setState] = useState<OnboardingState>({
        subjects: [],
        availability: [],
        combos: [],
        currentStep: 1,
    });

    // ── Step navigation ──
    const goToStep = useCallback((step: OnboardingStep) => {
        setState((prev) => ({ ...prev, currentStep: step }));
    }, []);
    const goNext = useCallback(() => {
        setState((prev) => ({ ...prev, currentStep: clampStep(prev.currentStep + 1) }));
    }, []);
    const goBack = useCallback(() => {
        setState((prev) => ({ ...prev, currentStep: clampStep(prev.currentStep - 1) }));
    }, []);

    // ── B1: subjects ──
    const toggleSubject = useCallback((subjectId: number, subjectName: string) => {
        setState((prev) => {
            const exists = prev.subjects.some((s) => s.subjectId === subjectId);
            if (exists) {
                // Combo không ràng buộc môn nữa (phụ huynh chọn lúc booking) → giữ nguyên.
                return {
                    ...prev,
                    subjects: prev.subjects.filter((s) => s.subjectId !== subjectId),
                };
            }
            return { ...prev, subjects: [...prev.subjects, createSubject(subjectId, subjectName)] };
        });
    }, []);

    // ── B2: giá/giờ + nhận booking (per môn) ──
    const setSubjectHourlyRate = useCallback((subjectId: number, rate: number | null) => {
        setState((prev) => ({
            ...prev,
            subjects: prev.subjects.map((s) => (s.subjectId !== subjectId ? s : { ...s, hourlyRate: rate })),
        }));
    }, []);

    // ── B3: lịch rảnh (chung cho tutor) ──
    const setAvailable = useCallback((dayOfWeek: number, startHour: number, on: boolean) => {
        setState((prev) => {
            const id = slotKey(dayOfWeek, startHour);
            const exists = prev.availability.some((sl) => sl.id === id);
            if (on && !exists) {
                return { ...prev, availability: [...prev.availability, { id, dayOfWeek, startHour }] };
            }
            if (!on && exists) {
                return { ...prev, availability: prev.availability.filter((sl) => sl.id !== id) };
            }
            return prev;
        });
    }, []);

    // Toggle cả ngày: đã đủ tất cả giờ → bỏ; chưa đủ → thêm các giờ còn thiếu.
    const toggleWholeDay = useCallback((dayOfWeek: number) => {
        setState((prev) => {
            const present = new Set(
                prev.availability.filter((sl) => sl.dayOfWeek === dayOfWeek).map((sl) => sl.startHour),
            );
            const allSelected = HOURS.every((h) => present.has(h));
            if (allSelected) {
                return { ...prev, availability: prev.availability.filter((sl) => sl.dayOfWeek !== dayOfWeek) };
            }
            const additions = HOURS.filter((h) => !present.has(h)).map((h) => ({
                id: slotKey(dayOfWeek, h),
                dayOfWeek,
                startHour: h,
            }));
            return { ...prev, availability: [...prev.availability, ...additions] };
        });
    }, []);

    // ── B4: combos ──
    const addCombo = useCallback((combo: Combo) => {
        setState((prev) => ({ ...prev, combos: [...prev.combos, combo] }));
    }, []);

    const updateCombo = useCallback((id: string, next: Combo) => {
        setState((prev) => ({ ...prev, combos: prev.combos.map((c) => (c.id === id ? next : c)) }));
    }, []);

    const removeCombo = useCallback((id: string) => {
        setState((prev) => ({ ...prev, combos: prev.combos.filter((c) => c.id !== id) }));
    }, []);

    // ── Derived ──
    const canProceedStep1 = state.subjects.length > 0;
    const canProceedStep2 =
        state.subjects.length > 0 && state.subjects.every((s) => s.hourlyRate != null && s.hourlyRate > 0);
    const canProceedStep3 = state.availability.length > 0;
    // B4 combo là khuyến khích, không bắt buộc.
    const canFinish = canProceedStep1 && canProceedStep2 && canProceedStep3;

    return {
        state,
        canProceedStep1,
        canProceedStep2,
        canProceedStep3,
        canFinish,
        goToStep,
        goNext,
        goBack,
        toggleSubject,
        setSubjectHourlyRate,
        setAvailable,
        toggleWholeDay,
        addCombo,
        updateCombo,
        removeCombo,
    };
}

export type UseOnboardingState = ReturnType<typeof useOnboardingState>;
