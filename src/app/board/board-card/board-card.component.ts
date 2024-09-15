import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { Contact } from '../../interfaces/contact.interface';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MoveTaskDialogComponent } from '../../shared/modules/move-task-dialog/move-task-dialog.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-board-card',
  standalone: true,
  imports: [
    ProgressBarComponent,
    PriorityBadgeComponent,
    CommonModule,
    MatDialogModule,
    MoveTaskDialogComponent,
  ],
  templateUrl: './board-card.component.html',
  styleUrl: './board-card.component.scss',
})
export class BoardCardComponent {
  @Input() task: Task = {
    taskID: '',
    title: '',
    description: '',
    assignedContacts: [],
    priority: 'urgent',
    category: 'Technical Task',
    dueDate: '',
    status: 'toDo',
    subtasks: [],
  };

  @Output() setTask = new EventEmitter<Task>();
  @Output() clicked = new EventEmitter<boolean>();

  openCard = false;
  openMenu = false;

  constructor(private dialog: MatDialog) {}

  /**
   * Emit to parent when card is clicked to open the detail card dialog.
   */
  openDetailCard() {
    this.openCard = true;
    this.clicked.emit(this.openCard);
  }

  /**
   * Open a MatDialog to change the status in mobile mode.
   * @param event MouseEvent to stop propagation
   */
  openCardMoveMenu(event: MouseEvent) {
    event.stopPropagation();
    const moveDialogRef = this.dialog.open(MoveTaskDialogComponent, {
      width: '320px',
      minHeight: '320px',
      data: this.task.status,
      scrollStrategy: new NoopScrollStrategy(),
    });
    moveDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.task.status = result;
        this.setTask.emit(this.task);
      }
    });
  }
}
