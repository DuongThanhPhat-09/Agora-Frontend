import { DAY_COLUMNS, END_HOUR, HOURS } from './constants';
import type { ComboSessionSlot, TutorAvailabilitySlot } from './types';

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

const isRangeWithinAvailability = (
  dayOfWeek: number,
  startMinutes: number,
  durationMinutes: number,
  availability: TutorAvailabilitySlot[],
): boolean => {
  const endMinutes = startMinutes + durationMinutes;

  for (let current = startMinutes; current < endMinutes; current += 30) {
    const chunkEnd = current + 30;
    const covered = availability.some(
      (slot) =>
        slot.dayOfWeek === dayOfWeek && current >= toMinutes(slot.startTime) && chunkEnd <= toMinutes(slot.endTime),
    );
    if (!covered) return false;
  }

  return true;
};

export const isSessionWithinAvailability = (
  session: ComboSessionSlot,
  availability: TutorAvailabilitySlot[],
): boolean =>
  isRangeWithinAvailability(session.dayOfWeek, session.startHour * 60, session.durationHours * 60, availability);

export const isHourFullyAvailable = (dayOfWeek: number, hour: number, availability: TutorAvailabilitySlot[]) =>
  isRangeWithinAvailability(dayOfWeek, hour * 60, 60, availability);

export const getAvailableStartHours = (dayOfWeek: number, availability: TutorAvailabilitySlot[]) =>
  HOURS.filter((startHour) => isSessionWithinAvailability({ dayOfWeek, startHour, durationHours: 1 }, availability));

export const getAvailableDurations = (dayOfWeek: number, startHour: number, availability: TutorAvailabilitySlot[]) =>
  [1, 2, 3, 4].filter(
    (durationHours) =>
      startHour + durationHours <= END_HOUR &&
      isSessionWithinAvailability({ dayOfWeek, startHour, durationHours }, availability),
  );

export const hasAvailabilityForDuration = (durationHours: number, availability: TutorAvailabilitySlot[]) => {
  const durationMinutes = durationHours * 60;
  for (const day of DAY_COLUMNS) {
    for (let startMinutes = 0; startMinutes + durationMinutes <= 24 * 60; startMinutes += 30) {
      if (isRangeWithinAvailability(day.dayOfWeek, startMinutes, durationMinutes, availability)) return true;
    }
  }
  return false;
};

const sessionsOverlap = (left: ComboSessionSlot, right: ComboSessionSlot) =>
  left.dayOfWeek === right.dayOfWeek &&
  left.startHour < right.startHour + right.durationHours &&
  right.startHour < left.startHour + left.durationHours;

export const findFirstAvailableSession = (
  availability: TutorAvailabilitySlot[],
  selectedSessions: ComboSessionSlot[] = [],
): ComboSessionSlot | null => {
  for (const day of DAY_COLUMNS) {
    for (const startHour of getAvailableStartHours(day.dayOfWeek, availability)) {
      const candidate = { dayOfWeek: day.dayOfWeek, startHour, durationHours: 1 };
      if (!selectedSessions.some((session) => sessionsOverlap(session, candidate))) return candidate;
    }
  }
  return null;
};
