import {Component, OnInit} from '@angular/core';
import {GradingRecord} from '../model/grading-record';
import {MockDataService} from '../mock-service/mock-data.service';
import {NgForOf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-grading-report',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './grading-report.component.html',
  styleUrl: './grading-report.component.scss'
})
export class GradingReportComponent implements OnInit {
  gradingRecords: GradingRecord[] = [];
  groupedRecords: { [belt: string]: GradingRecord[] } = {};
  notify: boolean = false; // New field for notification settings

  constructor(private mockData: MockDataService, private router: Router) {}

  ngOnInit(): void {
    this.gradingRecords = this.mockData.getAllGradingRecords();

    // Group them by tested belt
    this.groupRecords();
  }

  groupRecords() {
    this.groupedRecords = {};
    for (let rec of this.gradingRecords) {
      const beltKey = rec.testingForBelt;
      if (!this.groupedRecords[beltKey]) {
        this.groupedRecords[beltKey] = [];
      }
      this.groupedRecords[beltKey].push(rec);
    }
  }

  getGroupKeys(): string[] {
    return Object.keys(this.groupedRecords);
  }

  viewGradingDetail(record: GradingRecord) {
    // navigate to a detail page, e.g. /grading-detail/:id
    // or open a modal
    this.router.navigate(['/grading-detail', record.id]);
  }

  sendNotification(): void {
    // Placeholder for notification logic
    console.log(`Notification sent for grading results`);
  }

  onNotifyChange(event: Event): void {
    this.notify = (event.target as HTMLInputElement).checked;
  }

  onSubmitGradingReport(): void {
    // Send notification if the user opted in
    if (this.notify) {
      this.sendNotification();
    }
  }
}
