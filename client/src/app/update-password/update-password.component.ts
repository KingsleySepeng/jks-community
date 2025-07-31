import { Component } from '@angular/core';
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
  email = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  isError = false;
  isLoading = false;

  constructor(private serviceService: ServiceService) {
  }

  updatePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.setMessage('Passwords do not match.', true);
      return;
    }

    this.isLoading = true;

    this.serviceService.getUserByEmail(this.email)
      .pipe(first())
      .subscribe({
        next: (user) => {
          const updatedUser: Partial<User> = {
            id: user.id,
            password: this.newPassword,
          };

          this.serviceService.updateUser(updatedUser)
            .pipe(first())
            .subscribe({
              next: () => {
                this.setMessage('Password updated successfully.', false);
                this.email = '';
                this.newPassword = '';
                this.confirmPassword = '';
              },
              error: () => {
                this.setMessage('Failed to update password.', true);
              },
              complete: () => this.isLoading = false,
            });
        },
        error: () => {
          this.setMessage('User not found with this email.', true);
          this.isLoading = false;
        }
      });
  }


  private setMessage(msg: string, error: boolean): void {
    this.message = msg;
    this.isError = error;
  }
}
