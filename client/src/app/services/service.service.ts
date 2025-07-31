import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, map, tap } from 'rxjs';
import { User } from '../model/user';
import { Club } from '../model/club';
import { Role } from '../model/role';
import { Attendance } from '../model/attendance ';

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
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  addUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  updateUser(user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${user.id}`, user);
  }

  removeUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  getStudentsByClub(clubId: string): Observable<User[]> {
    return this.getUsers().pipe(
      map(users =>
        users.filter(
          u => u.clubId === clubId && u.roles.includes(Role.STUDENT)
        )
      )
    );
  }

  toggleSubInstructorRole(user: User): void {
    const roles = [...user.roles];
    const index = roles.indexOf(Role.SUB_INSTRUCTOR);

    if (index >= 0) {
      roles.splice(index, 1);
    } else {
      roles.push(Role.SUB_INSTRUCTOR);
    }

    const updated: User = { ...user, roles };
    this.updateUser(updated).subscribe();
  }

  addClubWithInstructor(club: Partial<Club>, instructor: Partial<User>): void {
    const newInstructor: Partial<User> = {
      ...instructor,
      firstName: instructor.firstName ?? '',
      lastName: instructor.lastName ?? '',
      email: instructor.email ?? '',
    };

    this.addUser(newInstructor).subscribe(createdInstructor => {
      const newClub: Partial<Club> = {
        ...club,
        name: club.name ?? '',
        address: club.address ?? '',
        description: club.description ?? '',
        contactNumber: club.contactNumber ?? '',
        establishedDate: club.establishedDate ?? new Date().toISOString(),
        instructorId: createdInstructor.id,
      };

      this.addClub(newClub as Club).subscribe(createdClub => {
        const updatedInstructor: Partial<User> = {
          ...createdInstructor,
          clubId: createdClub.id,
        };
        this.updateUser(updatedInstructor as User).subscribe();
      });
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

  addClub(club: Partial<Club>): Observable<Club> {
    return this.http.post<Club>(`${this.baseUrl}/clubs`, club);
  }

  updateClub(club: Club): Observable<Club> {
    return this.http.put<Club>(`${this.baseUrl}/clubs/${club.id}`, club);
  }

  removeClub(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clubs/${id}`);
  }

  getClubNameForUser(user: User | undefined): Observable<string | undefined> {
    if (!user?.clubId) return of(undefined);
    return this.getClubById(user.clubId).pipe(map(club => club.name));
  }

  getClubByIdValue(id: string): Observable<Club | undefined> {
    return this.getClubById(id);
  }

  // ------------------------------------
  // Attendance
  // ------------------------------------
  saveAttendanceRecords(records: Attendance[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/attendance`, records);
  }

  getAttendanceByStudent(studentId: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/attendance/student/${studentId}`);
  }

  getAttendanceBetween(clubId: string, start: string, end: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/attendance/club/${clubId}?start=${start}&end=${end}`);
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
  generateStudentId(): string {
    return 'S' + Math.floor(Math.random() * 1000);
  }

  generateMemberId(): string {
    return 'M' + Math.floor(Math.random() * 1000);
  }

  canUserAccessRoute(user: User | undefined, roles: Role[]): boolean {
    return !!user && roles.some(r => user.roles.includes(r));
  }
}
