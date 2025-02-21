import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorReportComponent } from './instructor-report.component';

describe('InstructorReportComponent', () => {
  let component: InstructorReportComponent;
  let fixture: ComponentFixture<InstructorReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
