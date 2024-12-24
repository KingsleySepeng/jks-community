import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JksNoticeBoardComponent } from './jks-notice-board.component';

describe('JksNoticeBoardComponent', () => {
  let component: JksNoticeBoardComponent;
  let fixture: ComponentFixture<JksNoticeBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JksNoticeBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JksNoticeBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
