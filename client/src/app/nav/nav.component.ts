import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { MockDataService } from '../mock-service/mock-data.service';
import { Role } from '../model/role';
import { User } from '../model/user';
import { Club } from '../model/club';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NgForOf,
    NgIf,
    NgClass,
  ],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  menuOpen = false;
  loggedInUser?: User; //TODO: CREATE SUBJECT BEHAVIOUR FOR LOGGED IN USER SO THAT LABELS CAN BE UPDATED AUTOMATICALLY
  userProfileLabel: string = 'User Profile';
  clubProfileLabel: string = 'Club Profile';

  // Routes now only include roles for logged-in users
  appRoutes = [
    { path: 'attendance-tracker', name: 'Track Attendance', roles: [Role.SUBINSTRUCTOR, Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'add-user', name: 'Manage Students', roles: [Role.SUBINSTRUCTOR, Role.INSTRUCTOR, Role.ADMIN] },
    {path: 'upload-resource', name: 'Upload Resources',roles:  [Role.SUBINSTRUCTOR, Role.INSTRUCTOR, Role.ADMIN] },
    {path: ' resource-list', name: 'View Resources',roles:  [Role.SUBINSTRUCTOR, Role.INSTRUCTOR, Role.ADMIN]},
  ];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.updateNavLabels();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  isLoggedIn(): boolean {
    return !!this.mockDataService.getLoggedInUser();
  }

  getUserRole(): Role | null {
    const user = this.mockDataService.getLoggedInUser();
    return user ? user.role : null;
  }

  // Only display a route if the user is logged in and has the appropriate role.
  canAccess(routeRoles: any[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) {
      return false;
    }
    return routeRoles.includes(userRole);
  }

  logout(): void {
    this.mockDataService.logout();
  }

  updateNavLabels(): void {
    this.loggedInUser = this.mockDataService.getLoggedInUser();

    if (this.loggedInUser) {
      // Update User Profile Label
      this.userProfileLabel = `${this.loggedInUser.firstName}'s Profile`;

      // Fetch Club Details and Update Label
      const userClub: Club | undefined = this.mockDataService.getClubById(this.loggedInUser.clubId);
      if (userClub) {
        this.clubProfileLabel = `${userClub.name} Club`;
      }
    }
  }
}
