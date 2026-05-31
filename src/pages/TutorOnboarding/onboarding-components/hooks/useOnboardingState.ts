import { useState, useCallback } from 'react';
import { hasAvailabilityForDuration, isSessionWithinAvailability } from '../availability-utils';
import { HOURS, formatHour } from '../constants';
import type { OnboardingState, OnboardingStep, SubjectRecord, Combo } from '../types';

const clampStep = (n: number): OnboardingStep => Math.min(3, Math.max(1, n)) as OnboardingStep;

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const availabilityId = (dayOfWeek: number, startHour: number) => `${dayOfWeek}-${startHour}`;

export function useOnboardingState() {
  const [state, setState] = useState<OnboardingState>({
    subjectRecords: [],
    availability: [],
    combos: [],
    currentStep: 1,
  });
  // ── Step navigation ──
  const goToStep = useCallback((step: OnboardingStep) => {
    setState((p) => ({ ...p, currentStep: step }));
  }, []);
  const goNext = useCallback(() => {
    setState((p) => ({ ...p, currentStep: clampStep(p.currentStep + 1) }));
  }, []);
  const goBack = useCallback(() => {
    setState((p) => ({ ...p, currentStep: clampStep(p.currentStep - 1) }));
  }, []);

  // ── B1: subject records ──
  // Thêm 1 record (môn, khối, giá). Trả false nếu đã tồn tại (môn, khối).
  const addSubjectRecord = useCallback(
    (input: { subjectId: number; subjectName: string; gradeLevel: string; hourlyRate: number }): boolean => {
      let added = false;
      setState((prev) => {
        const dup = prev.subjectRecords.some(
          (r) => r.subjectId === input.subjectId && r.gradeLevel === input.gradeLevel,
        );
        if (dup) return prev;
        added = true;
        return {
          ...prev,
          subjectRecords: [...prev.subjectRecords, { id: newId(), ...input }],
        };
      });
      return added;
    },
    [],
  );

  const updateSubjectRecord = useCallback((id: string, patch: Partial<Omit<SubjectRecord, 'id'>>) => {
    setState((prev) => ({
      ...prev,
      subjectRecords: prev.subjectRecords.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  const removeSubjectRecord = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      subjectRecords: prev.subjectRecords.filter((r) => r.id !== id),
    }));
  }, []);

  // ── B2: lịch rảnh demo theo từng ô một giờ ──
  const setAvailable = useCallback((dayOfWeek: number, startHour: number, isAvailable: boolean) => {
    setState((prev) => {
      const id = availabilityId(dayOfWeek, startHour);
      const exists = prev.availability.some((slot) => slot.id === id);
      if (isAvailable && !exists) {
        return {
          ...prev,
          availability: [
            ...prev.availability,
            {
              id,
              dayOfWeek,
              startTime: formatHour(startHour),
              endTime: formatHour(startHour + 1),
            },
          ],
        };
      }
      if (!isAvailable && exists) {
        return {
          ...prev,
          availability: prev.availability.filter((slot) => slot.id !== id),
        };
      }
      return prev;
    });
  }, []);

  const toggleAvailabilityDay = useCallback((dayOfWeek: number) => {
    setState((prev) => {
      const selectedHours = new Set(
        prev.availability
          .filter((slot) => slot.dayOfWeek === dayOfWeek)
          .map((slot) => Number(slot.startTime.slice(0, 2))),
      );
      const isFullDay = HOURS.every((hour) => selectedHours.has(hour));
      if (isFullDay) {
        return {
          ...prev,
          availability: prev.availability.filter((slot) => slot.dayOfWeek !== dayOfWeek),
        };
      }

      const additions = HOURS.filter((hour) => !selectedHours.has(hour)).map((hour) => ({
        id: availabilityId(dayOfWeek, hour),
        dayOfWeek,
        startTime: formatHour(hour),
        endTime: formatHour(hour + 1),
      }));
      return {
        ...prev,
        availability: [...prev.availability, ...additions],
      };
    });
  }, []);

  const clearAvailability = useCallback(() => {
    setState((prev) => ({ ...prev, availability: [] }));
  }, []);

  // ── B3: combos (state-only — không call API) ──
  const addCombo = useCallback((combo: Combo) => {
    setState((prev) => ({ ...prev, combos: [...prev.combos, combo] }));
  }, []);
  const updateCombo = useCallback((id: string, next: Combo) => {
    setState((prev) => ({
      ...prev,
      combos: prev.combos.map((c) => (c.id === id ? next : c)),
    }));
  }, []);
  const removeCombo = useCallback((id: string) => {
    setState((prev) => ({ ...prev, combos: prev.combos.filter((c) => c.id !== id) }));
  }, []);

  // ── Derived ──
  const canProceedStep1 = state.subjectRecords.length > 0;
  const canProceedStep2 = state.availability.length > 0;
  const combosMatchAvailability = state.combos.every(
    (combo) =>
      (combo.type === 'flex' && hasAvailabilityForDuration(combo.hoursPerSession, state.availability)) ||
      (combo.type === 'fixed' &&
        combo.sessions.every((session) => isSessionWithinAvailability(session, state.availability))),
  );
  const canFinish = canProceedStep1 && canProceedStep2 && combosMatchAvailability; // B3 combo optional

  return {
    state,
    canProceedStep1,
    canProceedStep2,
    combosMatchAvailability,
    canFinish,
    goToStep,
    goNext,
    goBack,
    addSubjectRecord,
    updateSubjectRecord,
    removeSubjectRecord,
    setAvailable,
    toggleAvailabilityDay,
    clearAvailability,
    addCombo,
    updateCombo,
    removeCombo,
  };
}

export type UseOnboardingState = ReturnType<typeof useOnboardingState>;
