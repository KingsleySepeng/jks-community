import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Student, User} from '../model/user';
import {Role} from '../model/role';
import {Belt} from '../model/belt';
import {NgForOf} from '@angular/common';
import {ServiceService} from '../services/service.service';
import {first} from 'rxjs';

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
  belts = Object.values(Belt);
  user: Student = this.getEmptyUser();
  clubStudents: Student[] = [];
  currentInstructor?: User;

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.serviceService.getLoggedInUser().pipe(first()).subscribe(user => {
      if (user && user.roles.includes(Role.INSTRUCTOR)) {
        this.currentInstructor = user;
        this.user.clubId = user.clubId;
        this.loadClubStudents(user.clubId);
      }
    });
  }

  addStudent(): void {
    if (!this.currentInstructor) return;

    const newStudent: Student = {
      ...this.user,
      // id: this.serviceService.generateStudentId(),
      // memberId: this.serviceService.generateMemberId(),
      clubId: this.currentInstructor.clubId,
      roles: [Role.STUDENT],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.serviceService.addUser(newStudent);
    this.user = this.getEmptyUser(); // Reset form
    this.loadClubStudents(this.currentInstructor.clubId);
  }

  removeStudent(studentId: string): void {
    this.serviceService.removeUser(studentId);
    if (this.currentInstructor) {
      this.loadClubStudents(this.currentInstructor.clubId);
    }
  }

  toggleSubInstructor(user: User): void {
    this.serviceService.toggleSubInstructorRole(user);
    this.loadClubStudents(user.clubId);
  }

  private loadClubStudents(clubId: string): void {
    this.serviceService.getStudentsByClub(clubId).pipe(first()).subscribe((students: User[]) => {
      this.clubStudents = (students as Student[]).filter((student: Student) => student.roles.includes(Role.STUDENT));
    });
  }

  private getEmptyUser(): Student {
    return {
      id: '',
      memberId: '',
      firstName: '',
      lastName: '',
      email: '',
      profileImageUrl: '',
      clubId: '',
      belt: Belt.WHITE,
      roles: [],
      password: 'karate',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      attendance: []
    };
  }

  protected readonly Role = Role;
}
