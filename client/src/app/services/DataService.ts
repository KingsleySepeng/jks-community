import { Observable } from "rxjs";
import { Club } from "../model/club";
import {User} from '../model/user';
import {Resource} from '../model/resource';
import {Attendance} from '../model/attendance ';

// Step 1: Abstract service interface for your app
export abstract class DataService {
  abstract getUsers(): Observable<User[]>;
  abstract getUserById(id: string): Observable<User | undefined>;
  abstract addUser(user: User): void;
  abstract updateUser(user: User): void;
  abstract removeUser(userId: string): void;
  abstract getClubs(): Observable<Club[]>;
  abstract getClubById(clubId: string): Observable<Club | undefined>;
  abstract addClub(club: Club): void;
  abstract updateClub(club: Club): void;
  abstract removeClub(clubId: string): void;
  abstract getAttendances(): Observable<Attendance[]>;
  abstract getAllResources(): Observable<Resource[]>;
  abstract addResource(res: Resource): void;
  abstract deleteResource(res: Resource): void;
  abstract updateResource(updated: Resource): void;
  abstract getLoggedInUser(): Observable<User | undefined>;
  abstract getLoggedInUserValue(): User | undefined;
  abstract authenticateUser(email: string, password: string): Observable<User | null>;
  abstract logout(): void;
  // abstract getPayments(): Observable<Payment[]>;
  // abstract addPayment(payment: Payment): void;
  // abstract getEvents(): Observable<Events[]>;
  // abstract addEvent(event: Events): void;
}
