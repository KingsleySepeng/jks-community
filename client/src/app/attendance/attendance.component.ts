import {Component, Input, OnInit} from '@angular/core';
import {Student, User} from '../model/user';
import {Attendance, AttendanceStatus, AttendanceSummary} from '../model/attendance ';
import {DatePipe, NgForOf, NgIf, NgClass, DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ServiceService} from '../services/service.service';
import {Role} from '../model/role';

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
  students: Student[] = [];
  loggedInUser?: User;
  attendanceState: { [userId: string]: { status: AttendanceStatus | undefined; comment: string; showHistory: boolean } } = {};

  selectedDate: Date = new Date();
  selectedDateString: string = this.formatDateForInput(this.selectedDate);
  isSaving = false;
  showModal = false;

  aggregationStartDate: string = new Date().toISOString().split('T')[0];
  aggregationEndDate: string = new Date().toISOString().split('T')[0];

  protected readonly AttendanceStatus = AttendanceStatus;

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loggedInUser = this.serviceService.getLoggedInUserValue();
    if (!this.loggedInUser) {
      console.error('No instructor is logged in.');
      return;
    }

    const userClubId = this.loggedInUser.clubId;
    this.serviceService.getUsers().subscribe(users => {
      this.students = users.filter(
        u => u.clubId === userClubId && u.roles.includes(Role.STUDENT)
      ) as Student[];
      this.initializeAttendanceState();
    });
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
    if (!this.loggedInUser) {
      alert('No instructor is logged in.');
      return;
    }

    this.isSaving = true;

    const attendanceRecords: Attendance[] = this.students.flatMap(student => {
      const state = this.attendanceState[student.id];
      if (state.status) {
        return [{
          // id: this.generateUniqueId(),
          id: "",
          date: this.selectedDate,
          status: state.status,
          instructorId: this.loggedInUser!.id,
          userId: student.id,
          clubId: this.loggedInUser!.clubId,
          comments: state.comment,
          createdAt: new Date(),
          updatedAt: new Date()
        }];
      }
      return [];
    });

    this.serviceService.saveAttendanceRecords(attendanceRecords);
    this.isSaving = false;
    this.openModal();
  }


  getAttendanceSummary(student: Student): AttendanceSummary {
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

  updateAggregates(): void {}

}
