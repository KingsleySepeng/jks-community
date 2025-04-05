export interface Attendance {
    id: string;
    date: Date;
    status: AttendanceStatus;
    instructorId:string;
    comments?:string;
    userId: string; // The user whose attendance is being recorded
    clubId: string; // Reference to the club/session
    createdAt: Date;
    updatedAt: Date;

}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  EXCUSED = 'excused',
}

export interface AttendanceSummary {
  total: number;
  present: number;
  notAttended: number;
  percentage: number;
}
