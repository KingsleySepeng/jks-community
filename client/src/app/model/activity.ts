import { ActivityType } from "./activity-type";

export interface Activity {
    id:number;
    userId: number;  // Link to user (Instructor or Student)
    type: ActivityType;    // Type of activity (e.g., 'training', 'competition')
    name: string;
    description: string;
    location:string;
    date:string;
}
