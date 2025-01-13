import {Component, OnInit} from '@angular/core';
import {Student, User} from '../model/user';
import {Payment} from '../model/payment';
import {Attendance} from '../model/attendance ';
import {MockDataService} from '../mock-service/mock-data.service';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-instructor-report',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './instructor-report.component.html',
  styleUrl: './instructor-report.component.scss'
})
export class InstructorReportComponent implements OnInit{
// For demo purposes, we assume the instructor is logged in with ID 'I001'
  currentInstructorId: string = 'I001';
  currentInstructor?: User;

  // Students in the instructor's club
  students: Student[] = [];

  // Collections from the mock service
  payments: Payment[] = [];
  attendances: Attendance[] = [];

  // The selected month for which the report is generated (YYYY-MM format)
  selectedMonth: string = new Date().toISOString().substr(0, 7);

  // The final report: one record per student with payment status and attendance count
  report: { student: Student; paid: boolean; attendanceCount: number }[] = [];

  constructor(private mockService: MockDataService) { }

  ngOnInit(): void {
    // Load all users from the mock service
    const allUsers = this.mockService.getUsers();
    // Find the instructor (you could also get this from an authentication service)
    this.currentInstructor = allUsers.find(u => u.id === this.currentInstructorId);

    if (this.currentInstructor) {
      // Get all students from the same club as the instructor.
      // (Assuming your users have a "clubId" property.)
      this.students = allUsers.filter(u => u.role === 'STUDENT' && u.clubId === this.currentInstructor?.clubId) as Student[];
    }

    // Get payments and attendances from the mock service.
    this.payments = this.mockService.getPayments();
    this.attendances = this.mockService.getAttendances();

    this.generateReport();
  }

  // Called when the month selection changes (using an <input type="month">)
  onMonthChange(newMonth: string): void {
    this.selectedMonth = newMonth;
    this.generateReport();
  }

  generateReport(): void {
    // For each student, check if they have a payment in the selected month and count their attendance records.
    this.report = this.students.map(student => {
      // Filter payments for this student for the selected month.
      const studentPayments = this.payments.filter(p =>
        p.userId === student.id && this.isDateInSelectedMonth(p.paymentDate)
      );
      // Assume if any payment is marked as 'PAID', the student is considered to have paid.
      const paid = studentPayments.some(p => p.status === 'PAID');

      // Similarly, filter attendance records for this student for the selected month.
      const studentAttendances = this.attendances.filter(a =>
        a.userId === student.id && this.isDateInSelectedMonth(a.date)
      );
      const attendanceCount = studentAttendances.length;

      return { student, paid, attendanceCount };
    });
  }

  // Helper function to check if a given date falls in the selected month.
  private isDateInSelectedMonth(date: Date): boolean {
    const d = new Date(date);
    return d.toISOString().substr(0, 7) === this.selectedMonth;
  }
}
