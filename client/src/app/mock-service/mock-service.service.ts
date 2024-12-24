import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { MockDataService } from './mock-data.service';
import { Role } from '../model/role';
import {Belt} from '../model/belt';

@Injectable({
  providedIn: 'root'
})
export class MockServiceService {
 loggedInUser: User = {
   email: '',
   password: '',
   firstName: '',
   lastName: '',
   id: '0',
   memberId: '',
   belt:Belt.WHITE,
   clubId:'',
   role: Role.USER,
   isActive: false,
   attendance: []
 }; // Initialize with default values;

constructor(private mockData:MockDataService) { }
  public login(user:User):User | undefined {

    const users = this.mockData.getUsers();
    const foundUser = users.find(u => u.email === user.email && u.password === user.password);
    if (foundUser && foundUser.role === Role.INSTRUCTOR) {
      this.loggedInUser = user;
      return foundUser;
    } else {
      return undefined;
    }
  }
  public logout(): void {
    return undefined;
  }

  public getLoggedInUser(): User | undefined {
    return this.loggedInUser;
  }


  }

