import type { StudentType } from "../../../types/student.type";
import type { AvailabilitySlot, SubjectInfo } from "../../../services/tutorDetail.service";

export interface ScheduleSlot {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

export interface Subject {
    id: number;
    name: string;
}

export interface BookingFormData {
    studentId: string;
    subjectId: number;
    teachingMode: "online" | "offline" | "hybrid";
    startDate: string;
    schedule: ScheduleSlot[];
    locationCity: string;
    locationDistrict: string;
    locationWard: string;
    locationDetail: string;
    promotionCode: string;
}

export interface StepProps {
    formData: BookingFormData;
    setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
    hourlyRate: number;
    students: StudentType[];
    loadingStudents: boolean;
    availableSubjects: Subject[];
    availabilities: AvailabilitySlot[];
    slotDuration: number;
    setSlotDuration: React.Dispatch<React.SetStateAction<number>>;
    userRole: string | null;
}

export interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    tutorName: string;
    tutorId: string;
    hourlyRate: number;
    subjects: SubjectInfo[];
    availabilities?: AvailabilitySlot[] | null;
}
