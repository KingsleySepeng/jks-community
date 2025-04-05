import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Instructor, Student, User } from '../model/user';
import { Club } from '../model/club';
import { Events } from '../model/events';
import { Payment } from '../model/payment';
import { Resource } from '../model/resource';
import { GradingRecord } from '../model/grading-record';
import { MockDataService } from '../mock-service/mock-data.service';
import { Router } from '@angular/router';
import {DatePipe, NgForOf, NgSwitch} from '@angular/common';

@Component({
  selector: 'app-admin-dash',
  standalone: true,
  templateUrl: './admin-dash.component.html',
  imports: [
    NgSwitch,
    NgForOf,
    DatePipe,
    CommonModule
  ],
  styleUrls: ['./admin-dash.component.scss']
})
export class AdminDashComponent implements OnInit {
  loggedInAdmin: User | null = null;
  instructors: Instructor[] = [];
  students: Student[] = [];
  clubs: Club[] = [];
  events: Events[] = [];
  payments: Payment[] = [];
  resources: Resource[] = [];
  gradingRecords: GradingRecord[] = [];

  // UI state for tab navigation
  selectedTab: string = 'instructors';

  constructor(private mockDataService: MockDataService, private router: Router) {}

  ngOnInit(): void {
    // Assume the logged-in admin is set via the mock service
    this.loggedInAdmin = this.mockDataService.getLoggedInUser() ?? null;

    // Fetch and filter data from the mock data service
    const allUsers = this.mockDataService.getUsers();
    this.instructors = allUsers.filter(u => u.role === 'INSTRUCTOR') as Instructor[];
    this.students = allUsers.filter(u => u.role === 'STUDENT') as Student[];
    this.clubs = this.mockDataService.getClubs();
    this.events = this.mockDataService.getEvents();
    this.payments = this.mockDataService.getPayments();
    this.resources = this.mockDataService.getAllResources();
    this.gradingRecords = this.mockDataService.getAllGradingRecords();
  }

  // --- Helper Methods for Summary Cards ---
  getTotalInstructors(): number {
    return this.instructors.length;
  }

  getTotalStudents(): number {
    return this.students.length;
  }

  getTotalClubs(): number {
    return this.clubs.length;
  }

  getTotalEvents(): number {
    return this.events.length;
  }

  getTotalResources(): number {
    return this.resources.length;
  }

  getTotalIncome(): number {
    return this.payments.reduce((sum, p) => sum + p.amount, 0);
  }

  // --- Actions (Placeholders) ---
  addInstructor(): void {
    alert('Add Instructor functionality coming soon.');
  }

  removeInstructor(): void {
    alert('Remove Instructor functionality coming soon.');
  }

  addClub(): void {
    alert('Add Club functionality coming soon.');
  }

  createEvent(): void {
    alert('Create Event functionality coming soon.');
  }

  addResource(): void {
    alert('Add Resource functionality coming soon.');
  }

  // Navigate to detailed pages if needed
  viewGradingDetail(record: GradingRecord): void {
    this.router.navigate(['/grading-detail', record.id]);
  }
}
