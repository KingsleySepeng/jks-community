import {Component, Input, OnInit} from '@angular/core';
import { User} from '../model/user';
import {Attendance, AttendanceStatus, AttendanceSummary} from '../model/attendance ';
import {DatePipe, NgForOf, NgIf, NgClass, DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ServiceService} from '../services/service.service';


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
  loggedInUser?: User;
  students: User[] = [];
  attendanceState: {
    [userId: string]: {
      status: AttendanceStatus | undefined;
      comment: string;
      showHistory: boolean;
    };
  } = {};

  selectedDate: Date = new Date();
  selectedDateString: string = this.formatDateForInput(this.selectedDate);
  isSaving = false;
  showModal = false;

  successMessage = '';
  errorMessage = '';

  aggregationStartDate: string = this.formatDateForInput(new Date());
  aggregationEndDate: string = this.formatDateForInput(new Date());


  protected readonly AttendanceStatus = AttendanceStatus;

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loggedInUser = this.serviceService.getLoggedInUserValue();
    if (!this.loggedInUser) {
      console.error('No instructor is logged in.');
      return;
    }

    const instructorClubId = this.loggedInUser.clubId;
    this.serviceService.getUsersByClub(instructorClubId).subscribe(users =>{
      this.students = users;
      this.initializeAttendanceState();
    })

  }

  private initializeAttendanceState(): void {
    this.students.forEach(student => {
      if (!this.attendanceState[student.id]) {
        this.attendanceState[student.id] = {
          showHistory: false,
          status: undefined,
          comment: ''
        };
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
    if (!this.loggedInUser || !this.loggedInUser.clubId) {
      this.setError('No instructor is logged in or club is missing.');
      return;
    }

    this.isSaving = true;

    const attendanceRecords: Attendance[] = this.students.flatMap(student => {
      const state = this.attendanceState[student.id];
      if (state.status) {
        return [{
          id: '',
          date: this.selectedDate.toISOString(),
          status: state.status,
          instructorId: this.loggedInUser!.id,
          userId: student.id,
          clubId: this.loggedInUser!.clubId!,
          comments: state.comment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }];
      }
      return [];
    });

    this.serviceService.saveAttendanceRecords(attendanceRecords).subscribe({
      next: () => {
        this.setSuccess('Attendance saved successfully!');
        this.isSaving = false;
        this.openModal();
        this.updateAggregates(); // ← this will refresh detailed & aggregate views
      },
      error: (err) => {
        console.error('Save failed:', err);
        this.setError(err.error?.message || 'Failed to save attendance. Please try again.');
        this.isSaving = false;
      }
    });
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
    if (!this.loggedInUser?.clubId) return;

    this.serviceService.getDetailedAttendance(
      this.loggedInUser.clubId,
      this.aggregationStartDate,
      this.aggregationEndDate
    ).subscribe({
      next: (records) => {
        this.students.forEach(student => {
          student.attendance = records.filter(r => r.userId === student.id);
        });
        records.forEach(r => {
          const student = this.students.find(s => s.id === r.userId);
          r.fullName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
        });

        this.serviceService.getAttendanceSummary(
          this.loggedInUser!.clubId,
          this.aggregationStartDate,
          this.aggregationEndDate
        ).subscribe(summaryList => {
          this.students.forEach(student => {
            student.attendanceSummary = summaryList.find(s => s.userId === student.id) || {
             userId:student.id, total: 0, present: 0, notAttended: 0, percentage: 0
            };
          });
        });
      },
      error: (err) => {
        console.error('Failed to fetch data', err);
        this.setError('Could not load attendance data.');
      }
    });
  }


  private setSuccess(msg: string): void {
    this.successMessage = msg;
    this.errorMessage = '';
  }

  private setError(msg: string): void {
    this.errorMessage = msg;
    this.successMessage = '';
  }
}
