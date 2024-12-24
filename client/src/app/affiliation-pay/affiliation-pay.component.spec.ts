import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliationPayComponent } from './affiliation-pay.component';

describe('AffiliationPayComponent', () => {
  let component: AffiliationPayComponent;
  let fixture: ComponentFixture<AffiliationPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliationPayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffiliationPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
