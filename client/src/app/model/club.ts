import { User } from "./user";

export interface Club {
    id: number;
    name: string;
    address:string;
    instructors :User []; // head instructor and sub/senior instructors
    students: User []; //
}
