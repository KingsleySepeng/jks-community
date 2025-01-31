import { Component } from '@angular/core';
import {MockDataService} from '../mock-service/mock-data.service';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {Event} from '../model/event';
import {MockServiceService} from '../mock-service/mock-service.service';

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
  isInstructor: boolean = false; // or isAdmin

  constructor(
    private mockData: MockDataService,
    private mockService: MockServiceService  // hypothetical
  ) {}

  ngOnInit(): void {
    this.events = this.mockData.getEvents();
    this.isInstructor = this.mockService.getLoggedInUser().role === 'INSTRUCTOR';
  }

  // Student indicates interest
  onStudentInterest(evt: Event) {
    const currentUser = this.mockService.getLoggedInUser();
    if (currentUser) {
      this.mockData.addStudentInterest(evt.id, currentUser.id);
    }
  }

  // Instructor finalizes registration for entire club if needed
  onFinalizeRegistration(evt: Event) {
    // Possibly show a modal or direct method
    this.mockData.finalizeEventRegistration(evt.id);
  }
}
