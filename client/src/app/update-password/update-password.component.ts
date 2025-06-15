import { Component } from '@angular/core';
import {DataService} from '../services/DataService';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MockDataService} from '../mock-service/mock-data.service';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    NgIf
  ],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss'
})
export class UpdatePasswordComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(private dataService: MockDataService) {}

  updatePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match.';
      this.isError = true;
      return;
    }

    const user = this.dataService.getUsers().find(u => u.email === this.email);
    if (!user) {
      this.message = 'User not found.';
      this.isError = true;
      return;
    }

    user.password = this.newPassword;
    this.dataService.updateUser(user);

    this.message = 'Password updated successfully.';
    this.isError = false;

    // Clear fields
    this.email = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
