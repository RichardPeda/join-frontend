import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBlankComponent } from './header-blank.component';

describe('HeaderBlankComponent', () => {
  let component: HeaderBlankComponent;
  let fixture: ComponentFixture<HeaderBlankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderBlankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderBlankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
