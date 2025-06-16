import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, of} from 'rxjs';
import {Instructor, Student, User} from '../model/user';
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
export class ServiceService {
  private users$ = new BehaviorSubject<User[]>([]);
  private clubs$ = new BehaviorSubject<Club[]>([]);
  private attendances$ = new BehaviorSubject<Attendance[]>([]);
  private resources$ = new BehaviorSubject<Resource[]>([]);
  private loggedInUser$ = new BehaviorSubject<User | undefined>(undefined);
  private selectedCategory$ = new BehaviorSubject<string>('All');

  constructor() {
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

  //TODO: BOTH GENERATE METHODS WILL BE REMOVED WHEN BACKEND IS CREATED
  generateStudentId(): string {
    return 'S' + Math.floor(Math.random() * 1000);
  }

  generateMemberId(): string {
    return 'M' + Math.floor(Math.random() * 1000);
  }

  canUserAccessRoute(user: User | undefined, allowedRoles: Role[]): boolean {
    if (!user) return false;
    return allowedRoles.some(role => user.roles.includes(role));
  }
  getClubNameForUser(user: User | undefined): string | undefined {
    if (!user || !user.clubId) return undefined;
    return this.getClubByIdValue(user.clubId)?.name;
  }

  getStudentsByClub(clubId: string) {
    return this.getUsers().pipe(
      map(users =>
        users.filter(u => u.clubId === clubId && u.roles.includes(Role.STUDENT)) as Student[]
      )
    );
  }

  toggleSubInstructorRole(user: User): void {
    const isSubInstructor = user.roles.includes(Role.SUB_INSTRUCTOR);
    const updatedUser: User = {
      ...user,
      roles: isSubInstructor
        ? user.roles.filter(role => role !== Role.SUB_INSTRUCTOR)
        : [...user.roles, Role.SUB_INSTRUCTOR]
    };
    this.updateUser(updatedUser);
  }
  addClubWithInstructor(clubData: Partial<Club>, instructorData: Partial<Instructor>): void {
    const clubId = generateId();
    const instructorId = generateId();

    const instructor: Instructor = {
      ...instructorData,
      id: instructorId,
      memberId: 'M-' + instructorId.slice(0, 4),
      clubId: clubId,
      password: 'password',
      profileImageUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [Role.INSTRUCTOR],
      isActive: true
    } as Instructor;

    const club: Club = {
      ...clubData,
      id: clubId,
      instructor,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Club;

    this.addUser(instructor);
    this.addClub(club);
  }

  saveAttendanceRecords(records: Attendance[]): void {
    const updatedUsers = this.users$.value.map(user => {
      // Only update if user is a Student (i.e., has an attendance property)
      const isStudent = user.roles.includes(Role.STUDENT);
      if (isStudent) {
        const studentRecords = records.filter(r => r.userId === user.id);
        if (studentRecords.length > 0) {
          const updatedAttendance = [...((user as Student).attendance || []), ...studentRecords];
          return {
            ...user,
            attendance: updatedAttendance,
            updatedAt: new Date()
          } as Student;
        }
      }
      return user;
    });

    this.users$.next(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  }

  getUsers(): Observable<User[]> {
    return this.users$.asObservable();
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

  updatePasswordByEmail(email: string, newPassword: string): { success: boolean; message: string } {
    const users = this.users$.value;
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    const updatedUser: User = { ...user, password: newPassword };
    this.updateUser(updatedUser);
    return { success: true, message: 'Password updated successfully.' };
  }
  removeUser(userId: string): void {
    const updated = this.users$.value.filter(u => u.id !== userId);
    this.users$.next(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  }

  getClubs(): Observable<Club[]> {
    return this.clubs$.asObservable();
  }

  addClub(club: Club): void {
    const updated = [...this.clubs$.value, club];
    this.clubs$.next(updated);
    localStorage.setItem('clubs', JSON.stringify(updated));
  }

  removeClub(clubId: string): void {
    const updated = this.clubs$.value.filter(c => c.id !== clubId);
    this.clubs$.next(updated);
    localStorage.setItem('clubs', JSON.stringify(updated));
  }


  createAndAddResource(data: {
    title: string;
    description: string;
    category: string;
    uploadedFile: File;
  }): void {
    const user = this.loggedInUser$.value;
    if (!user || !user.clubId) {
      throw new Error('Only instructors with a club can upload resources.');
    }

    const isVideo = data.uploadedFile?.type.startsWith('video/');
    const isPdf = data.uploadedFile?.type === 'application/pdf';

    const newResource: Resource = {
      id: generateId(),
      title: data.title || data.uploadedFile?.name || 'Untitled',
      description: data.description,
      category: data.category,
      fileUrl: isPdf ? URL.createObjectURL(data.uploadedFile) : '',
      videoUrl: isVideo ? URL.createObjectURL(data.uploadedFile) : '',
      dateCreated: new Date(),
      clubId: user.clubId,
    };

    const updated = [...this.resources$.value, newResource];
    this.resources$.next(updated);
  }

  setSelectedCategory(category: string): void {
    this.selectedCategory$.next(category);
  }

  getFilteredResources(): Observable<Resource[]> {
    return combineLatest([
      this.resources$.asObservable(),
      this.loggedInUser$.asObservable(),
      this.selectedCategory$.asObservable(),
    ]).pipe(
      map(([resources, user, selectedCategory]) => {
        if (!user?.clubId) return [];
        return resources.filter(resource =>
          resource.clubId === user.clubId &&
          (selectedCategory === 'All' || resource.category === selectedCategory)
        );
      })
    );
  }

  deleteResourceAndRefresh(id: string): void {
    const updated = this.resources$.value.filter(r => r.id !== id);
    this.resources$.next(updated);
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
