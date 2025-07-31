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
  private users: User[] = [];
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
  private initializeMockData(): void {
  }


  // -------------------------------------------------------
  // 3. Relationship Helpers
  // -------------------------------------------------------

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


  public getUserById(userId: string): User | undefined {
    return this.users.find(u => u.id === userId);
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

  // -------------------------------------------------------
  // 7. Events
  // -------------------------------------------------------
  public getEvents(): Events[] {
    return this.events;
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


}
