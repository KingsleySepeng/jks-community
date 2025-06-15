import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {GradingFormComponent} from './grading-form/grading-form.component';
import {GradingReportComponent} from './grading-report/grading-report.component';
import {GradingDetailComponent} from './grading-detail/grading-detail.component';
import {UploadResourceComponent} from './upload-resource/upload-resource.component';
import {ResourceListComponent} from './resource-list/resource-list.component';
import {AddUserComponent} from './add-user/add-user.component';
import {AttendanceComponent} from './attendance/attendance.component';
import {AddClubComponent} from './add-club/add-club.component';
import {UpdatePasswordComponent} from './update-password/update-password.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {path: 'attendance-tracker',component: AttendanceComponent},
  {path:'add-user',component:AddUserComponent},
  { path: 'grading-form', component: GradingFormComponent },
  { path: 'grading-report', component: GradingReportComponent },
  { path: 'grading-detail/:id', component: GradingDetailComponent },
  {path: 'resource-list', component: ResourceListComponent},
  {path: 'upload-resource', component: UploadResourceComponent},
  { path: 'logout', component: LoginComponent }, // Add logout route
  {path: 'add-club', component: AddClubComponent},
  {path: 'update-password', component: UpdatePasswordComponent},

];
