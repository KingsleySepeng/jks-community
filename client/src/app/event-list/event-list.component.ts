import { Component } from '@angular/core';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {Event} from '../model/event';
import {MockDataService} from '../mock-service/mock-data.service';
import {User} from '../model/user';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent {
  events: Event[] = [];
  isInstructor: boolean = false;
  loggedInUser?: User;
  selectedEvent?: Event;
  clubStudents: User[] = [];
  selectedStudents: Set<string> = new Set();

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loggedInUser = this.mockDataService.getLoggedInUser();
    this.events = this.mockDataService.getEvents();
    this.isInstructor = this.loggedInUser?.role === 'INSTRUCTOR';
  }

  getInstructorName(instructorId: string): string {
    const instructor = this.mockDataService.getUserById(instructorId);
    return instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Unknown Instructor';
  }

  getClubName(clubId: string): string {
    const club = this.mockDataService.getClubById(clubId);
    return club ? club.name : 'Unknown Club';
  }

  getRemainingSpots(evt: Event): string {
    if (evt.maxEntries === undefined) return 'Unlimited';
    const spotsLeft = evt.maxEntries - evt.finalRegistrations.length;
    return spotsLeft > 0 ? `${spotsLeft} spots left` : 'Fully booked';
  }

  onStudentInterest(evt: Event): void {
    if (this.loggedInUser) {
      this.mockDataService.addStudentInterest(evt.id, this.loggedInUser.id);
    }
  }

  onOpenFinalizeRegistration(evt: Event): void {
    if (!this.loggedInUser) return;

    this.selectedEvent = evt;
    this.clubStudents = this.mockDataService.getUsers().filter(
      (user) => user.clubId === this.loggedInUser?.clubId && user.role === 'STUDENT'
    );
    this.selectedStudents.clear();
  }

  toggleStudentSelection(studentId: string): void {
    if (this.selectedStudents.has(studentId)) {
      this.selectedStudents.delete(studentId);
    } else {
      this.selectedStudents.add(studentId);
    }
  }

  onConfirmFinalRegistration(): void {
    if (!this.selectedEvent) return;

    this.selectedStudents.forEach((studentId) => {
      this.mockDataService.addStudentInterest(this.selectedEvent!.id, studentId);
    });

    alert(`Students added to event: ${this.selectedEvent.eventName}`);
    this.selectedEvent = undefined;
  }

  onCancelFinalRegistration(): void {
    this.selectedEvent = undefined;
    this.selectedStudents.clear();
  }
}
