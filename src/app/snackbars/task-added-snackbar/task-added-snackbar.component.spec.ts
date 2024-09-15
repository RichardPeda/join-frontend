import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAddedSnackbarComponent } from './task-added-snackbar.component';

describe('TaskAddedSnackbarComponent', () => {
  let component: TaskAddedSnackbarComponent;
  let fixture: ComponentFixture<TaskAddedSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAddedSnackbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskAddedSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
