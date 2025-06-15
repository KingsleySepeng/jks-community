// Step 2: MockDataService using BehaviorSubjects
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {Instructor, Student, User} from '../model/user';
import { Club } from '../model/club';
import {Attendance, AttendanceStatus} from '../model/attendance ';
import { Payment } from '../model/payment';
import { Events } from '../model/events';
import { Resource } from '../model/resource';
import {DataService} from './DataService';
import {Belt} from '../model/belt';
import {Role} from '../model/role';
import {GradingRecord} from '../model/grading-record';

@Injectable({ providedIn: 'root' })
export class NewMockDataService extends DataService {
  private users$ = new BehaviorSubject<User[]>([]);
  private clubs$ = new BehaviorSubject<Club[]>([]);
  private attendances$ = new BehaviorSubject<Attendance[]>([]);
  private payments$ = new BehaviorSubject<Payment[]>([]);
  private events$ = new BehaviorSubject<Events[]>([]);
  private resources$ = new BehaviorSubject<Resource[]>([]);
  private loggedInUser$ = new BehaviorSubject<User | undefined>(undefined);

  constructor() {
    super();}

  getUsers(): Observable<User[]> {
    return this.users$.asObservable();
  }
  getUserById(id: string): Observable<User | undefined> {
    return of(this.users$.value.find(u => u.id === id));
  }
  addUser(user: User): void {
    // Ensure we only keep one instructor per club
    if (user.roles.includes(Role.INSTRUCTOR)) {
      const existingInstructors = this.users$.value.filter(
        u => u.clubId === user.clubId && u.roles.includes(Role.INSTRUCTOR)
      );
      if (existingInstructors.length > 0) {
        console.warn(`Instructor already exists for club ${user.clubId}`);
        return;
      }
    }

    const updated = [...this.users$.value, user];
    this.users$.next(updated);
  }

  updateUser(updatedUser: User): void {
    const users = this.users$.value.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );
    this.users$.next(users);
  }

  removeUser(userId: string): void {
    const updated = this.users$.value.filter(u => u.id !== userId);
    this.users$.next(updated);
  }

  getClubs(): Observable<Club[]> {
    return this.clubs$.asObservable();
  }
  getClubById(clubId: string): Observable<Club | undefined> {
    return of(this.clubs$.value.find(c => c.id === clubId));
  }
  addClub(club: Club): void {
    this.clubs$.next([...this.clubs$.value, club]);
  }
  updateClub(club: Club): void {
    const updated = this.clubs$.value.map(c => c.id === club.id ? club : c);
    this.clubs$.next(updated);
  }
  removeClub(clubId: string): void {
    const updated = this.clubs$.value.filter(c => c.id !== clubId);
    this.clubs$.next(updated);
  }

  getAttendances(): Observable<Attendance[]> {
    return this.attendances$.asObservable();
  }

  getAllResources(): Observable<Resource[]> {
    return this.resources$.asObservable();
  }

  deleteResource(res: Resource): void {}
  addResource(res: Resource): void {
    this.resources$.next([...this.resources$.value, res]);
  }
  updateResource(updated: Resource): void {
    const updatedResources = this.resources$.value.map(r => r.id === updated.id ? updated : r);
    this.resources$.next(updatedResources);
  }
  getLoggedInUser(): Observable<User | undefined> {
    return this.loggedInUser$.asObservable();
  }

  authenticateUser(email: string, password: string): Observable<User | null> {
    const user = this.users$.value.find(u => u.email === email && u.password === password) || null;
    this.loggedInUser$.next(user || undefined);
    return of(user);
  }
  logout(): void {
    this.loggedInUser$.next(undefined);
  }

}
