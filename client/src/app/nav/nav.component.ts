import { Component, OnInit } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
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
  hasClub = false;
  clubName :string | undefined = '';
  loading = true;
  appRoutes = [
    { path: 'attendance-tracker', name: 'Track Attendance', roles: [Role.SUB_INSTRUCTOR, Role.INSTRUCTOR] },
    { path: 'add-user', name: 'Manage Students', roles: [Role.SUB_INSTRUCTOR, Role.INSTRUCTOR] },
    { path: 'upload-resource', name: 'Upload Resources', roles: [Role.SUB_INSTRUCTOR, Role.INSTRUCTOR] },
    { path: 'resource-list', name: 'View Resources', roles: [Role.SUB_INSTRUCTOR, Role.INSTRUCTOR, Role.STUDENT] },
    { path: 'add-club', name: 'Manage Clubs', roles: [Role.SYSTEM_ADMIN] }
  ];

  constructor(private serviceService: ServiceService, private router: Router) {}

  ngOnInit(): void {
    this.serviceService.getLoggedInUser().subscribe(user => {
      this.loggedInUser = user;
      this.loading = false;
      this.updateNavLabels();
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  isLoggedIn(): boolean {
    return !!this.loggedInUser;
  }

  canAccess(routeRoles: Role[]): boolean {
    return this.serviceService.canUserAccessRoute(this.loggedInUser, routeRoles);
  }

  logout(): void {
    this.serviceService.logout();
    this.loggedInUser = undefined;
    this.router.navigate(['/login']);
  }

  updateNavLabels(): void {
    if (this.loggedInUser) {
      this.serviceService.getClubNameForUser(this.loggedInUser).subscribe(name => {
        this.clubName = name ?? '';
      });
    } else {
      this.clubName = '';
    }
  }

  bootstrap: any;
  errorMessage = '';
  private showError(message: string): void {
    this.errorMessage = message;
    const modal = new this.bootstrap.Modal(document.getElementById('errorModal'));
    modal.show();
  }
}
