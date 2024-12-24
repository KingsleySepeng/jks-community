import { Injectable } from '@angular/core';
import { Activity } from '../model/activity';
import { ActivityType } from '../model/activity-type';
import { Affiliation } from '../model/affiliation';
import { Attendence } from '../model/attendence';
import { Belt } from '../model/belt';
import { Club } from '../model/club';
import { Rank } from '../model/rank';
import { Role } from '../model/role';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private clubs: Club[] = [];
  private users: User[] = [];

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initializes all mock data.
   * We create the clubs first, then the users,
   * and finally we attach users to clubs.
   */
  private initializeMockData(): void {
    // 1. Create clubs with unique IDs
    const clubPretoria: Club = {
      id: '1',
      name: 'JKS Pretoria',
      address: '123 Karate St, Tokyo, Japan',
    };

    const clubHartebeesport: Club = {
      id: '2',
      name: 'JKS Hartebeesport',
      address: '456 Samurai Rd, Osaka, Japan',
    };

    const clubDurban: Club = {
      id:' 3',
      name: 'JKS Durban',
      address: '789 Dojo Ave, Durban, South Africa',
    };

    // Add all clubs to the array
    this.clubs = [clubPretoria, clubHartebeesport, clubDurban];

    // 2. Create users
    const user1: User = {
      id: '1',
      memberId: 'M001',
      email: 'king@gmail.com',
      password: 'king',
      firstName: 'Kingsley',
      lastName: 'Sepeng',
      clubId:'1',
      belt:Belt.WHITE,
      role: Role.INSTRUCTOR,
      rank: Rank.HEAD_INSTRUCTOR,
      isActive: true,
      attendance: [
        {
          date: new Date(),
          status: 'present',
          instructorId: 'I001',
          comments: 'Good performance',
        },
      ],
    };

    const user2: User = {
      id: '2',
      memberId: 'M002',
      email: 'instructor1@example.com',
      password: 'janeSmith',
      firstName: 'Jane',
      lastName: 'Smith',
      clubId:'1',
      role: Role.STUDENT,
      rank: Rank.SENIOR_INSTRUCTOR,
      belt:Belt.WHITE,
      isActive: true,
      attendance: [
        {date: new Date(),
        status: 'present',
        instructorId: 'I001',
        comments: 'Good performance Jane',}],
    };

    const user3: User = {
      id: '3',
      memberId: 'M003',
      email: 'instructor1@example.com',
      password: 'janeSmith',
      firstName: 'Jamy',
      lastName: 'Lee',
      clubId:'1',
      role: Role.STUDENT,
      rank: Rank.SENIOR_INSTRUCTOR,
      belt:Belt.WHITE,
      isActive: true,
      attendance: [ {date: new Date(),
        status: 'present',
        instructorId: 'I001',
        comments: 'Good performance Jamy',}],
    };

    // Add all users to the array
    this.users = [user1, user2,user3];

    // 3. Update clubs’ instructors/students arrays
    //    so that they match the user objects’ club references.

  }

  /**
   * Returns all users.
   */
  getUsers(): User[] {
    return this.users;
  }

  updateUsers(updatedUsers:User[]):void{
    this.users = updatedUsers;
  }
  /**
   * Returns all clubs.
   */
  getClubs(): Club[] {
    return this.clubs;
  }

  getAttendances(): Attendence[] {
    return [
      { date: new Date(), status: 'present', instructorId: 'I001', comments: 'Good performance' },
      { date: new Date(), status: 'absent', instructorId: 'I001' }
    ];
  }

  // getAffiliations(): Affiliation[] {
  //   return [
  //     { id: 1, membershipNumber: 12345 },
  //     { id: 2, membershipNumber: 67890 }
  //   ];
  // }

  // getActivities(): Activity[] {
  //   return [
  //     {
  //       id: 1,
  //       userId: 1,
  //       type: ActivityType.GASSHKU,
  //       name: 'Summer Gasshku',
  //       description: 'Annual summer training camp',
  //       location: 'Tokyo, Japan',
  //       date: '2023-08-15'
  //     },
  //     {
  //       id: 2,
  //       userId: 2,
  //       type: ActivityType.GRADING,
  //       name: 'Belt Grading',
  //       description: 'Quarterly belt grading',
  //       location: 'Osaka, Japan',
  //       date: '2023-09-10'
  //     }
  //   ];
  // }

  getBelts(): Belt[] {
    return [
      Belt.WHITE,
      Belt.YELLOW,
      Belt.ORANGE,
      Belt.GREEN,
      Belt.BLUE,
      Belt.RED,
      Belt.BROWN,
      Belt.BLACK
    ];
  }
}
