import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradingDetailComponent } from './grading-detail.component';

describe('GradingDetailComponent', () => {
  let component: GradingDetailComponent;
  let fixture: ComponentFixture<GradingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradingDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
