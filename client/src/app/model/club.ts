import {Instructor, Student} from './user';

export interface Club {
  id: string;
  clubCode: string;
  name: string;
  address: string;
  contactNumber?: string;
  establishedDate?: Date;
  description?: string;
  instructorId?: string;        // ✅ Only ONE main instructor
  createdAt: Date;
  updatedAt: Date;
  logoUrl?: string;
  isActive: boolean;
}
