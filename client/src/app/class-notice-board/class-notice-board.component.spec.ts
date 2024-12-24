import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassNoticeBoardComponent } from './class-notice-board.component';

describe('ClassNoticeBoardComponent', () => {
  let component: ClassNoticeBoardComponent;
  let fixture: ComponentFixture<ClassNoticeBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassNoticeBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassNoticeBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
