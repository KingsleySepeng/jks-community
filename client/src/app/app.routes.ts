import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {InstructorDashComponent} from './instructor-dash/instructor-dash.component';
import {ClassPayComponent} from './class-pay/class-pay.component';
import {InstructorPaymentComponent} from './instructor-payment/instructor-payment.component';
import {InstructorReportComponent} from './instructor-report/instructor-report.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'instructor-dash', component: InstructorDashComponent },
  { path: 'payment', component: ClassPayComponent },
  { path: 'instructor-payment', component: InstructorPaymentComponent },
  { path: 'instructor-report', component: InstructorReportComponent },


];
