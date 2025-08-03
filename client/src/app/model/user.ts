import {Attendance, AttendanceSummary} from './attendance ';
import { Role } from './role';
import { Belt } from './belt';


export interface User {
  id: string;
  memberId: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  belt: Belt;
  roles: Role[];
  clubId: string; // changed from club object to ID
  password?: string; // optional if not coming from backend
  active: boolean;
  createdAt: string;
  updatedAt: string;
  attendance?: Attendance[];
  attendanceSummary?: AttendanceSummary;

}


