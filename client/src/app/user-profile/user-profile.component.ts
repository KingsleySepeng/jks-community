import {Component, OnInit} from '@angular/core';
import {User} from '../model/user';
import {Belt} from '../model/belt';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ServiceService} from '../services/service.service';
import {first} from 'rxjs';

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
export class UserProfileComponent implements OnInit {
  currentUser?: User;
  isEditing = false;
  belts = Object.values(Belt);

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    // Fetch logged-in user and get updated details
    this.serviceService.getLoggedInUser().pipe(first()).subscribe(user => {
      if (user?.id) {
        this.serviceService.getUserById(user.id).pipe(first()).subscribe(fullUser => {
          this.currentUser = fullUser;
        });
      }
    });
  }

  onEditToggle(): void {
    this.isEditing = !this.isEditing;
  }

  onSaveChanges(): void {
    if (!this.currentUser) return;

    this.serviceService.updateUserProfile(this.currentUser).pipe(first()).subscribe({
      next: () => {
        this.isEditing = false;
        // Optionally show a success alert/toast
      },
      error: (err) => {
        console.error('Error updating user:', err);
        // Optionally show error alert
      }
    });
  }
}
