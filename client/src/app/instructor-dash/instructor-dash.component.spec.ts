import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorDashComponent } from './instructor-dash.component';

describe('InstructorDashComponent', () => {
  let component: InstructorDashComponent;
  let fixture: ComponentFixture<InstructorDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
