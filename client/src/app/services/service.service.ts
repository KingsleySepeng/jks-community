import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User } from '../model/user';
import { Club } from '../model/club';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private baseUrl = 'http://localhost:8080/api';
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
    return this.http.put<User>(`${this.baseUrl}/users/${user.id}`, user);
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
    const clubId = this.generateMemberId();
    const instructorId = this.generateStudentId();
    const newClub: Club = {
      ...(club as Club),
      id: clubId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Club;
    const newInstructor: User = {
      ...(instructor as User),
      id: instructorId,
      memberId: instructorId,
      clubId: clubId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
    this.addClub(newClub).subscribe();
    this.addUser(newInstructor).subscribe();
  }

  getStudentsByClub(clubId: string): Observable<User[]> {
    return this.getUsers().pipe(
      map(users => users.filter(u => u.clubId === clubId && u.roles?.includes('STUDENT')))
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
    if (!user || !user.clubId) return undefined;
    let name: string | undefined;
    this.getClubById(user.clubId).subscribe(c => name = c?.name);
    return name;
  }

  getClubByIdValue(id: string): Club | undefined {
    let club: Club | undefined;
    this.getClubById(id).subscribe(c => club = c ?? undefined);
    return club;
  }
}
