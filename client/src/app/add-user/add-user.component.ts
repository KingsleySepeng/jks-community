import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Student, User} from '../model/user';
import {Role} from '../model/role';
import {Belt} from '../model/belt';
import {NgForOf} from '@angular/common';
import {MockDataService} from '../mock-service/mock-data.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit{

  // Arrays for select dropdowns.
  belts = Object.values(Belt);

  // Local user object for adding a new student.
  user: Student = {
    id: '',
    memberId: '',
    firstName: '',
    lastName: '',
    email: '',
    profileImageUrl: '',
    clubId: '',  // To be set based on logged-in instructor's club
    belt: Belt.WHITE,
    role: Role.STUDENT,   // Ensures we create a student
    password: 'karate',   // Default password; adjust as needed
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    attendance: [],
  };

  clubStudents: Student[] = []; // List of students in the instructor's club

  constructor(private mockData: MockDataService) {}

  ngOnInit(): void {
    // Assume the logged-in user is an instructor.
    const loggedInUser = this.mockData.getLoggedInUser();
    if (loggedInUser && loggedInUser.role === Role.INSTRUCTOR) {
      // Set the clubId for new student from the logged-in instructor.
      this.user.clubId = loggedInUser.clubId;
      // Populate the list of students in the instructor's club.
      this.clubStudents = this.mockData.getUsers().filter(u => u.role === Role.STUDENT && u.clubId === loggedInUser.clubId) as Student[];
    }
  }

  addStudent(): void {
    // Generate unique IDs for the new student.
    this.user.id = 'S' + Math.floor(Math.random() * 1000);
    this.user.memberId = 'M' + Math.floor(Math.random() * 1000);
    // Set clubId from logged-in instructor.
    this.user.clubId = this.mockData.getLoggedInUser()?.clubId || '';

    // Add the student to the service.
    this.mockData.addUser(this.user);
    // Update the club student list.
    this.updateClubStudents();

    console.log(`Added student: ${this.user.firstName} ${this.user.lastName} to club ${this.user.clubId}`);
    // Optionally, reset the form:
    this.user = {
      ...this.user,
      id: '',
      memberId: '',
      firstName: '',
      lastName: '',
      email: '',
      belt: Belt.WHITE,
    };
  }

  removeStudent(studentId: string): void {
    // Remove the student using the service.
    this.mockData.removeUser(studentId);
    // Update the local list.
    this.updateClubStudents();
  }

  private updateClubStudents(): void {
    const loggedInUser = this.mockData.getLoggedInUser();
    if (loggedInUser) {
      this.clubStudents = this.mockData.getUsers().filter(u => u.role === Role.STUDENT && u.clubId === loggedInUser.clubId) as Student[];
    }
  }
}
