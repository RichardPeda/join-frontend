import { Component, Input, SimpleChange } from '@angular/core';
import { Subtask } from '../../interfaces/subtask.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
})
export class ProgressBarComponent {
  @Input() subtasks: Subtask[] = [
    {
      title: '',
      done: false,
    },
  ];

  finishedSubtasks: number = 0;
  totalSubtasks: number = 0;
  progress: number = 0;

  ngOnChanges(changes: SimpleChange) {
    this.calcSubtasks();
  }
  ngOnInit() {
    this.calcSubtasks();
  }

  /**
   * Calculate the amount of finished subtasks. Convert it to progress between 0 and 100%.
   */
  calcSubtasks() {
    this.finishedSubtasks = 0;
    this.totalSubtasks = this.subtasks.length;
    this.subtasks.forEach((subtask) => {
      if (subtask.done) this.finishedSubtasks++;
    });
    this.progress =
      this.totalSubtasks > 0
        ? (this.finishedSubtasks / this.totalSubtasks) * 100
        : 0;
  }
}
