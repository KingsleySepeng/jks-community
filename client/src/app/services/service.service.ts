import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, of, map, tap, catchError, throwError} from 'rxjs';
import { User } from '../model/user';
import { Club } from '../model/club';
import { Role } from '../model/role';
import {Attendance, AttendanceSummary} from '../model/attendance ';
import {Resource, ResourceRequest} from '../model/resource';
import {GradingRecord} from '../model/grading-record';

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
    return this.http.patch<Club>(`${this.baseUrl}/clubs/profile`, club);
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

  // ------------------------------------
  // Resource
  // ------------------------------------
  getResourcesByClub(clubId: string | undefined): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.baseUrl}/resources/club/${clubId}`);
  }

  deleteResourceAndRefresh(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/resources/${id}`);
  }

  createResource(req: ResourceRequest): Observable<Resource> {
    const form = new FormData();
    form.append('info', new Blob([JSON.stringify({
      clubId: req.clubId,
      title: req.title,
      description: req.description
    })], { type: 'application/json' }));
    form.append('file', req.file, req.file.name);
    return this.http.post<Resource>(`${this.baseUrl}/resources`, form);
  }

  // ------------------------------------
  // Grading
  // ------------------------------------
  saveGradingRecord(records: GradingRecord[]): Observable<GradingRecord[]> {
    return this.http.post<GradingRecord[]>(`${this.baseUrl}/grading-records`, records);
  }

  // optionally fetch past records:
  getGradingByClub(clubId: string): Observable<GradingRecord[]> {
    return this.http.get<GradingRecord[]>(`${this.baseUrl}/grading-records/club/${clubId}`);
  }

  getTechniquesForBelt(belt: Belt) {
    
  }
}
