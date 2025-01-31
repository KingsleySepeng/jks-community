import {Component, OnInit} from '@angular/core';
import {Club} from '../model/club';
import {MockDataService} from '../mock-service/mock-data.service';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MockServiceService} from '../mock-service/mock-service.service';

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
  canEdit = false; // if only certain roles can edit

  constructor(
    private mockData: MockDataService,
    private mockService:MockServiceService
  ) {}

  ngOnInit(): void {
    // For example, the user belongs to a certain club
    const user = this.mockService.getLoggedInUser();
    if (user && user.clubId) {
      this.currentClub = this.mockData.getClubById(user.clubId);
    }
    // If user is an admin/instructor, allow edit
    this.canEdit = user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR';
  }

  onEditToggle() {
    if (this.canEdit) {
      this.isEditing = !this.isEditing;
    }
  }

  onSaveChanges() {
    if (!this.currentClub) return;
    this.mockData.updateClub(this.currentClub);
    this.isEditing = false;
  }
}
