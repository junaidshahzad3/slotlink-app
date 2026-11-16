export type BookingStatusType = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface ServiceDTO {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  priceCents: number;
  packageHrs: number;
}

export interface StudentDTO {
  id: string;
  name: string;
  email: string;
  hoursRemaining: number;
  totalPaidCents: number;
  magicToken: string;
}

export interface BookingDTO {
  id: string;
  studentId: string;
  studentName: string;
  serviceName: string;
  startsAtIso: string;
  status: BookingStatusType | string;
  note: string;
  sessionSummary: string;
  homeworkUrl: string;
  meetingUrl: string;
}

export interface PortalBookingDTO {
  id: string;
  serviceName: string;
  durationMin: number;
  startsAtIso: string;
  status: BookingStatusType | string;
  note: string;
  sessionSummary: string;
  homeworkUrl: string;
  meetingUrl: string;
}

export interface PrefillStudentDTO {
  name: string;
  email: string;
  hoursRemaining: number;
  magicToken: string;
}
