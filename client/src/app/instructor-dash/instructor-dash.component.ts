import {Component, OnInit} from '@angular/core';
import {Instructor, Student} from '../model/user';
import {MockServiceService} from '../mock-service/mock-service.service';
import {CommonModule} from '@angular/common';
import {Attendance, AttendanceStatus} from '../model/attendance ';
import {MockDataService} from '../mock-service/mock-data.service';
import {Role} from '../model/role';
import {Belt} from '../model/belt';

@Component({
  selector: 'app-instructor-dash',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './instructor-dash.component.html',
  styleUrl: './instructor-dash.component.scss'
})
export class InstructorDashComponent implements OnInit {
  students: Student[] = [];
  // user: Instructor ;
  loggedInInstructor?:Instructor;
   user: {
    id: string;
    memberId: string;
    email: any;
    password: any;
    firstName: string;
    lastName: string;
    clubId: string;
    belt: Belt;
    role: any;
    isActive: boolean;
    attendance: any[]
  } = {
    id: '', // You can set this to an empty string or any default value
    memberId: '', // You can set this to an empty string or any default value
    email: '',
    password: '',
    firstName: '', // You can set this to an empty string or any default value
    lastName: '', // You can set this to an empty string or any default value
    clubId: '', // You can set this to an empty string or any default value
    belt: Belt.WHITE, // You can set this to a default value
    role: Role.INSTRUCTOR, // You can set this to a default value
    isActive: true, // You can set this to a default value
    attendance: [] // You can set this to an empty array or any default value
  };
  attendanceState: {
    [userId: string]: {
      showHistory: boolean;
      status: AttendanceStatus | undefined;
      comment: string;
    };
  } = {};

  selectedDate: Date = new Date();
  selectedDateString: string = this.formatDateForInput(this.selectedDate);

  constructor(
    private mockService: MockServiceService,
    private mockDataService: MockDataService
  ) { }

  ngOnInit(): void {
    debugger;
    this.loggedInInstructor = this.mockService.getLoggedInUser();
    if(this.loggedInInstructor){
      const users = this.mockDataService.getUsers();
      this.students = users.filter(user=>user.clubId === this.loggedInInstructor!.clubId && user.role === Role.STUDENT) as Student[];
    } else{
      this.students = [];
    }

    this.initializeAttendanceState();
  }

  private initializeAttendanceState(): void {
    this.students.forEach((student) => {
      if (!this.attendanceState[student.id]) {
        this.attendanceState[student.id] = {
          showHistory: false,
          status: undefined,
          comment: '',
        };
      }
    });
  }

  toggleHistory(userId: string): void {
    const state = this.attendanceState[userId];
    state.showHistory = !state.showHistory;
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = new Date(inputElement.value);
    this.selectedDateString = this.formatDateForInput(this.selectedDate);
  }

  onAttendanceRadioChange(userId: string, status: 'present' | 'absent' | 'excused'): void {
    this.attendanceState[userId].status = status as AttendanceStatus;
  }

  onCommentChange(userId: string, event: Event): void {
    const comment = (event.target as HTMLTextAreaElement).value;
    this.attendanceState[userId].comment = comment;
    alert('Comment added successfully')
  }

  onSaveAttendance(): void {
    if (!this.user) {
      alert('No user is logged in or user is not an instructor.');
      console.error('No user is logged in or user is not an instructor.');
      return;
    }
    this.students.forEach(student => {
      const state = this.attendanceState[student.id];
      if(state.status){
        const newRecord: Attendance = {
          id: this.generateUniqueId(),
          date: this.selectedDate,
          status: state.status, // Now TypeScript recognizes this as AttendanceStatus
          instructorId: this.user.id,
          userId: student.id,
          clubId: this.user.clubId,
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

  // New methods for editing and deleting attendance
  editAttendance(student: Student, record: Attendance): void {
    const newStatus = prompt('Enter new status (present, absent, excused):', record.status);
    const newComment = prompt('Enter new comment:', record.comments || '');
    if (newStatus && this.isValidStatus(newStatus)) {
      this.attendanceState[student.id].status = newStatus.toLowerCase() as AttendanceStatus;
      this.attendanceState[student.id].comment = newComment || '';
      record.status = newStatus.toLowerCase() as AttendanceStatus;
      record.comments = newComment || '';
      record.updatedAt = new Date();
      this.mockDataService.updateUsers([student]);
      alert('Attendance record updated successfully!');
    }
  }

  deleteAttendance(student: Student, record: Attendance): void {
    const confirmDelete = confirm('Are you sure you want to delete this attendance record?');
    if (confirmDelete) {
      student.attendance = student.attendance.filter(att => att.id !== record.id);
      this.mockDataService.updateUsers([student]);
      alert('Attendance record deleted successfully!');
    }
  }

  private isValidStatus(status: string): boolean {
    return ['present', 'absent', 'excused'].includes(status.toLowerCase());
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
