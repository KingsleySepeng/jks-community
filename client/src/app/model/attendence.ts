import { Timestamp } from "rxjs";

export interface Attendence {
    date: Date;
    status: 'present' | 'absent'| 'excused';
    instructorId:string;
    comments?:string;
}
