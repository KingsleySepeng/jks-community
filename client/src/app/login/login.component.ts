import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Role } from '../model/role';
import { Belt } from '../model/belt';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MockDataService } from '../mock-service/mock-data.service';
import {Observable, tap} from 'rxjs';
import {ServiceService} from '../services/service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  loggedInUser$!: Observable<User | undefined>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.loggedInUser$ = this.serviceService.getLoggedInUser();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.serviceService.authenticateUser(email, password).pipe(
      tap(user => {
        this.isLoading = false;

        if (user) {
          const isInstructor = user.roles.includes(Role.INSTRUCTOR) || user.roles.includes(Role.SUB_INSTRUCTOR);
          if( user.roles.includes(Role.SYSTEM_ADMIN)) {
            this.router.navigate(['/add-club']);
          }
          if( user.roles.includes(Role.STUDENT)) {
            this.router.navigate(['/resource-list']);
          }
          if (isInstructor) {
            this.router.navigate(['/attendance-tracker']);
          } else {
            this.router.navigate(['/resource-list']);
          }
        } else {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      })
    ).subscribe();
  }

  logout(): void {
    this.serviceService.logout();
    this.router.navigate(['/']);
  }

  onForgotPassword(): void {
    this.router.navigate(['/update-password']);
  }
}
