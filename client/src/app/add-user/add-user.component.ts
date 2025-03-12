import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Student, User} from '../model/user';
import {Role} from '../model/role';
import {Belt} from '../model/belt';
import {NgForOf} from '@angular/common';
import {Rank} from '../model/rank';
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
export class AddUserComponent {


  // Arrays for the select dropdowns
  belts = Object.values(Belt);
  ranks = Object.values(Rank);

  // Local user object.
  // Pre-fill basic defaults (role=STUDENT, isActive=true, etc.).
  user: Student = {
    id: '',
    memberId: '',
    firstName: '',
    lastName: '',
    email: '',
    profileImageUrl:'',
    clubId: '', //TODO: ADD CLUB THE USER JOINED - DROP DOWN OF CLUBS OR ABLE TO REGISTER CLUB
    belt: Belt.WHITE,
    role: Role.STUDENT,   // Ensures we create a student
    password: 'karate',   // Default password or blank
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    attendance: [],
    rank: Rank.JUNIOR    // Or use an appropriate rank for students
  };

  constructor(private mockData: MockDataService) {}

  ngOnInit(): void {
    // Any init logic, if needed
  }

  addStudent(): void {
    // For a real app, you'd probably generate a unique ID & memberId.
    // For now, just do something simple:
    this.user.id = 'S' + Math.floor(Math.random() * 1000);
    this.user.memberId = 'M' + Math.floor(Math.random() * 1000);

    // Add to the mock data
    this.mockData.addUser(this.user);

    console.log(`Added student: ${this.user.firstName} ${this.user.lastName}`);

    // Optionally reset the form
    this.user = {
      ...this.user,
      id: '',
      memberId: '',
      firstName: '',
      lastName: '',
      email: '',
      belt: Belt.WHITE,
      rank: Rank.JUNIOR
    };
  }
}
