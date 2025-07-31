import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Club} from '../model/club';
import {Instructor} from '../model/user';
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
  newInstructor: Partial<Instructor> = {
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

  addClub(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    if (
      !this.newClub.name ||
      !this.newClub.address ||
      !this.newInstructor.firstName ||
      !this.newInstructor.email
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      this.loading = false;
      return;
    }

    this.serviceService.addUser(this.newInstructor).subscribe({
      next: createdInstructor => {
        const club: Partial<Club> = {
          ...this.newClub,
          instructorId: createdInstructor.id,
        };

        this.serviceService.addClub(club).subscribe({
          next: createdClub => {
            const updatedInstructor = {
              ...createdInstructor,
              clubId: createdClub.id
            };

            this.serviceService.updateUser(updatedInstructor).subscribe({
              next: () => {
                this.successMessage = 'Club and instructor added successfully!';
                this.newClub = {};
                this.newInstructor = {
                  belt: Belt.BLACK,
                  roles: [Role.INSTRUCTOR],
                  active: true
                };
                this.refreshClubList();
                this.loading = false;
              },
              error: err => {
                this.loading = false;
                this.errorMessage = 'Failed to update instructor with club ID.';
              }
            });
          },
          error: err => {
            this.loading = false;
            this.errorMessage = 'Failed to create club.';
          }
        });
      },
      error: err => {
        this.loading = false;
        this.errorMessage = 'Failed to create instructor.';
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
