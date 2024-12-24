import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffliationFormComponent } from './affliation-form.component';

describe('AffliationFormComponent', () => {
  let component: AffliationFormComponent;
  let fixture: ComponentFixture<AffliationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffliationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffliationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
