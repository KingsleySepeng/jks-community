import {Component, OnInit} from '@angular/core';
import {User} from '../model/user';
import {Belt} from '../model/belt';
import {MockDataService} from '../mock-service/mock-data.service';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

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
    private mockDataService: MockDataService,
  ) {}

  ngOnInit(): void {

    const userId = this.mockDataService.getLoggedInUser()?.id;
    if (userId) {
      this.currentUser = this.mockDataService.getUserById(userId);
    }
  }

  onEditToggle() {
    this.isEditing = !this.isEditing;
  }

  onSaveChanges() {
    if (!this.currentUser) return;
    // Pass updated user to the service
    this.mockDataService.updateUser(this.currentUser);
    this.isEditing = false;
  }
}
