import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffliationReportComponent } from './affliation-report.component';

describe('AffliationReportComponent', () => {
  let component: AffliationReportComponent;
  let fixture: ComponentFixture<AffliationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffliationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffliationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
