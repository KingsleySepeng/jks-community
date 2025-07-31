import { Component } from '@angular/core';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {Events} from '../model/events';
import {MockDataService} from '../mock-service/mock-data.service';
import {User} from '../model/user';
import {Router} from '@angular/router';
import { loadGapiInsideDOM } from 'gapi-script';
import {Role} from '../model/role';
declare var gapi: any;

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
  events: Events[] = [];
  isInstructor: boolean | undefined = false;
  loggedInUser?: User;
  selectedEvent?: Events;
  clubStudents: User[] = [];
  selectedStudents: Set<string> = new Set();

  constructor(private mockDataService: MockDataService,private router:Router) {}

   ngOnInit(): void {
    this.loggedInUser = this.mockDataService.getLoggedInUser();
    this.events = this.mockDataService.getEvents();
    this.isInstructor = this.loggedInUser?.roles.includes(Role.INSTRUCTOR);
  }

  getInstructorName(instructorId: string): string {
    const instructor = this.mockDataService.getUserById(instructorId);
    return instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Unknown Instructor';
  }

  getClubName(clubId: string): string {
    const club = this.mockDataService.getClubById(clubId);
    return club ? club.name : 'Unknown Club';
  }

  getRemainingSpots(evt: Events): string {
    if (evt.maxEntries === undefined) return 'Unlimited';
    const spotsLeft = evt.maxEntries - evt.finalRegistrations.length;
    return spotsLeft > 0 ? `${spotsLeft} spots left` : 'Fully booked';
  }

  onStudentInterest(evt: Events): void {
    if (this.loggedInUser) {
      this.mockDataService.addStudentInterest(evt.id, this.loggedInUser.id);
    }
  }

  onOpenFinalizeRegistration(evt: Events): void {
    if (!this.loggedInUser) return;

    this.selectedEvent = evt;
    this.clubStudents = this.mockDataService.getUsers().filter(
      (user) => user.club === this.loggedInUser?.club && user.roles.includes(Role.STUDENT)
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

    const selectedStudentsArray = Array.from(this.selectedStudents);
    const eventCreator = this.mockDataService.getUserById(this.selectedEvent.instructorId);

    if (eventCreator) {
      const selectedStudentNames = selectedStudentsArray.map(id => {
        const student = this.mockDataService.getUserById(id);
        return student ? `${student.firstName} ${student.lastName}` : '';
      }).join(', ');

      const totalCost = this.selectedEvent.cost * selectedStudentsArray.length;

      this.router.navigate(['/payment'], {
        queryParams: {
          eventId: this.selectedEvent.id,
          eventName: this.selectedEvent.eventName,
          eventCost: totalCost,
          eventDescription:this.selectedEvent.description,
          eventCreator: `${eventCreator.firstName} ${eventCreator.lastName}`,
          selectedStudents: selectedStudentNames
        }
      });
    }
    alert(`Students added to event: ${this.selectedEvent.eventName}`);
    this.selectedEvent = undefined;
  }

  // Add a method to check if the event date has passed
  isEventDatePassed(event: Events): boolean {
    return new Date(event.date) < new Date();
  }

  onCancelFinalRegistration(): void {
    this.selectedEvent = undefined;
    this.selectedStudents.clear();
  }

  getRegistrationsCount(eventId: string): number {
    const event = this.mockDataService.getEvents().find(e => e.id === eventId);
    return event ? event.finalRegistrations.length : 0;
  }

  getPaymentsCount(eventId: string): number {
    return this.mockDataService.getPaymentsForEvent(eventId).length;
  }

  getParticipants(eventId: string): { name: string, surname: string, club: string, date: Date }[] {
    const event = this.mockDataService.getEvents().find(e => e.id === eventId);
    if (!event) return [];

    return event.finalRegistrations.map(studentId => {
      const student = this.mockDataService.getUserById(studentId);
      const club = student ? this.mockDataService.getClubById(student.club) : undefined;
      return {
        name: student?.firstName || 'Unknown',
        surname: student?.lastName || 'Unknown',
        club: club?.name || 'Unknown Club',
        date: new Date() // Assuming registration date is now, adjust as needed
      };
    });
  }

  private async initializeGapiClient(): Promise<void> {
    await loadGapiInsideDOM();
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: 'YOUR_CLIENT_ID',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.events'
      });
    });
  }

  private async pushEventToGoogleCalendar(event: Events): Promise<void> {
    const eventDetails = {
      summary: event.eventName,
      location: event.location,
      description: event.description,
      start: {
        dateTime: event.date.toISOString(),
        timeZone: 'America/Los_Angeles'
      },
      end: {
        dateTime: new Date(event.date.getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: 'America/Los_Angeles'
      }
    };

    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: eventDetails
      });
      console.log('Event pushed to Google Calendar: ', response);
    } catch (error) {
      console.error('Error pushing event to Google Calendar: ', error);
    }
  }
}
