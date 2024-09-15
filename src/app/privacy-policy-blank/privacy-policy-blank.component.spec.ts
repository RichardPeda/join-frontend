import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyBlankComponent } from './privacy-policy-blank.component';

describe('PrivacyPolicyBlankComponent', () => {
  let component: PrivacyPolicyBlankComponent;
  let fixture: ComponentFixture<PrivacyPolicyBlankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyBlankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrivacyPolicyBlankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
