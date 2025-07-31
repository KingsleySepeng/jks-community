import {Component, OnInit} from '@angular/core';
import {Club} from '../model/club';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Role} from '../model/role';
import {MockDataService} from '../mock-service/mock-data.service';
import {ServiceService} from '../services/service.service';
import {first} from 'rxjs';

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
  canEdit = false;

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.serviceService.getLoggedInUser().pipe(first()).subscribe(user => {
      if (user?.club?.id) {
        this.canEdit = user.roles.includes(Role.INSTRUCTOR) || user.roles.includes(Role.SYSTEM_ADMIN);

        this.serviceService.getClubById(user.club.id).pipe(first()).subscribe(club => {
          this.currentClub = club;
        });
      }
    });
  }

  onEditToggle(): void {
    if (this.canEdit) {
      this.isEditing = !this.isEditing;
    }
  }

  onSaveChanges(): void {
    if (!this.currentClub) return;

    this.serviceService.updateClub(this.currentClub).pipe(first()).subscribe({
      next: () => {
        this.isEditing = false;
        // Optionally show a success toast/modal
      },
      error: err => {
        console.error('Failed to update club:', err);
        // Optionally show an error alert
      }
    });
  }
}
