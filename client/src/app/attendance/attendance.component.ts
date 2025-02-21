import {Component, Input} from '@angular/core';
import {Instructor, Student} from '../model/user';
import {Attendance, AttendanceStatus} from '../model/attendance ';
import {MockDataService} from '../mock-service/mock-data.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Role} from '../model/role';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {
  @Input() instructor!: Instructor; // The instructor viewing the attendance
  students: Student[] = [];
  attendanceState: { [userId: string]: { status: AttendanceStatus | undefined; comment: string; showHistory: boolean } } = {};

  selectedDate: Date = new Date();
  selectedDateString: string = this.formatDateForInput(this.selectedDate);

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    if (!this.instructor) {
      console.error('No instructor provided for attendance tracking.');
      return;
    }

    // Load students who belong to the instructor's club
    this.students = this.mockDataService.getUsers().filter(
      (user) => user.clubId === this.instructor.clubId && user.role === Role.STUDENT
    ) as Student[];

    this.initializeAttendanceState();
  }

  private initializeAttendanceState(): void {
    this.students.forEach((student) => {
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

    this.students.forEach((student) => {
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

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  protected readonly AttendanceStatus = AttendanceStatus;
}
