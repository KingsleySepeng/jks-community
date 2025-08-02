import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Club} from '../model/club';
import {User} from '../model/user';
import {Belt} from '../model/belt';
import {Role} from '../model/role';
import {first} from 'rxjs';
import {ServiceService} from '../services/service.service';

@Component({
  selector: 'app-add-club',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './add-club.component.html',
  styleUrl: './add-club.component.scss'
})
export class AddClubComponent implements OnInit {
  newClub: Partial<Club> = {};
  newInstructor: Partial<User> = {
    belt: Belt.BLACK,
    roles: [Role.INSTRUCTOR],
    active: true // ✅ renamed from isActive
  };

  clubs: Club[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.refreshClubList();
  }

  addClubAndInstructor(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    // ✅ Validation
    if (
      !this.newClub.name ||
      !this.newClub.address ||
      !this.newClub.contactNumber ||
      !this.newClub.description ||
      !this.newClub.establishedDate ||
      !this.newInstructor.firstName ||
      !this.newInstructor.lastName ||
      !this.newInstructor.email
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      this.loading = false;
      return;
    }

    // ✅ Convert date to ISO string (Spring expects full timestamp format)
    this.newClub.establishedDate = new Date(this.newClub.establishedDate).toISOString();

    this.serviceService.addClubWithInstructor(this.newClub, this.newInstructor).subscribe({
      next: () => {
        this.successMessage = 'Club and instructor created successfully!';

        // Reset forms
        this.newClub = {};
        this.newInstructor = {
          belt: Belt.BLACK,
          roles: [Role.INSTRUCTOR],
          active: true
        };

        // Refresh the club list
        this.refreshClubList();
      },
      error: (err) => {
        console.error('Failed to create club and instructor:', err);
        this.errorMessage = 'Failed to create club and instructor. Please try again.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


  removeClub(id: string): void {
    this.loading = true;
    this.serviceService.removeClub(id).subscribe({
      next: () => {
        this.successMessage = 'Club removed successfully!';
        this.refreshClubList();
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = 'Failed to remove club.';
      }
    });
  }

  private refreshClubList(): void {
    this.serviceService.getClubs().pipe(first()).subscribe(clubs => {
      this.clubs = clubs;
    });
  }
}
