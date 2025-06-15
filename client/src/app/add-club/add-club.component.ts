import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {Club} from '../model/club';
import {DataService} from '../services/DataService';
import {Instructor} from '../model/user';
import {Belt} from '../model/belt';
import {Role} from '../model/role';
import {generateId} from '../utils/utils';

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
    isActive: true,
  };

  clubs: Club[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getClubs().subscribe(clubs => this.clubs = clubs);
  }

  addClub(): void {
    if (!this.newClub.name || !this.newClub.address || !this.newInstructor.firstName || !this.newInstructor.email) {
      return;
    }

    const instructorId = generateId();
    const instructor: Instructor = {
      ...this.newInstructor,
      id: instructorId,
      memberId: 'M-' + instructorId.slice(0, 4),
      clubId: '', // to be assigned after club is created
      password: 'password', // default password
      profileImageUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [Role.INSTRUCTOR],
      isActive: true
    } as Instructor;

    const clubId = generateId();
    const club: Club = {
      ...this.newClub,
      id: clubId,
      instructor,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Club;

    instructor.clubId = clubId;

    this.dataService.addUser(instructor);
    this.dataService.addClub(club);

    this.newClub = {};
    this.newInstructor = {
      belt: Belt.BLACK,
      roles: [Role.INSTRUCTOR],
      isActive: true
    };
  }

  removeClub(id: string): void {
    this.dataService.removeClub(id);
  }
}
