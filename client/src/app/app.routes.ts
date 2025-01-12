import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {InstructorDashComponent} from './instructor-dash/instructor-dash.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'instructor-dash', component: InstructorDashComponent }
];
