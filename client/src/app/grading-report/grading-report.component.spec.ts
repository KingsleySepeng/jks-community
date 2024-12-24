import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradingReportComponent } from './grading-report.component';

describe('GradingReportComponent', () => {
  let component: GradingReportComponent;
  let fixture: ComponentFixture<GradingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradingReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
