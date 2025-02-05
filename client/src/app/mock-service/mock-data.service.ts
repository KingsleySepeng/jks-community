import { Injectable } from '@angular/core';
import { Club } from '../model/club';
import {Admin, Instructor, Student, User} from '../model/user';
import {Attendance, AttendanceStatus} from '../model/attendance ';
import { Belt } from '../model/belt';
import { Rank } from '../model/rank';
import { Role } from '../model/role';
import {Payment} from '../model/payment';
import {Event} from '../model/event';
import {GradingRecord} from '../model/grading-record';
import {BeltRequirements} from '../model/belt-requirement';
import {Resource} from '../model/resource';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private clubs: Club[] = [];
  private users: User[] = [];
  private attendances: Attendance[] = [];
  private payments: Payment[] = [];
  private events: Event[] = [];
  private resources: Resource[] = [
    // Optionally seed some initial data
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
  constructor() {
    this.initializeMockData();
  }

  /**
   * Initializes all mock data.
   * We create the clubs first, then the users,
   * and finally we attach users to clubs.
   */
  private initializeMockData(): void {
    // 1. Initialize Clubs
    const clubPretoria: Club = {
      id: '1',
      name: 'JKS Pretoria',
      address: '123 Karate St, Tokyo, Japan',
      contactNumber: '+27 12 345 6789',
      establishedDate: new Date('2010-05-15'),
      description: 'Leading the way in martial arts excellence.',
      createdAt: new Date('2010-05-15'),
      updatedAt: new Date('2024-01-01'),
    };

    const clubHartebeesport: Club = {
      id: '2',
      name: 'JKS Hartebeesport',
      address: '456 Samurai Rd, Osaka, Japan',
      contactNumber: '+81 6 1234 5678',
      establishedDate: new Date('2012-08-20'),
      description: 'Dedicated to empowering individuals through martial arts.',
      createdAt: new Date('2012-08-20'),
      updatedAt: new Date('2024-01-01'),
    };

    const clubDurban: Club = {
      id: '3',
      name: 'JKS Durban',
      address: '789 Dojo Ave, Durban, South Africa',
      contactNumber: '+27 31 234 5678',
      establishedDate: new Date('2015-03-10'),
      description: 'Fostering discipline and respect in martial arts.',
      createdAt: new Date('2015-03-10'),
      updatedAt: new Date('2024-01-01'),
    };

    const clubJohannesburg: Club = {
      id: '4',
      name: 'JKS Johannesburg',
      address: '101 Ninjutsu Blvd, Johannesburg, South Africa',
      contactNumber: '+27 11 345 6789',
      establishedDate: new Date('2018-07-25'),
      description: 'Promoting fitness and self-defense through martial arts.',
      createdAt: new Date('2018-07-25'),
      updatedAt: new Date('2024-01-01'),
    };

    const clubCapeTown: Club = {
      id: '5',
      name: 'JKS Cape Town',
      address: '202 Kata Street, Cape Town, South Africa',
      contactNumber: '+27 21 456 7890',
      establishedDate: new Date('2020-11-05'),
      description: 'Cultivating champions in the world of martial arts.',
      createdAt: new Date('2020-11-05'),
      updatedAt: new Date('2024-01-01'),
    };

    // Add all clubs to the array
    this.clubs = [
      clubPretoria,
      clubHartebeesport,
      clubDurban,
      clubJohannesburg,
      clubCapeTown,
    ];

    // 2. Initialize Users

    // Instructors for Club Pretoria
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
      attendance: [], // To be populated later
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
      attendance: [],
    };

    // Students for Club Pretoria
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
      attendance: [],
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
      attendance: [],
    };

    // Instructors for Club Hartebeesport
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
      attendance: [],
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
      attendance: [],
    };

    // Students for Club Hartebeesport
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
      attendance: [],
    };

    // Admin User
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
      updatedAt: new Date('2024-01-01'),
    };

    // Add all users to the array
    this.users = [
      instructor1,
      instructor2,
      student1,
      student2,
      instructor3,
      instructor4,
      student3,
      admin1,
      // Additional users can be added here
    ];

    // 3. Initialize Attendances

    // Sample Attendances for Instructors
    const attendanceI001A001: Attendance = {
      id: 'A001',
      date: new Date('2024-12-01'),
      status: AttendanceStatus.PRESENT,
      instructorId: 'I001',
      userId: 'I001',
      clubId: '1',
      comments: 'Attended staff meeting.',
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-01'),
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
      updatedAt: new Date('2024-12-02'),
    };

    // Sample Attendances for Students
    const attendanceS001A003: Attendance = {
      id: 'A003',
      date: new Date('2024-12-01'),
      status: AttendanceStatus.PRESENT,
      instructorId: 'I001',
      userId: 'S001',
      clubId: '1',
      comments: 'Participated actively.',
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-01'),
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
      updatedAt: new Date('2024-12-01'),
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
      updatedAt: new Date('2024-12-02'),
    };

    // Sample Attendances for Admin
    const attendanceA001A006: Attendance = {
      id: 'A006',
      date: new Date('2024-12-03'),
      status: AttendanceStatus.PRESENT,
      instructorId: 'I001',
      userId: 'A001',
      clubId: '1',
      comments: 'Reviewed monthly reports.',
      createdAt: new Date('2024-12-03'),
      updatedAt: new Date('2024-12-03'),
    };

    // Add all attendances to the array
    this.attendances = [
      attendanceI001A001,
      attendanceI002A002,
      attendanceS001A003,
      attendanceS002A004,
      attendanceS003A005,
      attendanceA001A006,
      // Additional attendances can be added here
    ];

    // 4. Assign Attendances to Users
    this.users.forEach(user => {
      if (user.role !== Role.ADMIN) { // Assuming admins might not have attendance records
        user.attendance = this.attendances.filter(att => att.userId === user.id);
      }
    });

    // 5. Assign Users to Clubs
    this.assignUsersToClubs();

    this.events = [
      {
        id: 'EVT-10001',
        eventName: 'Karate Tournament',
        location: 'Tokyo Dojo',
        date: new Date('2025-03-10'),
        cost: 100,
        paymentDueDate: new Date('2025-02-25'),
        interestedStudents: [],
        finalRegistrations: []
      }
    ];
  }

  getEvents(): Event[] {
    return this.events;
  }

  addEvent(newEvent: Event) {
    this.events.push(newEvent);
  }

  addStudentInterest(eventId: string, studentId: string) {
    const evt = this.events.find(e => e.id === eventId);
    if (evt && !evt.interestedStudents.includes(studentId)) {
      evt.interestedStudents.push(studentId);
    }
  }

  finalizeEventRegistration(eventId: string) {
    const evt = this.events.find(e => e.id === eventId);
    if (evt) {
      // e.g. assume we finalize all who are 'interested'
      evt.finalRegistrations = [...evt.interestedStudents];
      // or do extra logic for payment
    }
  }
  /**
   * Assigns users to their respective clubs based on clubId.
   * Instructors are added to the club's instructors array.
   * Students are added to the club's students array.
   */
  private assignUsersToClubs(): void {
    this.clubs.forEach(club => {
      club.instructors = this.users.filter(
        user => user.clubId === club.id && user.role === Role.INSTRUCTOR
      ) as Instructor[];
      club.students = this.users.filter(
        user => user.clubId === club.id && user.role === Role.STUDENT
      ) as Student[];
    });
  }

  // 4. Initialize Payments (start with empty array)

  // this.payments = [];
