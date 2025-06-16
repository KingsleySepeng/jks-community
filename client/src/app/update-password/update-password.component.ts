import { Component } from '@angular/core';
import {DataService} from '../services/DataService';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ServiceService} from '../services/service.service';
import {first} from 'rxjs';
import {User} from '../model/user';

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

  constructor(private serviceService: ServiceService) {}

  updatePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match.';
      this.isError = true;
      return;
    }

    this.serviceService.getUsers().pipe(first()).subscribe(users => {
      const user = users.find(u => u.email === this.email);

      if (!user) {
        this.message = 'User not found.';
        this.isError = true;
        return;
      }

      const updatedUser: User = { ...user, password: this.newPassword };
      this.serviceService.updateUser(updatedUser);

      this.message = 'Password updated successfully.';
      this.isError = false;

      // Clear fields
      this.email = '';
      this.newPassword = '';
      this.confirmPassword = '';
    });
  }
}
