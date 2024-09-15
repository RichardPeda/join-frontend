import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailCardComponent } from './dialog-detail-card.component';

describe('DialogDetailCardComponent', () => {
  let component: DialogDetailCardComponent;
  let fixture: ComponentFixture<DialogDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDetailCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
