import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { Role } from '../model/role';
import { User } from '../model/user';
import {ServiceService} from '../services/service.service';

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
    { path: 'attendance-tracker', name: 'Track Attendance', roles: [Role.SUB_INSTRUCTOR, Role.INSTRUCTOR, Role.SYSTEM_ADMIN] },
    { path: 'add-user', name: 'Manage Students', roles: [Role.SUB_INSTRUCTOR, Role.INSTRUCTOR, Role.SYSTEM_ADMIN] },
    {path: 'upload-resource', name: 'Upload Resources',roles:  [Role.SUB_INSTRUCTOR, Role.INSTRUCTOR, Role.SYSTEM_ADMIN] },
    {path: 'resource-list', name: 'View Resources',roles:  [Role.SUB_INSTRUCTOR, Role.INSTRUCTOR, Role.SYSTEM_ADMIN]},
    {path: 'add-club', name: 'Add Club',roles:  [Role.SUB_INSTRUCTOR, Role.INSTRUCTOR, Role.SYSTEM_ADMIN]},
  ];

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.serviceService.getLoggedInUser().subscribe(user => {
      this.loggedInUser = user;
      this.updateNavLabels();
    });
  }


  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  isLoggedIn(): boolean {
    return !!this.loggedInUser;
  }

  // Only display a route if the user is logged in and has the appropriate role.
  canAccess(routeRoles: Role[]): boolean {
    const user = this.serviceService.getLoggedInUserValue(); // Use the `.value` version
    if (!user) return false;
    return routeRoles.some(role => user.roles.includes(role));
  }


  logout(): void {
    this.serviceService.logout();
    this.loggedInUser = undefined;
  }


  updateNavLabels(): void {
    if (this.loggedInUser) {
      this.userProfileLabel = `${this.loggedInUser.firstName} ${this.loggedInUser.lastName} (${this.loggedInUser.roles.join(', ')})'s Profile`;

      this.serviceService.getClubById(this.loggedInUser.clubId).subscribe(club => {
        if (club) {
          this.clubProfileLabel = `${club.name} Club`;
        }
      });
    }
  }

}
