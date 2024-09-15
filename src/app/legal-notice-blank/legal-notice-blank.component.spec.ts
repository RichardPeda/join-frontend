import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalNoticeBlankComponent } from './legal-notice-blank.component';

describe('LegalNoticeBlankComponent', () => {
  let component: LegalNoticeBlankComponent;
  let fixture: ComponentFixture<LegalNoticeBlankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalNoticeBlankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LegalNoticeBlankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
