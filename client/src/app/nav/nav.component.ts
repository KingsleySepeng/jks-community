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
  loggedInUser?: User;
  userProfileLabel: string = 'User Profile';
  clubProfileLabel: string = 'Club Profile';

  // Routes now only include roles for logged-in users
  appRoutes = [
    { path: 'instructor-dash', name: 'Instructor Dashboard', roles: [Role.INSTRUCTOR] },
    { path: 'admin-dash', name: 'Admin Dashboard', roles: [Role.ADMIN] },
    { path: 'payment', name: 'Class Payment', roles: [Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'add-user', name: 'Add New User', roles: [Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'create-event', name: 'Create Event', roles: [Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'event-list', name: 'Event List', roles: [Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'grading-form', name: 'Grading Form', roles: [Role.INSTRUCTOR] },
    { path: 'grading-report', name: 'Grading Report', roles: [Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'grading-detail/:id', name: 'Grading Detail', roles: [Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'resource-upload', name: 'Upload Resource', roles: [Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'resource-list', name: 'Resource List', roles: [Role.INSTRUCTOR, Role.ADMIN, Role.STUDENT] },
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
