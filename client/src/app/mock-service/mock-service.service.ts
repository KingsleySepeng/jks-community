import { Injectable } from '@angular/core';
import {Instructor, User} from '../model/user';
import { MockDataService } from './mock-data.service';
import { Role } from '../model/role';
import {Belt} from '../model/belt';

@Injectable({
  providedIn: 'root'
})
export class MockServiceService {
 loggedInUser: {
   email: string;
   password: string;
   firstName: string;
   lastName: string;
   id: string;
   memberId: string;
   belt: Belt;
   clubId: string;
   role: Role.INSTRUCTOR;
   isActive: boolean;
   attendance: any[]
 } = {
   email: '',
   password: '',
   firstName: '',
   lastName: '',
   id: '0',
   memberId: '',
   belt:Belt.WHITE,
   clubId:'',
   role: Role.INSTRUCTOR,
   isActive: false,
   attendance: []
 }; // Initialize with default values;

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
    if (foundUser && foundUser.role === Role.INSTRUCTOR) {
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

