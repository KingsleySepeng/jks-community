import { Component } from '@angular/core';
import {MockDataService} from '../mock-service/mock-data.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Events} from '../model/events';
import {User} from '../model/user';
import {Club} from '../model/club';
import {Role} from '../model/role';
import {NgIf} from '@angular/common';
import { loadGapiInsideDOM } from 'gapi-script';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {
  eventName = '';
  location = '';
  date: string = new Date().toISOString().split('T')[0]; // Default to today
  cost: number = 0;
  paymentDueDate: string = new Date().toISOString().split('T')[0];
  maxEntries: number = 20; // Default limit on registrations
  notify: boolean = false; // Notification settings
  description = '';
  loggedInUser?: User ;
  userClub?: Club;

  constructor(private mockData: MockDataService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.loggedInUser = this.mockData.getLoggedInUser();

    if (!this.loggedInUser || !this.userClub) {
      console.error('No logged-in user or club associated with the logged-in user found.');
      return;
    }

    if (this.loggedInUser && this.loggedInUser.role === Role.INSTRUCTOR || Role.ADMIN) {
      this.userClub = this.mockData.getClubById(this.loggedInUser.clubId);
    }

    await this.initializeGapiClient();
  }

  async initializeGapiClient(): Promise<void> {
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

  async createGoogleCalendarEvent(event: Events): Promise<void> {
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
      console.log('Event created: ', response);
    } catch (error) {
      console.error('Error creating event: ', error);
    }
  }

  async onCreateEvent() {
    if (!this.validateInputs()) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const newEvent: Events = {
      id: this.generateId(),
      eventName: this.eventName,
      location: this.location,
      date: new Date(this.date),
      cost: this.cost,
      paymentDueDate: new Date(this.paymentDueDate),
      maxEntries: this.maxEntries,  // Added max entries
      interestedStudents: [],
      finalRegistrations: [],
      description: this.description,
      instructorId : this.loggedInUser?.id ?? '',
      clubId : this.userClub?.id ?? ''
    };

    this.mockData.addEvent(newEvent);

    if (this.notify) {
      this.sendNotification();
    }

    await this.createGoogleCalendarEvent(newEvent);

    alert(`Event "${this.eventName}" created successfully!`);
    this.router.navigate(['/event-list']);
  }

  private generateId(): string {
    return 'EVT-' + Math.floor(Math.random() * 100000);
  }

  private sendNotification(): void {
    console.log(`Notification sent for event: ${this.eventName}`);
  }

  private validateInputs(): boolean {
    return (
      this.eventName.trim().length > 0 &&
      this.location.trim().length > 0 &&
      this.cost > 0 &&
      this.maxEntries > 0 &&
      new Date(this.paymentDueDate) >= new Date(this.date)
    );
  }
}
