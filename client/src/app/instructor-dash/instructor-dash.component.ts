import { Component } from '@angular/core';
import { User } from '../model/user';
import { MockServiceService } from '../mock-service/mock-service.service';
import { Role } from '../model/role';
import { CommonModule } from '@angular/common';
import { Attendence } from '../model/attendence';
import { MockDataService } from '../mock-service/mock-data.service';
import {Belt} from '../model/belt';

@Component({
  selector: 'app-instructor-dash',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './instructor-dash.component.html',
  styleUrl: './instructor-dash.component.scss'
})
export class InstructorDashComponent {
students: User[] = [];
user: User = {
  email: 'king@gmail.com',
  password: 'king',
  firstName: '',
  lastName: '',
  id: '0',
  memberId: '',
  clubId:'',
  belt:Belt.WHITE,
  role: Role.USER,
  isActive: false,
  attendance: [],
}

attendanceState:{
  [userId:string]:{
    showHistory: boolean;
    status: 'present' | 'absent' | 'excused'|'';
    comment:string;
  };
}= {};

selectedDate:Date = new Date(Date.now());
selectedDateString = this.formatDateForInput(this.selectedDate);
constructor(private mockService:MockServiceService,private mockDataService:MockDataService){

}

ngOnInit() {
  debugger;
  const loggedInUser = this.mockService.login(this.user);
  if(loggedInUser && loggedInUser.role === Role.INSTRUCTOR){
    this.students = this.mockDataService.getUsers().filter(u=>u.clubId && u.role == Role.STUDENT);
}else{
    this.students = [];
  }
  this.initializeAttendanceState();
}

  private initializeAttendanceState() {
    this.students.forEach((student) => {
    if(!this.attendanceState[student.id]){
    this.attendanceState[student.id] = {
      showHistory: false,
      status: '',
      comment: '',
    };
  }
  });
  }

toggleHistory(userId:string):void{
  const state = this.attendanceState[userId];
state.showHistory = !state.showHistory;
}


private formatDateForInput(date:Date):string{
  return date.toISOString().split('T')[0];
}

onDateChange(event:Event):void{
  const inputElement = event.target as HTMLInputElement;
  this.selectedDate = new Date(inputElement.value);
}

  onAttendanceRadioChange(userId:string,status:'present'|'absent'):void{
    this.attendanceState[userId].status = status;
  }
  onCommentChange(userId:string,event:Event):void{
    const comment = (event.target as HTMLTextAreaElement).value;
    this.attendanceState[userId].comment = comment;
}

onSaveAttendance():void{
  debugger;
  this.students.forEach(student =>{
    const state = this.attendanceState[student.id];
    if(state.status){
      const newRecord:Attendence={
        date: this.selectedDate,
        status: state.status,
        instructorId: this.user.id,
        comments: state.comment
      };
      student.attendance.push(newRecord);
      console.log('Student attendance after save:', student.firstName, student.attendance);
    }
    this.mockDataService.updateUsers(this.students);
});
}
}
