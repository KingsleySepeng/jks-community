import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {User} from '../model/user';
import {Role} from '../model/role';
import {Belt} from '../model/belt';
import {NgForOf} from '@angular/common';
import {Rank} from '../model/rank';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  user: User = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    id: '',
    memberId: '',
    clubId:'',
    role: Role.USER,
    isActive: true,
    belt:Belt.WHITE,
    attendance: [],
  }
  belts = Object.values(Belt);
  ranks = Object.values(Rank);
  constructor() {
  }

  ngOnInit() {
  }

  addStudent():void{
    console.log("Add Student to club");
  }
}
