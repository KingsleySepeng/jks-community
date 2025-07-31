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
export class AddUserComponent implements OnInit {
  belts = Object.values(Belt);
  user: Student = this.getEmptyUser();
  clubStudents: Student[] = [];
  currentInstructor?: User;
  isLoading = false;
  errorMessage = '';

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.serviceService.getLoggedInUser().pipe(first()).subscribe({
      next: (user) => {
        if (user?.roles.includes(Role.INSTRUCTOR)) {
          this.currentInstructor = user;
          const clubId = user.club?.id;
          if (clubId) {
            this.serviceService.getClubById(clubId).pipe(first()).subscribe({
              next: (club) => {
                if (club) {
                  this.currentInstructor!.club = { id: club.id };
                  this.loadClubStudents(club.id);
                }
              },
              error: () => (this.errorMessage = 'Error loading club data'),
              complete: () => (this.isLoading = false),
            });
          }
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load instructor info';
        this.isLoading = false;
      },
    });
  }

  addStudent(): void {
    if (!this.currentInstructor?.club?.id) {
      this.errorMessage = 'Instructor or Club not fully loaded.';
      return;
    }

    this.isLoading = true;
    const newStudent: Student = {
      ...this.user,
      club: { id: this.currentInstructor.club.id },
      roles: [Role.STUDENT],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attendance: [],
    };

    this.serviceService.addUser(newStudent).pipe(first()).subscribe({
      next: () => {
        this.user = this.getEmptyUser();
        this.loadClubStudents(this.currentInstructor!.club!.id);
      },
      error: () => (this.errorMessage = 'Failed to add student'),
      complete: () => (this.isLoading = false),
    });
  }

  removeStudent(studentId: string): void {
    if (!confirm('Are you sure you want to remove this student?')) return;

    this.serviceService.removeUser(studentId).pipe(first()).subscribe({
      next: () => this.loadClubStudents(this.currentInstructor!.club!.id),
      error: () => (this.errorMessage = 'Failed to remove student'),
    });
  }

  toggleSubInstructor(user: User): void {
    const confirmText = user.roles.includes(Role.SUB_INSTRUCTOR)
      ? 'Demote this user to Student?'
      : 'Promote this user to Sub-Instructor?';

    if (!confirm(confirmText)) return;

    this.serviceService.toggleSubInstructorRole(user).pipe(first()).subscribe({
      next: () => this.loadClubStudents(this.currentInstructor!.club!.id),
      error: () => (this.errorMessage = 'Failed to toggle role'),
    });
  }

  private loadClubStudents(clubId: string): void {
    this.serviceService.getUsersByClub(clubId).pipe(first()).subscribe({
      next: (students: User[]) => {
        this.clubStudents = students.filter(u => u.roles.includes(Role.STUDENT)) as Student[];
      },
      error: () => (this.errorMessage = 'Error loading student list'),
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
      club: { id: '' },
      clubId:'',
      belt: Belt.WHITE,
      roles: [],
      password: 'karate',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attendance: [],
    };
  }

  protected readonly Role = Role;
}
