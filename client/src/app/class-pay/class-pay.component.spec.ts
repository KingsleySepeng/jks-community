import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPayComponent } from './class-pay.component';

describe('ClassPayComponent', () => {
  let component: ClassPayComponent;
  let fixture: ComponentFixture<ClassPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassPayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
