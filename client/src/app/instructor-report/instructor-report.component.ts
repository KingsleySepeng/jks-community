import { Component, AfterViewInit, OnInit } from '@angular/core';
import { GradingRecord } from '../model/grading-record';
import { Student, User } from '../model/user';
import { Attendance } from '../model/attendance ';
import { Payment } from '../model/payment';
import { MockDataService } from '../mock-service/mock-data.service';
import { Router } from '@angular/router';
import { DatePipe, NgForOf } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-instructor-report',
  standalone: true,
  imports: [DatePipe, NgForOf],
  templateUrl: './instructor-report.component.html',
  styleUrls: ['./instructor-report.component.scss']
})
export class InstructorReportComponent implements OnInit, AfterViewInit {
  gradingRecords: GradingRecord[] = [];
  attendanceRecords: Attendance[] = [];
  payments: Payment[] = [];
  outstandingPayments: { student: Student; amountDue: number }[] = [];
  financialSummary: { totalIncome: number; totalExpense: number; netBalance: number } = {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0
  };

  // Chart references
  gradingChart: Chart | null = null;
  financialChart: Chart | null = null;

  constructor(private mockData: MockDataService, private router: Router) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngAfterViewInit(): void {
    this.createGradingChart();
    this.createFinancialChart();
  }

  private fetchData() {
    this.gradingRecords = this.mockData.getAllGradingRecords();
    this.attendanceRecords = this.mockData.getAttendances();
    this.payments = this.mockData.getPayments();
    this.calculateOutstandingPayments();
    this.calculateFinancialSummary();
  }

  private calculateOutstandingPayments() {
    const students = this.mockData.getUsers().filter(user => user.role === 'STUDENT');
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

  // --- Chart creation methods ---

  private createGradingChart() {
    // Compute distribution of grading decisions (e.g., pass, fail, regrade)
    const decisionCounts: { [key: string]: number } = {};
    this.gradingRecords.forEach(record => {
      const decision = record.overallDecision;
      decisionCounts[decision] = (decisionCounts[decision] || 0) + 1;
    });

    const labels = Object.keys(decisionCounts);
    const data = labels.map(label => decisionCounts[label]);

    const ctx = (document.getElementById('gradingChart') as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      this.gradingChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Number of Decisions',
            data,
            backgroundColor: ['#4CAF50', '#F44336', '#FFC107'], // colors for pass, fail, regrade
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: false,
            }
          }
        }
      });
    }
  }

  private createFinancialChart() {
    const labels = ['Total Income', 'Total Expense'];
    const data = [this.financialSummary.totalIncome, this.financialSummary.totalExpense];

    const ctx = (document.getElementById('financialChart') as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      this.financialChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: ['#2196F3', '#FF5722']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: false,
            }
          }
        }
      });
    }
  }
}
