import { Component } from '@angular/core';
import {GradingRecord} from '../model/grading-record';
import {Student} from '../model/user';
import {Attendance} from '../model/attendance ';
import {Payment} from '../model/payment';
import {MockDataService} from '../mock-service/mock-data.service';
import {Router} from '@angular/router';
import {DatePipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-instructor-report',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf
  ],
  templateUrl: './instructor-report.component.html',
  styleUrl: './instructor-report.component.scss'
})
export class InstructorReportComponent {
  gradingRecords: GradingRecord[] = [];
  attendanceRecords: Attendance[] = [];
  payments: Payment[] = [];
  outstandingPayments: { student: Student; amountDue: number }[] = [];
  financialSummary: { totalIncome: number; totalExpense: number; netBalance: number } = {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0
  };

  constructor(private mockData: MockDataService, private router: Router) {}

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData() {
    this.gradingRecords = this.mockData.getAllGradingRecords();
    this.attendanceRecords = this.mockData.getAttendances();
    this.payments = this.mockData.getPayments();
    this.calculateOutstandingPayments();
    this.calculateFinancialSummary();
  }

  private calculateOutstandingPayments() {
    const students = this.mockData.getUsers().filter(user => user.role === 'STUDENT') as Student[];
    this.outstandingPayments = students
      .map(student => {
        const totalPaid = this.payments.filter(p => p.userId === student.id).reduce((sum, p) => sum + p.amount, 0);
        const totalDue = 500; // Assume each student owes R500 per month for class fees
        const amountDue = totalDue - totalPaid;
        return amountDue > 0 ? { student, amountDue } : null;
      })
      .filter(entry => entry !== null) as { student: Student; amountDue: number }[];
  }

  private calculateFinancialSummary() {
    const totalIncome = this.payments.reduce((sum, p) => sum + p.amount, 0);
    const totalExpense = 2000; // Placeholder, expenses could be fetched from another source
    this.financialSummary = {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense
    };
  }

  viewGradingDetail(record: GradingRecord) {
    this.router.navigate(['/grading-detail', record.id]);
  }
}
