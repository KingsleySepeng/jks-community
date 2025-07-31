import { Attendance } from "./attendance ";
import { Role } from "./role";
import {Belt} from './belt';

export interface BaseUser {
  id: string;
  memberId: string;
  email: string;
  firstName: string;
  lastName: string;
  club: { id:string };
  profileImageUrl: string,
  belt: Belt;
  roles: Role[]; // ✅ keep this consistent
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Instructor Interface
export interface Instructor extends BaseUser {
  // No override for roles — keep Role[] type
  // You may add instructor-specific properties if needed
}

// Student Interface
export interface Student extends BaseUser {
  attendance: Attendance[];
  // Student-specific properties
}

// Admin Interface
export interface SystemAdmin extends BaseUser {
  // Admin-specific properties
}

// Union Type for User
export type User = Instructor | Student | SystemAdmin;
