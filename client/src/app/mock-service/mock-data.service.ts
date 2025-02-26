import { Injectable } from '@angular/core';
import { Admin, Instructor, Student, User } from '../model/user';
import { Club } from '../model/club';
import { Attendance, AttendanceStatus } from '../model/attendance ';
import { Belt } from '../model/belt';
import { Rank } from '../model/rank';
import { Role } from '../model/role';
import { Payment } from '../model/payment';
import { Events } from '../model/events';
import { GradingRecord } from '../model/grading-record';
import { BeltRequirements } from '../model/belt-requirement';
import { Resource } from '../model/resource';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // -------------------------------------------------------
  // 1. Private Fields (Data & Logged-In User)
  // -------------------------------------------------------
  private clubs: Club[] = [];
  private users: User[] = [];
  private attendances: Attendance[] = [];
  private payments: Payment[] = [];
  private events: Events[] = [];
  private gradingRecords: GradingRecord[] = [];
  private loggedInUser: User | null = null;

  private resources: Resource[] = [
    {
      id: 'RES-1000',
      title: 'Yellow Belt Syllabus PDF',
      description: 'Full PDF of the yellow belt curriculum',
      fileUrl: 'https://example.com/yellow-belt.pdf',
      category: 'Syllabus',
      dateCreated: new Date('2025-01-01')
    },
    {
      id: 'RES-1001',
      title: 'Seminar on Kata Basics',
      description: 'Recorded Zoom session from last seminar',
      videoUrl: 'https://youtube.com/some-video',
      category: 'SeminarVideo',
      dateCreated: new Date('2025-01-15')
    }
  ];

  // -------------------------------------------------------
  // 2. Constructor & Initialization
  // -------------------------------------------------------
  constructor() {
    this.initializeMockData();
  }

  /**
   * initializeMockData
   * Populates clubs, users, attendance, etc. and assigns relationships.
   */
  private initializeMockData(): void {
    // ------------ 2.1 Initialize Clubs ------------
    const clubPretoria: Club = {
      id: '1',
      name: 'JKS Pretoria',
      address: '123 Karate St, Tokyo, Japan',
      contactNumber: '+27 12 345 6789',
      establishedDate: new Date('2010-05-15'),
      description: 'Leading the way in martial arts excellence.',
      createdAt: new Date('2010-05-15'),
      updatedAt: new Date('2024-01-01')
    };

    const clubHartebeesport: Club = {
      id: '2',
      name: 'JKS Hartebeesport',
      address: '456 Samurai Rd, Osaka, Japan',
      contactNumber: '+81 6 1234 5678',
      establishedDate: new Date('2012-08-20'),
      description: 'Dedicated to empowering individuals through martial arts.',
      createdAt: new Date('2012-08-20'),
      updatedAt: new Date('2024-01-01')
    };

    const clubDurban: Club = {
      id: '3',
      name: 'JKS Durban',
      address: '789 Dojo Ave, Durban, South Africa',
      contactNumber: '+27 31 234 5678',
      establishedDate: new Date('2015-03-10'),
      description: 'Fostering discipline and respect in martial arts.',
      createdAt: new Date('2015-03-10'),
      updatedAt: new Date('2024-01-01')
    };

    const clubJohannesburg: Club = {
      id: '4',
      name: 'JKS Johannesburg',
      address: '101 Ninjutsu Blvd, Johannesburg, South Africa',
      contactNumber: '+27 11 345 6789',
      establishedDate: new Date('2018-07-25'),
      description: 'Promoting fitness and self-defense through martial arts.',
      createdAt: new Date('2018-07-25'),
      updatedAt: new Date('2024-01-01')
    };

    const clubCapeTown: Club = {
      id: '5',
      name: 'JKS Cape Town',
      address: '202 Kata Street, Cape Town, South Africa',
      contactNumber: '+27 21 456 7890',
      establishedDate: new Date('2020-11-05'),
      description: 'Cultivating champions in the world of martial arts.',
      createdAt: new Date('2020-11-05'),
      updatedAt: new Date('2024-01-01')
    };

    this.clubs = [
      clubPretoria,
      clubHartebeesport,
      clubDurban,
      clubJohannesburg,
      clubCapeTown
    ];

    // ------------ 2.2 Initialize Users ------------
    const instructor1: Instructor = {
      id: 'I001',
      memberId: 'M001',
      email: 'king@gmail.com',
      firstName: 'Kingsley',
      lastName: 'Sepeng',
      clubId: '1',
      belt: Belt.BLACK,
      role: Role.INSTRUCTOR,
      rank: Rank.INSTRUCTOR,
      password: 'karate',
      isActive: true,
      createdAt: new Date('2010-05-15'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };

    const instructor2: Instructor = {
      id: 'I002',
      memberId: 'M002',
      email: 'jane.smith@jks.com',
      firstName: 'Jane',
      lastName: 'Smith',
      clubId: '1',
      belt: Belt.BLUE,
      role: Role.INSTRUCTOR,
      rank: Rank.INSTRUCTOR,
      password: 'karate',
      isActive: true,
      createdAt: new Date('2012-08-20'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };

    const student1: Student = {
      id: 'S001',
      memberId: 'M003',
      email: 'student1@example.com',
      firstName: 'Alice',
      lastName: 'Brown',
      clubId: '1',
      belt: Belt.YELLOW,
      role: Role.STUDENT,
      isActive: true,
      password: 'karate',
      createdAt: new Date('2015-03-10'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };

    const student2: Student = {
      id: 'S002',
      memberId: 'M004',
      email: 'student2@example.com',
      firstName: 'Bob',
      lastName: 'Johnson',
      clubId: '1',
      belt: Belt.GREEN,
      role: Role.STUDENT,
      password: 'karate',
      isActive: true,
      createdAt: new Date('2018-07-25'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };

    const instructor3: Instructor = {
      id: 'I003',
      memberId: 'M005',
      email: 'dave.crothall@gmail.com',
      firstName: 'Dave',
      lastName: 'Crothall',
      clubId: '2',
      belt: Belt.BLACK,
      role: Role.INSTRUCTOR,
      rank: Rank.INSTRUCTOR,
      password: 'admin123',
      isActive: true,
      createdAt: new Date('2015-03-10'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };

    const instructor4: Instructor = {
      id: 'I004',
      memberId: 'M006',
      email: 'evelyn.green@jks.com',
      firstName: 'Evelyn',
      lastName: 'Green',
      clubId: '4',
      belt: Belt.BROWN,
      role: Role.INSTRUCTOR,
      rank: Rank.DOJO_HEAD,
      isActive: true,
      password: 'karate',
      createdAt: new Date('2018-07-25'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };

    const student3: Student = {
      id: 'S003',
      memberId: 'M007',
      email: 'student3@example.com',
      firstName: 'Charlie',
      lastName: 'Davis',
      clubId: '2',
      belt: Belt.ORANGE,
      role: Role.STUDENT,
      password: 'karate',
      isActive: true,
      createdAt: new Date('2020-11-05'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };

    const admin1: Admin = {
      id: 'A001',
      memberId: 'M008',
      email: 'admin1@jks.com',
      firstName: 'Grace',
      lastName: 'Harris',
      clubId: '1',
      belt: Belt.WHITE,
      role: Role.ADMIN,
      password: 'karate',
      isActive: true,
      createdAt: new Date('2010-05-15'),
      updatedAt: new Date('2024-01-01')
    };

    this.users = [
      instructor1, instructor2,
      student1,    student2,
      instructor3, instructor4,
      student3,    admin1
    ];

    // ------------ 2.3 Initialize Attendances ------------
    const attendanceI001A001: Attendance = {
      id: 'A001',
      date: new Date('2024-12-01'),
      status: AttendanceStatus.PRESENT,
      instructorId: 'I001',
      userId: 'I001',
      clubId: '1',
      comments: 'Attended staff meeting.',
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-01')
    };

    const attendanceI002A002: Attendance = {
      id: 'A002',
      date: new Date('2024-12-02'),
      status: AttendanceStatus.PRESENT,
      instructorId: 'I002',
      userId: 'I002',
      clubId: '1',
      comments: 'Conducted advanced class.',
      createdAt: new Date('2024-12-02'),
      updatedAt: new Date('2024-12-02')
    };

    const attendanceS001A003: Attendance = {
      id: 'A003',
      date: new Date('2024-12-01'),
      status: AttendanceStatus.PRESENT,
      instructorId: 'I001',
      userId: 'S001',
      clubId: '1',
      comments: 'Participated actively.',
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-01')
    };

    const attendanceS002A004: Attendance = {
      id: 'A004',
      date: new Date('2024-12-01'),
      status: AttendanceStatus.ABSENT,
      instructorId: 'I001',
      userId: 'S002',
      clubId: '1',
      comments: 'Absent due to illness.',
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-01')
    };

    const attendanceS003A005: Attendance = {
      id: 'A005',
      date: new Date('2024-12-02'),
      status: AttendanceStatus.EXCUSED,
      instructorId: 'I003',
      userId: 'S003',
      clubId: '2',
      comments: 'Family emergency.',
      createdAt: new Date('2024-12-02'),
      updatedAt: new Date('2024-12-02')
    };

    const attendanceA001A006: Attendance = {
      id: 'A006',
      date: new Date('2024-12-03'),
      status: AttendanceStatus.PRESENT,
      instructorId: 'I001',
      userId: 'A001',
      clubId: '1',
      comments: 'Reviewed monthly reports.',
      createdAt: new Date('2024-12-03'),
      updatedAt: new Date('2024-12-03')
    };

    this.attendances = [
      attendanceI001A001, attendanceI002A002,
      attendanceS001A003, attendanceS002A004,
      attendanceS003A005, attendanceA001A006
    ];

    // Assign each user's attendance, except Admin if desired
    this.users.forEach(user => {
      if (user.role !== Role.ADMIN) {
        user.attendance = this.attendances.filter(att => att.userId === user.id);
      }
    });

    // ------------ 2.4 Assign Users to Clubs ------------
    this.assignUsersToClubs();

    // ------------ 2.5 Sample Events ------------
    this.events = [
      {
        id: 'EVT-10001',
        eventName: 'Karate Tournament',
        location: 'Tokyo Dojo',
        date: new Date('2025-03-10'),
        cost: 100,
        paymentDueDate: new Date('2025-02-25'),
        interestedStudents: [],
        finalRegistrations: [],
        maxEntries: 1,
        description: "Freindly Tournament",
        instructorId:"I004",
        clubId:"4",
      }
    ];
  }

  // -------------------------------------------------------
  // 3. Relationship Helpers
  // -------------------------------------------------------
  private assignUsersToClubs(): void {
    this.clubs.forEach(club => {
      // Instructors
      club.instructors = this.users.filter(
        user => user.clubId === club.id && user.role === Role.INSTRUCTOR
      ) as Instructor[];

      // Students
      club.students = this.users.filter(
        user => user.clubId === club.id && user.role === Role.STUDENT
      ) as Student[];
    });
  }

  // -------------------------------------------------------
  // 4. Authentication Methods
  // -------------------------------------------------------
  public authenticate(email: string, password: string): User | null {
    const user = this.findUserByCredentials(email, password);
    if (user) {
      this.loggedInUser = user;
      return user;
    }
    return null;
  }

  private findUserByCredentials(email: string, password: string): User | null {
    const found = this.users.find(u => u.email === email && u.password === password);
    return found || null;
  }

  public login(user: User): User | undefined {
    const foundUser = this.users.find(
      u => u.email === user.email && u.password === user.password
    );
    if (foundUser) {
      this.loggedInUser = foundUser;
      return foundUser;
    }
    return undefined;
  }

  public logout(): void {
    this.loggedInUser = null;
  }

  public getLoggedInUser(): User | undefined {
    return this.loggedInUser ?? undefined;
  }

  // -------------------------------------------------------
  // 5. Clubs, Users, Attendance CRUD
  // -------------------------------------------------------
  public getUsers(): User[] {
    return this.users;
  }
  public addUser(newUser: User): void {
    this.users.push(newUser);
    this.assignUsersToClubs();
  }
  public updateUsers(updatedUsers: User[]): void {
    this.users = updatedUsers;
    this.assignUsersToClubs();
  }
  public removeUser(userId: string): void {
    this.users = this.users.filter(u => u.id !== userId);
    this.attendances = this.attendances.filter(a => a.userId !== userId);
    this.assignUsersToClubs();
  }

  public getUserById(userId: string): User | undefined {
    return this.users.find(u => u.id === userId);
  }
  public updateUser(updatedUser: User): void {
    const idx = this.users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
      this.users[idx] = { ...updatedUser };
    }
  }

  public getClubs(): Club[] {
    return this.clubs;
  }
  public addClub(newClub: Club): void {
    this.clubs.push(newClub);
  }
  public removeClub(clubId: string): void {
    this.clubs = this.clubs.filter(c => c.id !== clubId);
    this.users = this.users.filter(u => u.clubId !== clubId);
    this.attendances = this.attendances.filter(a => a.clubId !== clubId);
  }

  public getClubById(clubId: string): Club | undefined {
    return this.clubs.find(c => c.id === clubId);
  }
  public updateClub(updatedClub: Club): void {
    const idx = this.clubs.findIndex(c => c.id === updatedClub.id);
    if (idx !== -1) {
      this.clubs[idx] = { ...updatedClub };
    }
  }

  public getAttendances(): Attendance[] {
    // Sort by date ascending
    return this.attendances.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // -------------------------------------------------------
  // 6. Payments
  // -------------------------------------------------------
  public getPayments(): Payment[] {
    return this.payments;
  }
  public addPayment(payment: Payment): void {
    this.payments.push(payment);
  }
  public updatePayments(updatedPayments: Payment[]): void {
    this.payments = updatedPayments;
  }

  // -------------------------------------------------------
  // 7. Events
  // -------------------------------------------------------
  public getEvents(): Events[] {
    return this.events;
  }
  public addEvent(newEvent: Events) {
    this.events.push(newEvent);
  }
  public addStudentInterest(eventId: string, studentId: string) {
    const evt = this.events.find(e => e.id === eventId);
    if (evt && !evt.interestedStudents.includes(studentId)) {
      evt.interestedStudents.push(studentId);
    }
  }
  public finalizeEventRegistration(eventId: string) {
    const evt = this.events.find(e => e.id === eventId);
    if (evt) {
      // Example: finalize all interested
      evt.finalRegistrations = [...evt.interestedStudents];
      // or handle payment logic
    }
  }

  // -------------------------------------------------------
  // 8. Grading Records
  // -------------------------------------------------------
  public getAllGradingRecords(): GradingRecord[] {
    return [...this.gradingRecords];
  }
  public getGradingRecord(id: string): GradingRecord | undefined {
    return this.gradingRecords.find(r => r.id === id);
  }
  public saveGradingRecord(rec: GradingRecord) {
    this.gradingRecords.push(rec);
  }

  // -------------------------------------------------------
  // 9. Belt Requirements & Eligibility
  // -------------------------------------------------------
  public isEligibleForBelt(student: Student, belt: Belt): boolean {
    const req = BeltRequirements.find(r => r.belt === belt);
    if (!req) return false; // no belt requirement found
    return true;
  }

  private monthDifference(start: Date, end: Date): number {
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth() + 12 * years;
    return months;
  }

  // -------------------------------------------------------
  // 10. Resources
  // -------------------------------------------------------
  public getAllResources(): Resource[] {
    return [...this.resources];
  }
  public addResource(res: Resource): void {
    this.resources.push(res);
  }
  public updateResource(updated: Resource): void {
    const idx = this.resources.findIndex(r => r.id === updated.id);
    if (idx >= 0) {
      this.resources[idx] = { ...updated };
    }
  }

  public getOutstandingFees(userId: string): number {
    const userPayments = this.payments.filter(p => p.userId === userId);
    const totalPaid = userPayments.reduce((sum, p) => sum + p.amount, 0);

    // Assume a fixed training fee per student
    const totalDue = 5000; // Example total fees for a term

    return totalDue - totalPaid > 0 ? totalDue - totalPaid : 0;
  }

  // Add a method to get payments for a specific event
  public getPaymentsForEvent(eventId: string): Payment[] {
    return this.payments.filter(p => p.id === eventId);
  }

}
