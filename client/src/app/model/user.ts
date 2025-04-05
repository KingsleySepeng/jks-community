import { Attendance } from "./attendance ";
import { Rank } from "./rank";
import { Role } from "./role";
import {Belt} from './belt';

export interface BaseUser {
  id: string;
  memberId: string;
  email: string;
  firstName: string;
  lastName: string;
  clubId: string;
  profileImageUrl: string,
  belt: Belt;
  role: Role;
  password:string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Instructor Interface
export interface Instructor extends BaseUser {
  role: Role.INSTRUCTOR;
  rank: Rank;
  attendance: Attendance[];
  // Additional instructor-specific fields
}

// Student Interface
export interface Student extends BaseUser {
  role: Role.STUDENT;
  rank?: Rank; // If applicable in the future
  attendance: Attendance[];
  // Additional student-specific fields
}

// Admin Interface
export interface Admin extends BaseUser {
  role: Role.ADMIN;
  // Additional admin-specific fields
}

// Union Type for User
export type User = Instructor | Student;
export type AttendanceUser = Student | Instructor;
