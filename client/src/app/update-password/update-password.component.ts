import { Component } from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ServiceService} from '../services/service.service';

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
      this.setMessage('Passwords do not match.', true);
      return;
    }

    const result = this.serviceService.updatePasswordByEmail(this.email, this.newPassword);
    // this.setMessage(result.message, !result.success);
    //
    // if (result.success) {
    //   this.email = '';
    //   this.newPassword = '';
    //   this.confirmPassword = '';
    // }
  }

  private setMessage(message: string, isError: boolean): void {
    this.message = message;
    this.isError = isError;
  }
}
