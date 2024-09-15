import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSelectionComponent } from './contact-selection.component';

describe('ContactSelectionComponent', () => {
  let component: ContactSelectionComponent;
  let fixture: ComponentFixture<ContactSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
