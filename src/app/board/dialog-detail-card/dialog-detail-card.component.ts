import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../interfaces/task.interface';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-detail-card',
  standalone: true,
  imports: [MatDialogModule, PriorityBadgeComponent, CommonModule],
  templateUrl: './dialog-detail-card.component.html',
  styleUrl: './dialog-detail-card.component.scss',
})
export class DialogDetailCardComponent {
  localData: Task;
  editmode = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task,
    public dialogRef: MatDialogRef<DialogDetailCardComponent>
  ) {
    this.localData = { ...data };
  }

  /**
   * Toggles the subtask status - done <=> undone
   * @param index index of subtask
   */
  toggleSubtaskStatus(index: number) {
    this.data.subtasks[index].done = !this.data.subtasks[index].done;
  }

  /**
   * Emit a event that the data must be updated or the dialog is closed without changes.
   */
  updateData() {
    if (JSON.stringify(this.localData) !== JSON.stringify(this.data)) {
      this.dialogRef.close({ event: 'update', data: this.data });
    } else {
      this.dialogRef.close({ event: 'close', data: this.data });
    }
  }

  /**
   * Emit a event to delete the task after close the dialog.
   */
  deleteTask() {
    this.dialogRef.close({ event: 'delete' });
  }

  /**
   * Emit a event to switch the task to edit mode after close the dialog.
   */
  switchToEditMode() {
    this.dialogRef.close({ event: 'editmode' });
  }
}
