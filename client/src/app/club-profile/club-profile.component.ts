import {Component, OnInit} from '@angular/core';
import {Club} from '../model/club';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Role} from '../model/role';
import {MockDataService} from '../mock-service/mock-data.service';

@Component({
  selector: 'app-club-profile',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './club-profile.component.html',
  styleUrl: './club-profile.component.scss'
})
export class ClubProfileComponent implements OnInit {
  currentClub?: Club;
  isEditing = false;
  canEdit: boolean | undefined = false;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    // Get logged-in user
    const user = this.mockDataService.getLoggedInUser();
    if (user?.clubId) {
      this.currentClub = this.mockDataService.getClubById(user.clubId);
    }

    // Only Admins & Instructors can edit
    this.canEdit = user?.roles.includes(Role.INSTRUCTOR);
  }

  onEditToggle() {
    if (this.canEdit) {
      this.isEditing = !this.isEditing;
    }
  }

  onSaveChanges() {
    if (!this.currentClub) return;
    this.mockDataService.updateClub(this.currentClub);
    this.isEditing = false;
  }
}
