import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {User} from '../model/user';
import {Club} from '../model/club';
import {Role} from '../model/role';
import {Attendance} from '../model/attendance ';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private baseUrl = 'http://localhost:8080/api/v1';
  private loggedInUser$ = new BehaviorSubject<User | undefined>(undefined);

  constructor(private http: HttpClient) {}

  // ------------------------------------
  // Users
  // ------------------------------------
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUserById(id: string): Observable<User | undefined> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${user.id}`, user);
  }

  removeUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  // ------------------------------------
  // Clubs
  // ------------------------------------
  getClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(`${this.baseUrl}/clubs`);
  }

  getClubById(id: string): Observable<Club | undefined> {
    return this.http.get<Club>(`${this.baseUrl}/clubs/${id}`);
  }

  addClub(club: Club): Observable<Club> {
    return this.http.post<Club>(`${this.baseUrl}/clubs`, club);
  }

  updateClub(club: Club): Observable<Club> {
    return this.http.put<Club>(`${this.baseUrl}/clubs/${club.id}`, club);
  }

  removeClub(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clubs/${id}`);
  }

  updatePasswordByEmail(email: string, password: string): void {
    this.getUsers().subscribe(users => {
      const user = users.find(u => u.email === email);
      if (user) {
        const updated = { ...user, password } as User;
        this.updateUser(updated).subscribe();
      }
    });
  }

addClubWithInstructor(club: Partial<Club>, instructor: Partial<User>): void {
  const newInstructor: User = {
    ...(instructor as User),
    firstName: instructor.firstName ?? '', // Default to empty string if undefined
    lastName: instructor.lastName ?? '',   // Default to empty string if undefined
    email: instructor.email ?? '',         // Default to empty string if undefined
  };

  this.addUser(newInstructor).subscribe(createdInstructor => {
    const newClub: Club = {
      ...(club as Club),
      name: club.name ?? '',               // Default to empty string if undefined
      address: club.address ?? '',         // Default to empty string if undefined
      description: club.description ?? '', // Default to empty string if undefined
      contactNumber: club.contactNumber ?? '', // Default to empty string if undefined
      establishedDate: club.establishedDate ?? new Date(), // Default to current date if undefined
      instructorId: createdInstructor.id,       // Set the instructor here
    };

    this.addClub(newClub).subscribe(createdClub => {
      const updatedInstructor: User = {
        ...createdInstructor,
        club: {id:createdClub.id} as Club, // Use `clubId` instead of `club` to match the `User` type
      };
      this.updateUser(updatedInstructor).subscribe();
    });
  });
}


  getStudentsByClub(clubId: string): Observable<User[]> {
    return this.getUsers().pipe(
      map(users => users.filter(u => u.club.id === clubId && u.roles?.includes(Role.STUDENT)))
    );
  }

  toggleSubInstructorRole(user: User): void {
    const has = (user.roles as unknown as string[]).includes('SUB_INSTRUCTOR');
    const roles = has
      ? (user.roles as unknown as string[]).filter(r => r !== 'SUB_INSTRUCTOR')
      : [...(user.roles as unknown as string[]), 'SUB_INSTRUCTOR'];
    const updated = { ...user, roles } as User;
    this.updateUser(updated).subscribe();
  }

  // ------------------------------------
  // Authentication
  // ------------------------------------
  authenticateUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(tap(user => this.loggedInUser$.next(user)));
  }

  logout(): void {
    this.loggedInUser$.next(undefined);
  }

  getLoggedInUser(): Observable<User | undefined> {
    return this.loggedInUser$.asObservable();
  }

  getLoggedInUserValue(): User | undefined {
    return this.loggedInUser$.value;
  }

  // Utility methods still used by components
  generateStudentId(): string { return 'S' + Math.floor(Math.random() * 1000); }
  generateMemberId(): string { return 'M' + Math.floor(Math.random() * 1000); }

  canUserAccessRoute(user: User | undefined, roles: string[]): boolean {
    if (!user) return false;
    return roles.some(r => (user.roles as unknown as string[]).includes(r));
  }

  getClubNameForUser(user: User | undefined): string | undefined {
    if (!user || !user.club) return undefined;
    let name: string | undefined;
    this.getClubById(user.club.id).subscribe(c => name = c?.name);
    return name;
  }

  getClubByIdValue(id: string): Club | undefined {
    let club: Club | undefined;
    this.getClubById(id).subscribe(c => club = c ?? undefined);
    return club;
  }

  saveAttendanceRecords(records: Attendance[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/attendance/bulk`, records);
  }

  getAttendanceByStudent(studentId: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/attendance/student/${studentId}`);
  }

  getAttendanceBetween(clubId: string, start: string, end: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/attendance/club/${clubId}?start=${start}&end=${end}`);
  }
}
