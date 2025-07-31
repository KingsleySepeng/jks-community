import { Injectable } from '@angular/core';
import { SystemAdmin, Instructor, Student, User } from '../model/user';
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
  private initializeMockData(): void {}


  // -------------------------------------------------------
  // 3. Relationship Helpers
  // -------------------------------------------------------
  private assignUsersToClubs(): void {
  }



  // -------------------------------------------------------
  // 4. Authentication Methods
  // -------------------------------------------------------

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
