import {Component, OnInit} from '@angular/core';
import { MockServiceService } from '../mock-service/mock-service.service';
import { User } from '../model/user';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'; // <-- Import FormsModule
import { Role } from '../model/role';
import {Belt} from '../model/belt';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false; // Add this line
  isLoading = false; // Add this line
  // Add a method to toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
user: User | undefined;

 constructor (private fb: FormBuilder,private mockService:MockServiceService,private router: Router){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }
 login():void{
   if (this.loginForm.valid) {
     this.isLoading = true; // Set loading to true
     const { email, password, rememberMe } = this.loginForm.value;
     const user: {
       id: string;
       memberId: string;
       email: any;
       password: any;
       firstName: string;
       lastName: string;
       clubId: string;
       belt: Belt;
       role: any;
       isActive: boolean;
       attendance: any[]
     } = {
       id: '', // You can set this to an empty string or any default value
       memberId: '', // You can set this to an empty string or any default value
       email: email,
       password: password,
       firstName: '', // You can set this to an empty string or any default value
       lastName: '', // You can set this to an empty string or any default value
       clubId: '', // You can set this to an empty string or any default value
       belt: Belt.WHITE, // You can set this to a default value
       role: Role.INSTRUCTOR, // You can set this to a default value
       isActive: true, // You can set this to a default value
       attendance: [] // You can set this to an empty array or any default value
     };
     const loggedInUser = this.mockService.login(user);
     this.isLoading = false;

     if (loggedInUser) {
       console.log(`Logged in as ${loggedInUser.firstName} ${loggedInUser.lastName}`);
       if (rememberMe) {
         // Implement remember me functionality
       }
       this.router.navigate(['/instructor-dash']); // Navigate to instructor-dash

     } else {
       console.log('Login failed');
     }
   } else {
     console.log('Form is invalid');
   }
 }

 logout():void{
  this.mockService.logout();
 }
}
