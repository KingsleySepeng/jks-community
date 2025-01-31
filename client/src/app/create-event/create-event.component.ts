import { Component } from '@angular/core';
import {MockDataService} from '../mock-service/mock-data.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Event} from '../model/event';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {
  eventName = '';
  location = '';
  date: string = new Date().toISOString().split('T')[0]; // default to today
  cost: number = 0;
  paymentDueDate: string = new Date().toISOString().split('T')[0];

  constructor(private mockData: MockDataService, private router: Router) {}

  onCreateEvent() {
    const newEvent: Event = {
      id: this.generateId(),
      eventName: this.eventName,
      location: this.location,
      date: new Date(this.date),
      cost: this.cost,
      paymentDueDate: new Date(this.paymentDueDate),
      interestedStudents: [],
      finalRegistrations: []
    };

    this.mockData.addEvent(newEvent);
    // navigate to event list or show success
    this.router.navigate(['/event-list']);
  }

  private generateId(): string {
    return 'EVT-' + Math.floor(Math.random()*100000);
  }
}
