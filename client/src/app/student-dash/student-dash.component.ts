import { Component } from '@angular/core';
import {Student} from '../model/user';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {GradingRecord} from '../model/grading-record';
import {Events} from '../model/events';
import {Payment} from '../model/payment';
import {MockDataService} from '../mock-service/mock-data.service';
import {UserProfileComponent} from '../user-profile/user-profile.component';

@Component({
  selector: 'app-student-dash',
  standalone: true,
  imports: [
    NgForOf,
    UserProfileComponent,
    NgIf,
    DatePipe
  ],
  templateUrl: './student-dash.component.html',
  styleUrl: './student-dash.component.scss'
})
export class StudentDashComponent {
  currentUser?: Student;
  gradingRecords: GradingRecord[] = [];
  attendedEvents: Events[] = [];
  outstandingFees = 0;
  paymentHistory: Payment[] = [];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    const loggedInUser = this.mockDataService.getLoggedInUser();

    if (loggedInUser && loggedInUser.role === 'STUDENT') {
      this.currentUser = loggedInUser as Student;

      this.gradingRecords = this.mockDataService
        .getAllGradingRecords()
        .filter(record => record.studentId === this.currentUser?.id);

      // Load attended events
      if (this.currentUser?.id) {
        this.attendedEvents = this.mockDataService
          .getEvents()
          .filter(event => event.finalRegistrations.includes(this.currentUser!.id));
      }

      this.paymentHistory = this.mockDataService
        .getPayments()
        .filter(payment => payment.userId === this.currentUser?.id);

      this.outstandingFees = this.mockDataService.getOutstandingFees(this.currentUser?.id);
    }
  }
}
