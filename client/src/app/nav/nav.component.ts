import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgForOf} from '@angular/common';
import { MockServiceService } from '../mock-service/mock-service.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NgForOf
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  menuOpen = false;
  appRoutes = [
    { path: '', name: 'Login' },
    { path: 'instructor-dash', name: 'Instructor Dashboard' },
    { path: 'admin-dash', name: 'Admin Dashboard' },
    { path: 'payment', name: 'Class Payment' },
    { path: 'instructor-payment', name: 'Instructor Payment' },
    { path: 'create-event', name: 'Create Event' },
    { path: 'event-list', name: 'Event List' },
    { path: 'grading-form', name: 'Grading Form' },
    { path: 'grading-report', name: 'Grading Report' },
    { path: 'grading-detail/:id', name: 'Grading Detail' },
    { path: 'user-profile', name: 'User Profile' },
    { path: 'club-profile', name: 'Club Profile' },
    { path: 'resource-upload', name: 'Upload Resource' },
    { path: 'resource-list', name: 'Resource List' },
  ];

  constructor(private mockService: MockServiceService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  isLoggedIn(): boolean {
    return !!this.mockService.getLoggedInUser();
  }

  logout() {
    this.mockService.logout();
  }

  getUserRole(): string {
    const user = this.mockService.getLoggedInUser();
    return user ? user.role : '';
  }

  shouldShowLink(route: { path: string, name: string }): boolean {
    const role = this.getUserRole();
    if (role === 'INSTRUCTOR' || role === 'ADMIN') {
      return route.path !== '' && route.path !== 'payment' && route.path !== 'club-profile';
    }
    return true;
  }
}
