import { Attendence } from "./attendence";
import { Club } from "./club";
import { Rank } from "./rank";
import { Role } from "./role";

export interface User {
    id: string;
    memberId: string;
    email: string;
    password:string;
    firstName: string;
    lastName: string;
    club: Club;
    role: Role;  // Differentiates between student, instructor, admin
    rank?: Rank;  // Optional field for rank of instructors, could be used for students as well in the future
    isActive: boolean;
    attendance: Attendence[];  // Attendance records for each user
}