// PAYMENTS
  getPayments(): Payment[] {
    return this.payments;
  }

  addPayment(payment: Payment): void {
    this.payments.push(payment);
  }

  updatePayments(updatedPayments: Payment[]): void {
    // For simplicity, we just overwrite the payments array (or update one by one as needed)
    this.payments = updatedPayments;
  }

  /**
   * Returns all users.
   */
  getUsers(): User[] {
    return this.users;
  }

  /**
   * Returns all clubs.
   */
  getClubs(): Club[] {
    return this.clubs;
  }

  /**
   * Returns all attendance records.
   */
  getAttendances(): Attendance[] {
    return this.attendances.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Updates the users array with the provided updatedUsers.
   * @param updatedUsers Array of updated User objects.
   */
  updateUsers(updatedUsers: User[]): void {
    this.users = updatedUsers;
    this.assignUsersToClubs();
  }

  /**
   * Adds a new user to the service.
   * @param newUser The User object to be added.
   */
  addUser(newUser: User): void {
    this.users.push(newUser);
    this.assignUsersToClubs();
  }

  /**
   * Adds a new club to the service.
   * @param newClub The Club object to be added.
   */
  addClub(newClub: Club): void {
    this.clubs.push(newClub);
  }

  /**
   * Removes a user by their ID.
   * @param userId The ID of the user to remove.
   */
  removeUser(userId: string): void {
    this.users = this.users.filter(user => user.id !== userId);
    this.attendances = this.attendances.filter(att => att.userId !== userId);
    this.assignUsersToClubs();
  }

  /**
   * Removes a club by its ID.
   * @param clubId The ID of the club to remove.
   */
  removeClub(clubId: string): void {
    this.clubs = this.clubs.filter(club => club.id !== clubId);
    this.users = this.users.filter(user => user.clubId !== clubId);
    this.attendances = this.attendances.filter(att => att.clubId !== clubId);
  }

  // in mock-data.service.ts
  private gradingRecords: GradingRecord[] = [];

  getAllGradingRecords(): GradingRecord[] {
    return [...this.gradingRecords];
  }

  getGradingRecord(id: string): GradingRecord | undefined {
    return this.gradingRecords.find(r => r.id === id);
  }

  saveGradingRecord(rec: GradingRecord) {
    this.gradingRecords.push(rec);
  }

  isEligibleForBelt(student: Student, belt: Belt): boolean {
    const req = BeltRequirements.find(r => r.belt === belt);
    if (!req) return false; // if belt not found in the requirement map

    // TODO: Implement the logic to check if the student is eligible for the belt
    // if (student.attendancePercentage < req.minAttendancePercentage) {
    //   return false;
    // }

    // Check waiting period
    // if (student.lastExamDate) {
    //   const monthsSinceLast = this.monthDifference(student.lastExamDate, new Date());
    //   if (monthsSinceLast < req.minWaitingPeriodMonths) {
    //     return false;
    //   }
    // }

    return true;
  }


  getUserById(userId: string): User | undefined {
    return this.users.find(u => u.id === userId);
  }

  updateUser(updatedUser: User): void {
    const idx = this.users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
      this.users[idx] = {...updatedUser};
    }
  }

  getClubById(clubId: string): Club | undefined {
    return this.clubs.find(c => c.id === clubId);
  }

  updateClub(updatedClub: Club): void {
    const idx = this.clubs.findIndex(c => c.id === updatedClub.id);
    if (idx !== -1) {
      this.clubs[idx] = { ...updatedClub };
    }
  }

  private monthDifference(start: Date, end: Date): number {
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth() + 12*years;
    return months;
  }
  getAllResources(): Resource[] {
    // Return a copy
    return [...this.resources];
  }

  addResource(res: Resource): void {
    this.resources.push(res);
  }

  // If you need update or delete:
  updateResource(updated: Resource): void {
    const idx = this.resources.findIndex(r => r.id === updated.id);
    if (idx >= 0) {
      this.resources[idx] = { ...updated };
    }
  }

}

