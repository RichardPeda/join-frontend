import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

export interface DialogData {
  newStatus: string;
}
@Component({
  selector: 'app-move-task-dialog',
  standalone: true,
  imports: [FormsModule, MatRadioModule, MatButtonModule, MatDialogModule],
  templateUrl: './move-task-dialog.component.html',
  styleUrl: './move-task-dialog.component.scss',
})
export class MoveTaskDialogComponent {
  status: 'toDo' | 'inProgress' | 'awaitFeedback' | 'done' = 'toDo';
  checked: boolean[] = [false, false, true, false];
  moveTo: string[] = ['toDo', 'inProgress', 'awaitFeedback', 'done'];

  list = [
    { name: 'todo', checked: 'true' },
    { name: 'in progress', checked: 'false' },
    { name: 'Await feedback', checked: 'false' },
    { name: 'done', checked: 'false' },
  ];

  constructor(
    public dialogRef: MatDialogRef<MoveTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: String
  ) {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
