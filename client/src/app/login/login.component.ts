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
  errorMessage: string = '';
  loggedInUser?: User;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private mockDataService: MockDataService
  ) {}

  ngOnInit(): void {
    // Build the form with validation rules.
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    // Check if a user is already logged in (for demo/testing).
    this.loggedInUser = this.mockDataService.getLoggedInUser();
    // Optionally pre-populate email if stored in localStorage.
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.loginForm.patchValue({ email: rememberedEmail });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.loginForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    this.isLoading = true;
    const {email, password, rememberMe} = this.loginForm.value;

    // Clear previous error messages.
    this.errorMessage = '';

    // Simulate authentication (replace with real auth in production).
    const user: User | null = this.mockDataService.authenticate(email, password);
    this.isLoading = false;

    if (user) {
      console.log(`Logged in as ${user.firstName} ${user.lastName}`);
      this.loggedInUser = user;
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Navigate based on role.
      if (user.role === Role.INSTRUCTOR) {
        this.router.navigate(['/instructor-dashboard']);
      }
        // else if (user.role === Role.ADMIN) {
        //   this.router.navigate(['/admin-dashboard']);
        // } else {
        //   this.router.navigate(['/student-dashboard']);
      // }
      else {
        console.log('Login failed: invalid credentials');
        // Set an inline error message.
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
    }
  }

  logout(): void {
    this.mockDataService.logout();
    this.loggedInUser = undefined;
    this.router.navigate(['/']);
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    // Placeholder for forgot password functionality.
    alert('Forgot Password functionality is not implemented yet.');
  }
}
