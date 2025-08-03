import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { User} from '../model/user';
import {Role} from '../model/role';
import {Belt} from '../model/belt';
import {NgForOf, NgIf} from '@angular/common';
import {ServiceService} from '../services/service.service';
import {finalize, first, of, switchMap, tap} from 'rxjs';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit {
  belts = Object.values(Belt);
  user: User = this.getEmptyUser();
  clubStudents: User[] = [];
  currentInstructor?: User;
  isLoading = false;
  errorMessage = '';
  activeStudents: User[] = [];
  inactiveStudents: User[] = [];
  constructor(private serviceService: ServiceService) {}


  ngOnInit(): void {
    this.isLoading = true;

    this.serviceService.getLoggedInUser().pipe(
      first(),
      switchMap(user => {
        console.log('Logged in user:', user);
        console.log('User roles:', user?.roles);
        console.log('User club ID:', user?.clubId);
        if (!user?.roles.includes(Role.INSTRUCTOR) || !user.clubId) {
          this.errorMessage = 'User is not a valid instructor or has no club';
          return of(null);
        }
        this.currentInstructor = user;
        return this.serviceService.getUsersByClub(user.clubId).pipe(
          first(),
          tap(students => {
            this.clubStudents = (students || []).filter(u => u.roles.includes(Role.STUDENT) || u.roles.includes(Role.SUB_INSTRUCTOR)) as User[];
            this.activeStudents = this.clubStudents.filter(s => s.active);
            this.inactiveStudents = this.clubStudents.filter(s => !s.active);
          }));
      }),
      finalize(() => this.isLoading = false)
    ).subscribe({
      error: (error) => {
        console.error("Failed to load club students",error);
        this.errorMessage = 'Failed to load instructor or club data';
      }
    });

  }


addStudent(): void {
    this.isLoading = true;
    const newStudent: User = {
      ...this.user,
    clubId: this.currentInstructor?.clubId || '',
    };
  console.log('Adding new student:', newStudent);
    this.serviceService.addUser(newStudent).pipe(first()).subscribe({
      next: () => {
        this.user = this.getEmptyUser();
        this.loadClubStudents(this.currentInstructor!.clubId);
      },
      error: () => (this.errorMessage = 'Failed to add student'),
      complete: () => (this.isLoading = false),
    });
  }

  removeStudent(studentId: string): void {
    if (!confirm('Are you sure you want to remove this student?')) return;

    this.serviceService.removeUser(studentId).pipe(first()).subscribe({
      next: () => {
        if (this.currentInstructor?.clubId) {
          this.loadClubStudents(this.currentInstructor.clubId);
        } else {
          this.errorMessage = 'Club ID is undefined';
        }
      },
      error: () => (this.errorMessage = 'Failed to remove student'),
    });
  }

  toggleSubInstructor(user: User): void {
    const isSubInstructor = user.roles.includes(Role.SUB_INSTRUCTOR);
    const confirmText = isSubInstructor
      ? 'Demote this user to Student?'
      : 'Promote this user to Sub-Instructor?';

    if (!confirm(confirmText)) return;

    // 🔁 Toggle the role before sending to backend
    if (isSubInstructor) {
      user.roles = user.roles.filter(role => role !== Role.SUB_INSTRUCTOR);
    } else {
      user.roles.push(Role.SUB_INSTRUCTOR);
    }

    this.serviceService.updateUserProfile(user).pipe(first()).subscribe({
      next: () => this.loadClubStudents(this.currentInstructor!.clubId),
      error: () => (this.errorMessage = 'Failed to toggle role'),
    });
  }


  private loadClubStudents(clubId: string): void {
    this.serviceService.getUsersByClub(clubId).pipe(first()).subscribe({
      next: (students: User[]) => {
        this.clubStudents = students.filter(u => u.roles.includes(Role.STUDENT)) as User[];
      },
      error: () => (this.errorMessage = 'Error loading student list'),
    });
  }


  private getEmptyUser(): User {
    return {
      id: '',
      memberId: '',
      firstName: '',
      lastName: '',
      email: '',
      profileImageUrl: '',
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

  activateStudent(id: string) {
    this.serviceService.activateStudent(id).pipe(first()).subscribe({
      next: () => {
        this.loadClubStudents(this.currentInstructor!.clubId);
      },
      error: () => (this.errorMessage = 'Failed to activate student'),
    });
  }
}
