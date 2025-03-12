import { Component, Input } from '@angular/core';
import { Instructor, Student } from '../model/user';
import { Attendance, AttendanceStatus } from '../model/attendance ';
import { MockDataService } from '../mock-service/mock-data.service';
import { DatePipe, NgForOf, NgIf, NgClass } from '@angular/common';
import { Role } from '../model/role';
import { loadGapiInsideDOM } from 'gapi-script';
import {GoogleApiService} from '../google-api.service';
declare var gapi: any;

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent {
  @Input() instructor!: Instructor;
  students: Student[] = [];
  attendanceState: { [userId: string]: { status: AttendanceStatus | undefined; comment: string; showHistory: boolean } } = {};

  selectedDate: Date = new Date();
  selectedDateString: string = this.formatDateForInput(this.selectedDate);
  isSaving = false; // Saving indicator
  showModal = false; // Controls modal visibility

  protected readonly AttendanceStatus = AttendanceStatus;

  constructor(
    private mockDataService: MockDataService,
    private googleApiService: GoogleApiService // Inject the Google API service
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.instructor) {
      console.error('No instructor provided for attendance tracking.');
      return;
    }

    // Load students for the instructor's club
    this.students = this.mockDataService.getUsers().filter(
      user => user.clubId === this.instructor.clubId && user.role === Role.STUDENT
    ) as Student[];

    this.initializeAttendanceState();
    await this.googleApiService.initializeGapiClient(); // Initialize the Google API client
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

  async onSaveAttendance(): Promise<void> {
    if (!this.instructor) {
      alert('No instructor is logged in.');
      return;
    }
    this.isSaving = true;
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

    // Ensure the user is signed in before updating the Google Sheet.
    await this.googleApiService.signIn();

    // Prepare data for Google Sheets update
    const spreadsheetId = '19nkU4RJvSxmgipg9iqDgmYgZRFm_H14QANuHhIKeUBM';
    const range = 'Sheet1!A1:E1';
    const values = this.students.map(student => {
      const state = this.attendanceState[student.id];
      return [
        student.id,
        student.firstName,
        student.lastName,
        state.status,
        state.comment
      ];
    });

    await this.googleApiService.updateGoogleSheet(spreadsheetId, range, values);
    this.isSaving = false;
    this.openModal();
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
}
