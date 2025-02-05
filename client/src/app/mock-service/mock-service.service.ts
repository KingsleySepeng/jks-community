import { Injectable } from '@angular/core';
import {Admin, Instructor, Student, User} from '../model/user';
import { MockDataService } from './mock-data.service';
import { Role } from '../model/role';
import {Belt} from '../model/belt';
import {Rank} from '../model/rank';

@Injectable({
  providedIn: 'root'
})
export class MockServiceService {
  loggedInUser: Instructor | Student | Admin = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    id: '0',
    memberId: '',
    belt: Belt.WHITE,
    clubId: '',
    role: Role.INSTRUCTOR,
    isActive: false,
    attendance: [],
    rank: Rank.INSTRUCTOR, // Add rank (specific to Instructor)
    createdAt: new Date(), // Add createdAt
    updatedAt: new Date(), // Add updatedAt
  };


  constructor(private mockData:MockDataService) { }
  public login(user: {
    id: string;
    memberId: string;
    email: any;
    password: any;
    firstName: string;
    lastName: string;
    clubId: string;
    belt: Belt;
    role: any;
    isActive: boolean;
    attendance: any[]
  }):User | undefined {
    const users = this.mockData.getUsers();
    const foundUser = users.find(u => u.email === user.email && u.password === user.password);
    if (foundUser) {
      this.loggedInUser = foundUser;
      return foundUser;
    } else {
      return undefined;
    }
  }
  public logout(): void {
    return undefined;
  }

  public getLoggedInUser(): Instructor {
    return <Instructor>this.loggedInUser;
  }


  }

