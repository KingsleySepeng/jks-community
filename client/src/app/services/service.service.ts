import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, of, map, tap, catchError, throwError} from 'rxjs';
import { User } from '../model/user';
import { Club } from '../model/club';
import { Role } from '../model/role';
import {Attendance, AttendanceSummary} from '../model/attendance ';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private baseUrl = 'http://localhost:8080/api/v1';
  private loggedInUser$ = new BehaviorSubject<User | undefined>(undefined);

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.loggedInUser$.next(JSON.parse(storedUser));
    }
  }

  // ------------------------------------
  // Users
  // ------------------------------------

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  addUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  updateUserPassword(email:string, password:string): Observable<User> {
    const user: Partial<User> = { email, password };
    return this.http.patch<User>(`${this.baseUrl}/users`, user);
  }

  updateUserProfile(user:Partial<User>):Observable<User>{
    return this.http.patch<User>(`${this.baseUrl}/users/profile`, user);

  }
  removeUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }


  toggleSubInstructorRole(user: User): Observable<User> {
    const roles = [...user.roles];
    const index = roles.indexOf(Role.SUB_INSTRUCTOR);

    if (index >= 0) {
      roles.splice(index, 1);
    } else {
      roles.push(Role.SUB_INSTRUCTOR);
    }

    const updated: User = { ...user, roles };
    // return this.updateUser(updated); // Return the Observable
    return of({} as User); // Return an empty User observable

    }
  getUsersByClub(clubId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/clubs/${clubId}/users`);
  }


  addClubWithInstructor(club: Partial<Club>, instructor: Partial<User>): Observable<Club> {
    return this.http.post<Club>(`${this.baseUrl}/clubs`, {
      club,
      instructor
    });
  }

  // ------------------------------------
  // Clubs
  // ------------------------------------
  getClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(`${this.baseUrl}/clubs`);
  }

  getClubById(id: string): Observable<Club> {
    return this.http.get<Club>(`${this.baseUrl}/clubs/${id}`);
  }


  updateClubProfile(club: Club): Observable<Club> {
    return this.http.patch<Club>(`${this.baseUrl}/profile}`, club);
  }

  removeClub(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clubs/${id}`);
  }

  getClubNameForUser(user: User | undefined): Observable<string | undefined> {
    if (!user?.clubId) return of(undefined);
    return this.getClubById(user.clubId).pipe(map(club => club.name));
  }


  // ------------------------------------
  // Attendance
  // ------------------------------------
  saveAttendanceRecords(records: Attendance[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/attendance`, records).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Attendance save failed', error);
        return throwError(() => new Error('Failed to save attendance.'));
      })
    );
  }

  getDetailedAttendance(clubId: string, start: string, end: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(
      `${this.baseUrl}/attendance/club/${clubId}/records?start=${start}&end=${end}`
    );
  }

  getAttendanceSummary(clubId: string, start: string, end: string): Observable<AttendanceSummary[]> {
    return this.http.get<AttendanceSummary[]>(`${this.baseUrl}/attendance/club/${clubId}/summary`, {
      params: { start, end }
    });
  }

  // ------------------------------------
  // Authentication
  // ------------------------------------
  authenticateUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(tap(user => {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        this.loggedInUser$.next(user);
      }));
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.loggedInUser$.next(undefined);
  }

  getLoggedInUser(): Observable<User | undefined> {
    return this.loggedInUser$.asObservable();
  }

  getLoggedInUserValue(): User | undefined {
    return this.loggedInUser$.value;
  }

  // ------------------------------------
  // Utility
  // ------------------------------------

  canUserAccessRoute(user: User | undefined, routeRoles: Role[] | undefined): boolean {
    if (!user?.roles || !routeRoles) return false;
    return user.roles.some(role => routeRoles.includes(role));
  }

  activateStudent(id: string):Observable<void> {
    return this.http.patch<User>(`${this.baseUrl}/users/${id}/activate`, {}).pipe(map(() => {}));
  }
}
