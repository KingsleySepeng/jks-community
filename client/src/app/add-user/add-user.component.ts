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
          if (user.club?.id) {
          this.serviceService.getClubById(user.club.id).pipe(first()).subscribe(club => {
              if (club) {
            this.currentInstructor!.club = {id: club.id};
              }
          });
          }
    }});
    }

  addStudent(): void {
    if (!this.currentInstructor || !this.currentInstructor.club?.id) {
      console.error('Instructor or club ID is missing.'); //TODO: THIS IS ALWAYS TRU
      return;
    }

    const newStudent: Student = {
      ...this.user,
      club: { id: this.currentInstructor.club.id }, // Ensure ID is set
      roles: [Role.STUDENT],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.serviceService.addUser(newStudent).pipe(first()).subscribe({
      next: (student) => {
        console.log('Student added:', student);
        this.user = this.getEmptyUser(); // Reset form
      },
      error: (err) => console.error('Error adding student:', err)
    });

    this.serviceService.addUser(newStudent);
    this.user = this.getEmptyUser(); // Reset form
  }

  removeStudent(studentId: string): void {
    this.serviceService.removeUser(studentId);
    if (this.currentInstructor) {
      // this.loadClubStudents(this.currentInstructor.club.id);
    }
  }

  toggleSubInstructor(user: User): void {
    this.serviceService.toggleSubInstructorRole(user);
    // this.loadClubStudents(user.club.id);
  }


  private getEmptyUser(): Student {
    return {
      id: '',
      memberId: '',
      firstName: '',
      lastName: '',
      email: '',
      profileImageUrl: '',
      club: { id: '' }, // Initialize with empty club
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
