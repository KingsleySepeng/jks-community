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
import {AuthGuard} from './utils/auth.guard';
import {Role} from './model/role';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: 'attendance-tracker', component: AttendanceComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.INSTRUCTOR, Role.SUB_INSTRUCTOR, Role.SYSTEM_ADMIN]}
  },
  {
    path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard],
    data: {roles: [Role.INSTRUCTOR]}
  },
  {path: 'upload-resource', component: UploadResourceComponent},
  {
    path: 'resource-list', component: ResourceListComponent, canActivate: [AuthGuard],
    data: {roles: [Role.INSTRUCTOR, Role.SUB_INSTRUCTOR, Role.STUDENT]}
  },
  {
    path: 'add-club', component: AddClubComponent, canActivate: [AuthGuard],
    data: {roles: [Role.SYSTEM_ADMIN]}
  },
  {path: 'logout', component: LoginComponent},
  {path: 'update-password', component: UpdatePasswordComponent},
  {path: 'grading-form', component: GradingFormComponent},
  {path: 'grading-report', component: GradingReportComponent},
  {path: 'grading-detail/:id', component: GradingDetailComponent},
  // Default public route
  {path: '', component: LoginComponent}
];
