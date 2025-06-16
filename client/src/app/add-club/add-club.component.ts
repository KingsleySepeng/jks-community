import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {Club} from '../model/club';
import {DataService} from '../services/DataService';
import {Instructor} from '../model/user';
import {Belt} from '../model/belt';
import {Role} from '../model/role';
import {generateId} from '../utils/utils';
import {first} from 'rxjs';
import {ServiceService} from '../services/service.service';

@Component({
  selector: 'app-add-club',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './add-club.component.html',
  styleUrl: './add-club.component.scss'
})
export class AddClubComponent  implements OnInit {
  newClub: Partial<Club> = {};
  newInstructor: Partial<Instructor> = {
    belt: Belt.BLACK,
    roles: [Role.INSTRUCTOR],
    isActive: true
  };

  clubs: Club[] = [];

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.serviceService.getClubs().pipe(first()).subscribe(clubs => {
      this.clubs = clubs;
    });
  }

  addClub(): void {
    if (
      !this.newClub.name ||
      !this.newClub.address ||
      !this.newInstructor.firstName ||
      !this.newInstructor.email
    ) {
      return;
    }

    this.serviceService.addClubWithInstructor(this.newClub, this.newInstructor);

    // Reset forms
    this.newClub = {};
    this.newInstructor = {
      belt: Belt.BLACK,
      roles: [Role.INSTRUCTOR],
      isActive: true
    };

    this.refreshClubList();
  }

  removeClub(id: string): void {
    this.serviceService.removeClub(id);
    this.refreshClubList();
  }

  private refreshClubList(): void {
    this.serviceService.getClubs().pipe(first()).subscribe((clubs: Club[]) => {
      this.clubs = clubs;
    });
  }
}
