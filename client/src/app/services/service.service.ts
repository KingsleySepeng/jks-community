import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {User} from '../model/user';
import {Club} from '../model/club';
import {Attendance} from '../model/attendance ';
import {Resource} from '../model/resource';
import {Role} from '../model/role';
import {DataService} from './DataService';
import {Belt} from '../model/belt';
import {generateId} from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class ServiceService  extends DataService {
  private users$ = new BehaviorSubject<User[]>([]);
  private clubs$ = new BehaviorSubject<Club[]>([]);
  private attendances$ = new BehaviorSubject<Attendance[]>([]);
  private resources$ = new BehaviorSubject<Resource[]>([]);
  private loggedInUser$ = new BehaviorSubject<User | undefined>(undefined);

  constructor() {
    super();
    // Load persisted data if available
    const usersFromStorage = localStorage.getItem('users');
    const clubsFromStorage = localStorage.getItem('clubs');
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (usersFromStorage) {
      this.users$.next(JSON.parse(usersFromStorage));
    } else {
      // Initialize with system admin user
      const defaultUsers: User[] = [
        {
          id: generateId(),
          memberId: 'SYS-ADMIN-001',
          email: 'kingsley@gmail.com',
          firstName: 'Kingsley',
          lastName: 'Sepeng',
          clubId: 'system',
          profileImageUrl: '',
          belt: Belt.BLACK,
          roles: [Role.SYSTEM_ADMIN],
          password: 'admin123',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      this.users$.next(defaultUsers);
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    if (clubsFromStorage) {
      this.clubs$.next(JSON.parse(clubsFromStorage));
    }

    if (loggedInUser) {
      this.loggedInUser$.next(JSON.parse(loggedInUser));
    }
  }

  getUsers(): Observable<User[]> {
    return this.users$.asObservable();
  }

  getUserById(id: string): Observable<User | undefined> {
    return of(this.users$.value.find(u => u.id === id));
  }

  addUser(user: User): void {
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
    localStorage.setItem('users', JSON.stringify(updated));
  }

  updateUser(updatedUser: User): void {
    const users = this.users$.value.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );
    this.users$.next(users);
    localStorage.setItem('users', JSON.stringify(users));
  }

  removeUser(userId: string): void {
    const updated = this.users$.value.filter(u => u.id !== userId);
    this.users$.next(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  }

  getClubs(): Observable<Club[]> {
    return this.clubs$.asObservable();
  }

  getClubById(clubId: string): Observable<Club | undefined> {
    return of(this.clubs$.value.find(c => c.id === clubId));
  }

  addClub(club: Club): void {
    const updated = [...this.clubs$.value, club];
    this.clubs$.next(updated);
    localStorage.setItem('clubs', JSON.stringify(updated));
  }

  updateClub(club: Club): void {
    const updated = this.clubs$.value.map(c => c.id === club.id ? club : c);
    this.clubs$.next(updated);
    localStorage.setItem('clubs', JSON.stringify(updated));
  }

  removeClub(clubId: string): void {
    const updated = this.clubs$.value.filter(c => c.id !== clubId);
    this.clubs$.next(updated);
    localStorage.setItem('clubs', JSON.stringify(updated));
  }

  getAttendances(): Observable<Attendance[]> {
    return this.attendances$.asObservable();
  }

  getAllResources(): Observable<Resource[]> {
    return this.resources$.asObservable();
  }

  addResource(resource: Resource): void {
    const updated = [...this.resources$.value, resource];
    this.resources$.next(updated);
  }
  deleteResourceById(id: string): void {
    const updated = this.resources$.value.filter(r => r.id !== id);
    this.resources$.next(updated);
  }

  updateResource(updated: Resource): void {
    const updatedResources = this.resources$.value.map(r => r.id === updated.id ? updated : r);
    this.resources$.next(updatedResources);
  }

  getLoggedInUser(): Observable<User | undefined> {
    return this.loggedInUser$.asObservable();
  }

  getLoggedInUserValue(): User | undefined {
    return this.loggedInUser$.value;
  }

  authenticateUser(email: string, password: string): Observable<User | null> {
    const user = this.users$.value.find(u => u.email === email && u.password === password) || null;
    this.loggedInUser$.next(user || undefined);
    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    }
    return of(user);
  }

  logout(): void {
    this.loggedInUser$.next(undefined);
    localStorage.removeItem('loggedInUser');
  }


  getClubByIdValue(clubId: string): Club | undefined {
    return this.clubs$.value.find(c=>c.id === clubId);
  }
}
