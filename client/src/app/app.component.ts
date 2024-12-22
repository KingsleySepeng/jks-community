import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { InstructorDashComponent } from "./instructor-dash/instructor-dash.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, InstructorDashComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
}
