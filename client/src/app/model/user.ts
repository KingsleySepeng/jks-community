import { Attendance } from './attendance ';
import { Role } from './role';
import { Belt } from './belt';

export interface BaseUser {
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
  club?: { id: string };
}

// Specialized User Types
export interface Instructor extends BaseUser {
  // Add instructor-specific fields here later
}

export interface Student extends BaseUser {
  attendance: Attendance[];
}

export interface SystemAdmin extends BaseUser {
  // Add admin-specific fields here later
}

// Unified Type
export type User = Instructor | Student | SystemAdmin;
