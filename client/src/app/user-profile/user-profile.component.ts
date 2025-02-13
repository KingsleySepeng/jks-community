import {Component, OnInit} from '@angular/core';
import {User} from '../model/user';
import {Belt} from '../model/belt';
import {MockDataService} from '../mock-service/mock-data.service';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MockServiceService} from '../mock-service/mock-service.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgForOf
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent  implements OnInit {
  currentUser?: User;
  isEditing = false;
  belts = Object.values(Belt); // if Belt is an enum

  constructor(
    private mockData: MockDataService,
    private auth: MockServiceService
  ) {}

  ngOnInit(): void {
    // Retrieve current user ID from AuthService
    const userId = this.auth.getLoggedInUser().id;
    if (userId) {
      this.currentUser = this.mockData.getUserById(userId);
    }
  }

  onEditToggle() {
    this.isEditing = !this.isEditing;
  }

  onSaveChanges() {
    if (!this.currentUser) return;
    // Pass updated user to the service
    this.mockData.updateUser(this.currentUser);
    this.isEditing = false;
  }
}
