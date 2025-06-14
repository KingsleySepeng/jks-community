import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ClassPayComponent} from './class-pay/class-pay.component';
import {CreateEventComponent} from './create-event/create-event.component';
import {EventListComponent} from './event-list/event-list.component';
import {GradingFormComponent} from './grading-form/grading-form.component';
import {GradingReportComponent} from './grading-report/grading-report.component';
import {GradingDetailComponent} from './grading-detail/grading-detail.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {ClubProfileComponent} from './club-profile/club-profile.component';
import {UploadResourceComponent} from './upload-resource/upload-resource.component';
import {ResourceListComponent} from './resource-list/resource-list.component';
import {AdminDashComponent} from './admin-dash/admin-dash.component';
import {AddUserComponent} from './add-user/add-user.component';
import {StudentDashComponent} from './student-dash/student-dash.component';
import {AttendanceComponent} from './attendance/attendance.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {path: 'attendance-tracker',component: AttendanceComponent},
  {path:'add-user',component:AddUserComponent},
  { path: 'grading-form', component: GradingFormComponent },
  { path: 'grading-report', component: GradingReportComponent },
  { path: 'grading-detail/:id', component: GradingDetailComponent },
  {path: 'resource-list', component: ResourceListComponent},
  {path: 'upload-resource', component: UploadResourceComponent},
  { path: 'logout', component: LoginComponent } // Add logout route
];
