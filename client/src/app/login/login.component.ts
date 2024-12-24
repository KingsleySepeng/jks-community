import { Component} from '@angular/core';
import { MockServiceService } from '../mock-service/mock-service.service';
import { User } from '../model/user';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule
import { Role } from '../model/role';
import {Belt} from '../model/belt';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
user: User = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  id: '0',
  belt:Belt.WHITE,
  memberId: '',
  clubId:'',
  role: Role.USER,
  isActive: false,
  attendance: []
}

 constructor (private mockService:MockServiceService){}

 login():void{
  debugger;
  const loggedInUser = this.mockService.login(this.user);
   if (loggedInUser) {
     this.user = loggedInUser;
     console.log(`Logged in as ${this.user.firstName} ${this.user.lastName}`);
   } else {
     console.log('Login failed');
   }
 }

 logout():void{
  this.mockService.logout();
 }
}
