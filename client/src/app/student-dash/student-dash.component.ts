import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Student } from '../model/user';
import { GradingRecord } from '../model/grading-record';
import { Events } from '../model/events';
import { Payment } from '../model/payment';
import { MockDataService } from '../mock-service/mock-data.service';
import { Chart, registerables } from 'chart.js';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-student-dash',
  standalone: true,
  // Add other necessary module imports here (e.g., CommonModule, FormsModule, etc.)
  templateUrl: './student-dash.component.html',
  imports: [
    DatePipe,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./student-dash.component.scss']
})
export class StudentDashComponent implements OnInit, AfterViewInit {
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
      this.gradingRecords = this.mockDataService.getAllGradingRecords().filter(record => record.studentId === this.currentUser!.id);
      if (this.currentUser.id) {
        this.attendedEvents = this.mockDataService.getEvents().filter(event => event.finalRegistrations.includes(this.currentUser!.id));
      }
      this.paymentHistory = this.mockDataService.getPayments().filter(payment => payment.userId === this.currentUser!.id);
      this.outstandingFees = this.mockDataService.getOutstandingFees(this.currentUser!.id);
    }
  }

  ngAfterViewInit(): void {
    this.createGradingChart();
  }

  createGradingChart(): void {
    // Create a breakdown of grading decisions
    const decisionCounts: { [key: string]: number } = {};
    this.gradingRecords.forEach(record => {
      const decision = record.overallDecision;
      decisionCounts[decision] = (decisionCounts[decision] || 0) + 1;
    });
    const labels = Object.keys(decisionCounts);
    const data = labels.map(label => decisionCounts[label]);

    const ctx = (document.getElementById('studentGradingChart') as HTMLCanvasElement)?.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: ['#4CAF50', '#F44336', '#FFC107'] // colors for Pass, Fail, Regrade etc.
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }
  }
}
