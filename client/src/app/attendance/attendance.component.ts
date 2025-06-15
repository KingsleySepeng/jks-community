import {Component, Input, OnInit} from '@angular/core';
import {Instructor, Student, User} from '../model/user';
import {Attendance, AttendanceStatus, AttendanceSummary} from '../model/attendance ';
import { MockDataService } from '../mock-service/mock-data.service';
import {DatePipe, NgForOf, NgIf, NgClass, DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgForOf,
    DecimalPipe,
    FormsModule,
    NgClass,
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  @Input() instructor!: Instructor;
  students: Student[] = [];
  attendanceState: { [userId: string]: { status: AttendanceStatus | undefined; comment: string; showHistory: boolean } } = {};

  selectedDate: Date = new Date();
  selectedDateString: string = this.formatDateForInput(this.selectedDate);
  isSaving = false;
  showModal = false;

  // Global aggregation date range
  aggregationStartDate: string = new Date().toISOString().split('T')[0];
  aggregationEndDate: string = new Date().toISOString().split('T')[0];

  protected readonly AttendanceStatus = AttendanceStatus;

  constructor(
    private mockDataService: MockDataService,
  ) {}

   ngOnInit(): void{
    if (!this.instructor) {
      console.error('No instructor provided for attendance tracking.');
      return;
    }
    // Load students for the instructor's club
    this.students = this.mockDataService.getUsers().filter(
      user => user.clubId === this.instructor.clubId
    ) as Student[];
    this.initializeAttendanceState();
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
    if (!this.instructor) {
      alert('No instructor is logged in.');
      return;
    }
    this.isSaving = true;
    this.students.forEach(student => {
      const state = this.attendanceState[student.id];
      if (state.status) {
        const newRecord: Attendance = {
          id: this.generateUniqueId(),
          date: this.selectedDate,
          status: state.status,
          instructorId: this.instructor.id,
          userId: student.id,
          clubId: this.instructor.clubId,
          comments: state.comment,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        student.attendance = [...(student.attendance || []), newRecord];
      }
    });

    this.mockDataService.updateUsers(this.students);
    this.isSaving = false;
    this.openModal();
  }

  // Aggregation: returns summary counts for a given student over the aggregation date range.
  getAttendanceSummary(student:  Student): AttendanceSummary {
    const start = new Date(this.aggregationStartDate);
    const end = new Date(this.aggregationEndDate);
    const records = (student.attendance || []).filter(record => {
      const recDate = new Date(record.date);
      return recDate >= start && recDate <= end;
    });
    const total = records.length;
    const presentCount = records.filter(r => r.status.toLowerCase() === AttendanceStatus.PRESENT.toLowerCase()).length;
    const notAttended = total - presentCount;
    const percentage = total > 0 ? (presentCount / total) * 100 : 0;
    return { total, present: presentCount, notAttended, percentage };
  }

  // Detailed Attendance: returns a list of all attendance records for the given global date range.
  getDetailedAttendance(): Attendance[] {
    const start = new Date(this.aggregationStartDate);
    const end = new Date(this.aggregationEndDate);
    let allRecords: Attendance[] = [];
    this.students.forEach(student => {
      allRecords = allRecords.concat(student.attendance || []);
    });
    return allRecords.filter(record => {
      const recDate = new Date(record.date);
      return recDate >= start && recDate <= end;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Helper: Get student name by ID.
  getStudentName(userId: string): string {
    const student = this.students.find(s => s.id === userId);
    return student ? `${student.firstName} ${student.lastName}` : userId;
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  updateAggregates(): void {
    // This method is triggered on change of the aggregation dates.
    // With the current implementation, getAttendanceSummary() and getDetailedAttendance() recalc on the fly.
  }}
