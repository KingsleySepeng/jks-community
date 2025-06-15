import {Instructor, Student} from './user';

export interface Club {
  id: string;
  name: string;
  address: string;
  contactNumber?: string;
  establishedDate?: Date;
  description?: string;
  instructor?: Instructor;        // ✅ Only ONE main instructor
  students?: Student[];          // ✅ All students (including sub-instructors)
  createdAt: Date;
  updatedAt: Date;
  logoUrl?: string;
}
