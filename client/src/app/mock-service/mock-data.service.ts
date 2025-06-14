import { Injectable } from '@angular/core';
import { Admin, Instructor, Student, User } from '../model/user';
import { Club } from '../model/club';
import { Attendance, AttendanceStatus } from '../model/attendance ';
import { Belt } from '../model/belt';
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
    // -------------------- 1. Clubs --------------------
    const clubShotoRyu: Club = {
      id: '6',
      name: 'Shoto Ryu',
      address: 'Rene St, Winternest AH, Akasia, 0182',
      contactNumber: '+27 21 999 9999',
      establishedDate: new Date('2022-01-01'),
      description: 'Shoto Ryu club – practices on Mondays and Wednesdays',
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2024-01-01')
    };
    this.clubs = [clubShotoRyu];

    // -------------------- 2. Users --------------------
    const instructorMain: Instructor = {
      id: 'I010',
      memberId: 'M010',
      email: 'chris.badenhorst@example.com',
      firstName: 'Chris',
      lastName: 'Badenhorst',
      profileImageUrl: '',
      clubId: '6',
      belt: Belt.BLACK,
      role: Role.INSTRUCTOR,
      password: 'password',
      isActive: true,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };

    const subInstructor1: Instructor = {
      id: 'I011',
      memberId: 'M011',
      email: 'kingsley.sepeng@example.com',
      firstName: 'Kingsley',
      lastName: 'Sepeng',
      profileImageUrl: '',
      clubId: '6',
      belt: Belt.BLACK,
      role: Role.INSTRUCTOR,
      password: 'password',
      isActive: true,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };

    const subInstructor2: Instructor = {
      id: 'I012',
      memberId: 'M012',
      email: 'dave.crothall@example.com',
      firstName: 'Dave',
      lastName: 'Crothall',
      profileImageUrl: '',
      clubId: '6',
      belt: Belt.BLACK,
      role: Role.INSTRUCTOR,
      password: 'password',
      isActive: true,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };

    const subInstructor3: Instructor = {
      id: 'I013',
      memberId: 'M013',
      email: 'deon.buzuidenhout@example.com',
      firstName: 'Deon',
      lastName: 'Buzuidenhout',
      profileImageUrl: '',
      clubId: '6',
      belt: Belt.BLACK,
      role: Role.INSTRUCTOR,
      password: 'password',
      isActive: true,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };

    const student1: Student = {
      id: 'S010',
      memberId: 'M014',
      email: 'hope.sepeng@example.com',
      firstName: 'Hope',
      lastName: 'Sepeng',
      profileImageUrl: '',
      clubId: '6',
      belt: Belt.WHITE,
      role: Role.STUDENT,
      password: 'password',
      isActive: true,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };

    const student2: Student = {
      id: 'S011',
      memberId: 'M015',
      email: 'luhan.buzuidenhout@example.com',
      firstName: 'Luhan',
      lastName: 'Buzuidenhout',
      profileImageUrl: '',
      clubId: '6',
      belt: Belt.WHITE,
      role: Role.STUDENT,
      password: 'password',
      isActive: true,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };

    const student3: Student = {
      id: 'S012',
      memberId: 'M016',
      email: 'ewan.buzuidenhout@example.com',
      firstName: 'Ewan',
      lastName: 'Buzuidenhout',
      profileImageUrl: '',
      clubId: '6',
      belt: Belt.BLACK,
      role: Role.STUDENT,
      password: 'password',
      isActive: true,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2024-01-01'),
      attendance: []
    };


    this.users = [
      instructorMain,
      subInstructor1,
      subInstructor2,
      subInstructor3,
      student1,
      student2,
      student3,
    ];

    // -------------------- 3. Attendances --------------------
    // We'll create a few sample attendance records for February and March 2024.
    const createAttendance = (id: string, dateStr: string, status: AttendanceStatus, instructorId: string, userId: string, clubId: string, comments: string): Attendance => ({
      id,
      date: new Date(dateStr),
      status,
      instructorId,
      userId,
      clubId,
      comments,
      createdAt: new Date(dateStr),
      updatedAt: new Date(dateStr)
    });

    // Sample dates: February 5 (Monday), February 7 (Wednesday), March 4 (Monday)
    const attendances: Attendance[] = [
      // February 5, 2024 - All present for main instructor, sub instructors, and students.
      createAttendance('A1001', '2024-02-05', AttendanceStatus.PRESENT, instructorMain.id, instructorMain.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1002', '2024-02-05', AttendanceStatus.PRESENT, instructorMain.id, subInstructor1.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1003', '2024-02-05', AttendanceStatus.PRESENT, instructorMain.id, subInstructor2.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1004', '2024-02-05', AttendanceStatus.PRESENT, instructorMain.id, subInstructor3.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1005', '2024-02-05', AttendanceStatus.PRESENT, instructorMain.id, student1.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1006', '2024-02-05', AttendanceStatus.ABSENT, instructorMain.id, student2.id, clubShotoRyu.id, 'Absent due to illness'),
      createAttendance('A1007', '2024-02-05', AttendanceStatus.PRESENT, instructorMain.id, student3.id, clubShotoRyu.id, 'Present'),

      // February 7, 2024 - Mixed statuses.
      createAttendance('A1008', '2024-02-07', AttendanceStatus.PRESENT, instructorMain.id, instructorMain.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1009', '2024-02-07', AttendanceStatus.PRESENT, instructorMain.id, subInstructor1.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1010', '2024-02-07', AttendanceStatus.EXCUSED, instructorMain.id, subInstructor2.id, clubShotoRyu.id, 'Family emergency'),
      createAttendance('A1011', '2024-02-07', AttendanceStatus.PRESENT, instructorMain.id, subInstructor3.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1012', '2024-02-07', AttendanceStatus.PRESENT, instructorMain.id, student1.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1013', '2024-02-07', AttendanceStatus.PRESENT, instructorMain.id, student2.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1014', '2024-02-07', AttendanceStatus.PRESENT, instructorMain.id, student3.id, clubShotoRyu.id, 'Present'),

      // March 4, 2024 - All present.
      createAttendance('A1015', '2024-03-04', AttendanceStatus.PRESENT, instructorMain.id, instructorMain.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1016', '2024-03-04', AttendanceStatus.PRESENT, instructorMain.id, subInstructor1.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1017', '2024-03-04', AttendanceStatus.PRESENT, instructorMain.id, subInstructor2.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1018', '2024-03-04', AttendanceStatus.PRESENT, instructorMain.id, subInstructor3.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1019', '2024-03-04', AttendanceStatus.PRESENT, instructorMain.id, student1.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1020', '2024-03-04', AttendanceStatus.PRESENT, instructorMain.id, student2.id, clubShotoRyu.id, 'Present'),
      createAttendance('A1021', '2024-03-04', AttendanceStatus.PRESENT, instructorMain.id, student3.id, clubShotoRyu.id, 'Present')
    ];
    this.attendances = attendances;

    // Assign each user's attendance (for all users except Admin)
    // this.users.forEach(user => {
    //   if (user.role !== Role.ADMIN) {
    //     user.attendance = this.attendances.filter(att => att.userId === user.id);
    //   }
    // }
    // );

    // -------------------- 4. Events --------------------
    const event1: Events = {
      id: 'EVT-3001',
      eventName: 'Shoto Ryu Annual Tournament',
      location: 'Shoto Ryu Dojo, Akasia',
      date: new Date('2024-06-15'),
      cost: 150,
      paymentDueDate: new Date('2024-06-01'),
      interestedStudents: [],
      finalRegistrations: [],
      maxEntries: 50,
      description: 'Annual tournament for Shoto Ryu members.',
      instructorId: instructorMain.id,
      clubId: clubShotoRyu.id
    };
    this.events = [event1];

    // -------------------- 5. Grading Records --------------------
    // Create grading records for the purple belt students (Hope and Luhan)
    const gradingRecord1: GradingRecord = {
      id: 'GR-3001',
      studentId: student1.id,
      examinerId: instructorMain.id,
      clubId: clubShotoRyu.id,
      date: new Date('2024-01-15'),
      currentBelt: student1.belt,
      testingForBelt: student1.belt,
      evaluations: [
        { techniqueId: 'kihon-1', rating: 'good', comment: 'Excellent fundamentals.' },
        { techniqueId: 'kata-1', rating: 'average', comment: 'Needs to refine form.' }
      ],
      overallDecision: 'pass',
      overallComment: 'Well done, continue training.'
    };

    const gradingRecord2: GradingRecord = {
      id: 'GR-3002',
      studentId: student2.id,
      examinerId: instructorMain.id,
      clubId: clubShotoRyu.id,
      date: new Date('2024-01-20'),
      currentBelt: student2.belt,
      testingForBelt: student2.belt,
      evaluations: [
        { techniqueId: 'kihon-2', rating: 'average', comment: 'Satisfactory, but room for improvement.' },
        { techniqueId: 'kata-2', rating: 'bad', comment: 'Significant improvement needed.' }
      ],
      overallDecision: 'regrade',
      overallComment: 'Re-assessment recommended in 2 months.'
    };
    this.gradingRecords = [gradingRecord1, gradingRecord2];

    // -------------------- 6. Resources --------------------
    const resource1: Resource = {
      id: 'RES-3001',
      title: 'Shoto Ryu Training Manual',
      description: 'Comprehensive guide to Shoto Ryu techniques.',
      fileUrl: 'https://example.com/shotoru_manual.pdf',
      category: 'Syllabus',
      dateCreated: new Date('2024-01-01')
    };

    const resource2: Resource = {
      id: 'RES-3002',
      title: 'Shoto Ryu Seminar Video',
      description: 'Highlights from the recent seminar.',
      videoUrl: 'https://youtube.com/shotoru_seminar',
      category: 'SeminarVideo',
      dateCreated: new Date('2024-02-01')
    };
    this.resources = [resource1, resource2];
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
