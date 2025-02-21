import {Component, OnInit} from '@angular/core';
import {GradingRecord} from '../model/grading-record';
import {MockDataService} from '../mock-service/mock-data.service';
import {DatePipe, NgForOf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-grading-report',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe
  ],
  templateUrl: './grading-report.component.html',
  styleUrl: './grading-report.component.scss'
})
export class GradingReportComponent implements OnInit {
  gradingRecords: GradingRecord[] = [];
  groupedRecords: { [date: string]: GradingRecord[] } = {}; // Now grouped by date
  notify: boolean = false; // New field for notification settings

  constructor(private mockData: MockDataService, private router: Router) {}

  ngOnInit(): void {
    this.gradingRecords = this.mockData.getAllGradingRecords();
    this.groupRecordsByDate();
  }

  /** 🔹 Groups records by grading date */
  groupRecordsByDate() {
    this.groupedRecords = {};

    for (let rec of this.gradingRecords) {
      const dateKey = rec.date.toISOString().split('T')[0]; // Extract YYYY-MM-DD

      if (!this.groupedRecords[dateKey]) {
        this.groupedRecords[dateKey] = [];
      }
      this.groupedRecords[dateKey].push(rec);
    }
  }

  /** 🔹 Returns unique grading dates */
  getGroupKeys(): string[] {
    return Object.keys(this.groupedRecords).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }

  /** 🔹 Get Student's Full Name */
  getStudentName(studentId: string): string {
    const student = this.mockData.getUserById(studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  }

  /** 🔹 Get Examiner's Full Name */
  getExaminerName(examinerId: string): string {
    const examiner = this.mockData.getUserById(examinerId);
    return examiner ? `${examiner.firstName} ${examiner.lastName}` : 'Unknown';
  }

  /** 🔹 Navigate to Grading Detail */
  viewGradingDetail(record: GradingRecord) {
    this.router.navigate(['/grading-detail', record.id]);
  }

  /** 🔹 Handles Notifications */
  sendNotification(): void {
    console.log(`Notification sent for grading results`);
  }

  onNotifyChange(event: Event): void {
    this.notify = (event.target as HTMLInputElement).checked;
  }

  onSubmitGradingReport(): void {
    if (this.notify) {
      this.sendNotification();
    }
  }
}
