import {Component, Input} from '@angular/core';
import {Instructor, Student} from '../model/user';
import {Attendance, AttendanceStatus} from '../model/attendance ';
import {MockDataService} from '../mock-service/mock-data.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Role} from '../model/role';
import { loadGapiInsideDOM } from 'gapi-script';
declare var gapi: any;

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

  async ngOnInit(): Promise<void> {
    if (!this.instructor) {
      console.error('No instructor provided for attendance tracking.');
      return;
    }

    // Load students who belong to the instructor's club
    this.students = this.mockDataService.getUsers().filter(
      (user) => user.clubId === this.instructor.clubId && user.role === Role.STUDENT
    ) as Student[];

    this.initializeAttendanceState();
    await this.initializeGapiClient();
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

  async onSaveAttendance(): Promise<void> {
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
    await this.updateGoogleSheet();
    alert('Attendance saved successfully!');
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private async initializeGapiClient(): Promise<void> {
    await loadGapiInsideDOM();
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: 'YOUR_CLIENT_ID',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        scope: 'https://www.googleapis.com/auth/spreadsheets'
      });
    });
  }

  private async updateGoogleSheet(): Promise<void> {
    const spreadsheetId = 'YOUR_SPREADSHEET_ID';
    const range = 'Sheet1!A1:E1'; // Adjust the range as needed

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

    const body = {
      values
    };

    try {
      await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: body
      });
      console.log('Attendance data updated in Google Sheets');
    } catch (error) {
      console.error('Error updating Google Sheets:', error);
    }
  }

  protected readonly AttendanceStatus = AttendanceStatus;
}
