import {Instructor, Student} from './user';

export interface Club {
  id: string;
  name: string;
  address: string;
  contactNumber?: string;
  establishedDate?: Date;
  description?: string;
  instructors?: Instructor[]; // Optional, populated as needed
  students?: Student[];       // Optional, populated as needed
  createdAt: Date;
  updatedAt: Date;
  logoUrl?: string;
}
