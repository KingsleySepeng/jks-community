import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {ServiceService} from '../services/service.service';
import {Role} from '../model/role';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private serviceService: ServiceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles: Role[] = route.data['roles'] ?? [];
    const user = this.serviceService.getLoggedInUserValue();

    const isAuthorized = user && expectedRoles.length > 0
      ? user.roles.some(role => expectedRoles.includes(role))
      : !!user;

    if (!isAuthorized) {
      this.router.navigate(['/']);
      console.warn('Access denied. Required roles:', expectedRoles, 'User:', user?.roles);
      return false;
    }

    return true;
  }


}
