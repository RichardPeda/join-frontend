import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
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
      checked: false,
    },
  ];

  @Input() detectChanges : boolean = false

  finishedSubtasks: number = 0;
  totalSubtasks: number = 0;
  progress: number = 0;

  ngOnChanges(changes :SimpleChanges) {
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
      if (subtask.checked) this.finishedSubtasks++;
    });
    this.progress =
      this.totalSubtasks > 0
        ? (this.finishedSubtasks / this.totalSubtasks) * 100
        : 0;
  }
}
