import {Component, OnInit} from '@angular/core';
import { User } from '../model/user';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'; // <-- Import FormsModule
import { Role } from '../model/role';
import {Belt} from '../model/belt';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {MockDataService} from '../mock-service/mock-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private mockDataService:MockDataService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
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
    const { email, password, rememberMe } = this.loginForm.value;

    // Call a dedicated authenticate method from mockService
    const user: User | null = this.mockDataService.authenticate(email, password);
    this.isLoading = false;

    if (user) {
      console.log(`Logged in as ${user.firstName} ${user.lastName}`);
      if (rememberMe) {
        // Example: store user email in localStorage for next visit
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Navigate based on role (optional)
      if (user.role === Role.INSTRUCTOR) {
        this.router.navigate(['/instructor-dash']);
      } else if (user.role === Role.ADMIN) {
        this.router.navigate(['/admin-dash']);
      } else {
        // fallback for students
        this.router.navigate(['/student-dash']);
      }
    } else {
      console.log('Login failed: invalid credentials');
      alert('Invalid credentials. Please try again.');
      // Optionally show an error message or set a form error
    }
  }

  logout(): void {
    this.mockDataService.logout();
    this.router.navigate(['/']);
  }
}
