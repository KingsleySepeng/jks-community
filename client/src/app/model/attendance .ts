export interface Attendance {
  id: string;
  date: string; // Use ISO string for LocalDateTime
  status: AttendanceStatus;
  instructorId: string;
  comments?: string;
  userId: string;
  clubId: string;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  EXCUSED = 'EXCUSED',
}

export interface AttendanceSummary {
  userId: string;
  total: number;
  present: number;
  notAttended: number;
  percentage: number;
}
