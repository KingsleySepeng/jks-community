import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {ServiceService} from '../services/service.service';
import {Role} from '../model/role';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private serviceService: ServiceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles: Role[] = route.data['roles'];
    const user = this.serviceService.getLoggedInUserValue();

    if (!user || !user.roles.some(role => expectedRoles.includes(role))) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

}
