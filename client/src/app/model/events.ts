export interface Events {
  id: string;
  eventName: string;
  location: string;
  date: Date;
  cost: number;
  paymentDueDate: Date;
  // Additional fields:
  //   registrations: e.g., array of user IDs or something for tracking interest
  interestedStudents: string[];  // Student IDs that indicated interest
  finalRegistrations: string[];  // Final group of students (instructor-submitted)
  maxEntries: number;
  description: string;
  instructorId:string;
  clubId:string;
}
