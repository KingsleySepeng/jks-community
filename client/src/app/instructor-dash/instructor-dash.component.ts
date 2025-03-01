import {Component, OnInit} from '@angular/core';
import {Instructor, Student, User} from '../model/user';
import {CommonModule} from '@angular/common';
import {Attendance, AttendanceStatus} from '../model/attendance ';
import {Role} from '../model/role';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Payment} from '../model/payment';
import {MockDataService} from '../mock-service/mock-data.service';
import {Club} from '../model/club';
import {GradingRecord} from '../model/grading-record';
import {Resource} from '../model/resource';
import {Events} from '../model/events';
import {AttendanceComponent} from '../attendance/attendance.component';
import {InstructorReportComponent} from '../instructor-report/instructor-report.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-instructor-dash',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AttendanceComponent, InstructorReportComponent],
  templateUrl: './instructor-dash.component.html',
  styleUrl: './instructor-dash.component.scss'
})
export class InstructorDashComponent implements OnInit {
  loggedInInstructor: Instructor | null = null; // Default to null instead of undefined
  students: Student[] = [];
  attendanceState: { [userId: string]: { showHistory: boolean; status?: AttendanceStatus; comment: string } } = {};
  selectedDate: Date = new Date();
  selectedDateString: string = this.formatDateForInput(this.selectedDate);

  // Instructor-specific data
  club?: Club;
  payments: Payment[] = [];
  events: Events[] = [];
  gradingRecords: GradingRecord[] = [];
  resources: Resource[] = [];

  // UI state
  selectedTab: string = 'attendance';
  selectedMonth: string = new Date().toISOString().substr(0, 7);
  report: { student: Student; paid: boolean; attendanceCount: number }[] = [];

  constructor(private mockDataService: MockDataService, private router: Router) {}

  ngOnInit(): void {
    this.loggedInInstructor = this.mockDataService.getLoggedInUser() as Instructor;
    if (!this.loggedInInstructor) {
      console.error("No logged-in instructor found!");
      return;
    }

      const users = this.mockDataService.getUsers();
      this.students = users.filter(user => user.clubId === this.loggedInInstructor!.clubId && user.role === Role.STUDENT) as Student[];

      // Fetch Club Data
      this.club = this.mockDataService.getClubById(this.loggedInInstructor.clubId);

      // Fetch Events, Payments, Grading Records, and Resources
      this.events = this.mockDataService.getEvents().filter(e => e.clubId === this.loggedInInstructor?.clubId);
      this.payments = this.mockDataService.getPayments();
      this.gradingRecords = this.mockDataService.getAllGradingRecords().filter(g => g.clubId === this.loggedInInstructor?.clubId);
      this.resources = this.mockDataService.getAllResources();


    this.initializeAttendanceState();
    this.generateReport();
  }

  /** ✅ FIX: Correctly formats date for `<input type="date">` */
  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /** ✅ FIX: Implement event registration for instructors */
  onFinalizeRegistration(event: Events): void {
    if (!this.loggedInInstructor) {
      alert("You must be logged in as an instructor to finalize registrations.");
      return;
    }

    // Ensure only students in the instructor's dojo can register
    const eligibleStudents = this.students.map(student => student.id);

    event.finalRegistrations = event.finalRegistrations.filter(id => eligibleStudents.includes(id));

    this.mockDataService.finalizeEventRegistration(event.id);
    alert(`Finalized event registration for ${event.eventName}`);
  }

  private initializeAttendanceState(): void {
    this.students.forEach(student => {
      if (!this.attendanceState[student.id]) {
        this.attendanceState[student.id] = { showHistory: false, status: undefined, comment: '' };
      }
    });
  }

  toggleHistory(userId: string): void {
    this.attendanceState[userId].showHistory = !this.attendanceState[userId].showHistory;
  }

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = new Date(inputElement.value);
    this.selectedDateString = this.formatDateForInput(this.selectedDate);
  }

  onAttendanceRadioChange(userId: string, status: AttendanceStatus): void {
    this.attendanceState[userId].status = status;
  }

  onCommentChange(userId: string, event: Event): void {
    const comment = (event.target as HTMLTextAreaElement).value;
    this.attendanceState[userId].comment = comment;
  }

  onSaveAttendance(): void {
    if (!this.loggedInInstructor) {
      console.error("Instructor not found.");
      return;
    }
    const instructorId = this.loggedInInstructor?.id || '';
    const clubId = this.loggedInInstructor?.clubId || '';
    this.students.forEach(student => {
      const state = this.attendanceState[student.id];
      if (state.status) {
        const newRecord: Attendance = {
          id: this.generateUniqueId(),
          date: this.selectedDate,
          status: state.status,
          instructorId: instructorId,
          userId: student.id,
          clubId: clubId,
          comments: state.comment,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        student.attendance.push(newRecord);
      }
    });
    this.mockDataService.updateUsers(this.students);
    alert('Attendance saved successfully!');
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  generateReport(): void {
    this.report = this.students.map(student => {
      const studentPayments = this.payments.filter(p => p.userId === student.id && this.isDateInSelectedMonth(p.paymentDate));
      const paid = studentPayments.some(p => p.status === 'PAID');

      const studentAttendances = this.mockDataService.getAttendances().filter(a => a.userId === student.id && this.isDateInSelectedMonth(a.date));
      return { student, paid, attendanceCount: studentAttendances.length };
    });
  }

  private isDateInSelectedMonth(date: Date): boolean {
    return new Date(date).toISOString().substr(0, 7) === this.selectedMonth;
  }

  viewGradingDetail(record: GradingRecord) {
    this.router.navigate(['/grading-detail', record.id]);
  }
}
