import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorPaymentComponent } from './instructor-payment.component';

describe('InstructorPaymentComponent', () => {
  let component: InstructorPaymentComponent;
  let fixture: ComponentFixture<InstructorPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
