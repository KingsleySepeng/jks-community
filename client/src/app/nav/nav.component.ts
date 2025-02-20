import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MockDataService} from '../mock-service/mock-data.service';
import { Role } from '../model/role';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  menuOpen = false;

  // Add a "roles" array to each route. This controls which roles can see the link.
  // Use a special "GUEST" role for users who are not logged in.
  appRoutes = [
    { path: '', name: 'Login', roles: [Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'instructor-dash', name: 'Instructor Dashboard', roles: [Role.INSTRUCTOR] },
    { path: 'admin-dash', name: 'Admin Dashboard', roles: [Role.ADMIN] },
    { path: 'payment', name: 'Class Payment', roles: [Role.STUDENT] },
    { path: 'instructor-payment', name: 'Instructor Payment', roles: [Role.INSTRUCTOR] },
    { path: 'create-event', name: 'Create Event', roles: [Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'event-list', name: 'Event List', roles: [Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'grading-form', name: 'Grading Form', roles: [Role.INSTRUCTOR] },
    { path: 'grading-report', name: 'Grading Report', roles: [Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'grading-detail/:id', name: 'Grading Detail', roles: [Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'user-profile', name: 'User Profile', roles: [Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'club-profile', name: 'Club Profile', roles: [Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'resource-upload', name: 'Upload Resource', roles: [Role.INSTRUCTOR, Role.ADMIN] },
    { path: 'resource-list', name: 'Resource List', roles: [Role.INSTRUCTOR, Role.ADMIN, Role.STUDENT] },
  ];

  constructor(private mockDataService: MockDataService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  isLoggedIn(): boolean {
    return !!this.mockDataService.getLoggedInUser();
  }

  getUserRole(): Role | null {
    const user = this.mockDataService.getLoggedInUser();
    return user ? user.role : null;
  }

  // Check if the user's role is in the route's "roles" array
  canAccess(routeRoles: Role[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false; // no user => can't access
    return routeRoles.includes(userRole);
  }

  logout() {
    this.mockDataService.logout();
  }
}
