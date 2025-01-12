import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { InstructorDashComponent } from "./instructor-dash/instructor-dash.component";
import {AddUserComponent} from './add-user/add-user.component';
import {InstructorReportComponent} from './instructor-report/instructor-report.component';
import {ClassPayComponent} from './class-pay/class-pay.component';
import {GradingFormComponent} from './grading-form/grading-form.component';
import {AdminDashComponent} from './admin-dash/admin-dash.component';
import {AffiliationPayComponent} from './affiliation-pay/affiliation-pay.component';
import {AffliationFormComponent} from './affliation-form/affliation-form.component';
import {ClassNoticeBoardComponent} from './class-notice-board/class-notice-board.component';
import {CreateEventComponent} from './create-event/create-event.component';
import {AffliationReportComponent} from './affliation-report/affliation-report.component';
import {ClubProfileComponent} from './club-profile/club-profile.component';
import {GradingReportComponent} from './grading-report/grading-report.component';
import {JksNoticeBoardComponent} from './jks-notice-board/jks-notice-board.component';
import {UserProfileComponent} from './user-profile/user-profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, InstructorDashComponent, AddUserComponent, InstructorReportComponent, ClassPayComponent, GradingFormComponent, AdminDashComponent, AffiliationPayComponent, AffliationFormComponent, ClassNoticeBoardComponent, CreateEventComponent, AffliationReportComponent, ClubProfileComponent, GradingReportComponent, JksNoticeBoardComponent, UserProfileComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
}
