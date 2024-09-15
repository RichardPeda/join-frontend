import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoAnimationMobileComponent } from './logo-animation-mobile.component';

describe('LogoAnimationMobileComponent', () => {
  let component: LogoAnimationMobileComponent;
  let fixture: ComponentFixture<LogoAnimationMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoAnimationMobileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogoAnimationMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
