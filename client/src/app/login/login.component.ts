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
import {catchError, finalize, Observable, of, tap} from 'rxjs';
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
      password: ['', [Validators.required]],
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
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.serviceService.authenticateUser(email, password).pipe(
      tap(user => {
        if (!user) {
          this.errorMessage = 'Invalid credentials. Please try again.';
          return;
        }

        // 🎯 Redirect based on role
        if (user.roles.includes(Role.SYSTEM_ADMIN)) {
          this.router.navigate(['/add-club']);
        } else if (user.roles.includes(Role.INSTRUCTOR) || user.roles.includes(Role.SUB_INSTRUCTOR)) {
          this.router.navigate(['/attendance-tracker']);
        } else if (user.roles.includes(Role.STUDENT)) {
          this.router.navigate(['/resource-list']);
        } else {
          this.router.navigate(['/']);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        this.errorMessage = 'Login failed. Please check your credentials or try again later.';
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
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
