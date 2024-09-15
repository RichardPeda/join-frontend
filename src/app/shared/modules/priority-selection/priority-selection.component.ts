import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-priority-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './priority-selection.component.html',
  styleUrl: './priority-selection.component.scss',
})
export class PrioritySelectionComponent {
  @Input() selection: 'medium' | 'urgent' | 'low' = 'medium';
  @Output('currentSelection') selectionChange = new EventEmitter<'medium' | 'urgent' | 'low'>();
 

  selectPrio(title: 'medium' | 'urgent' | 'low') {
    this.selection = title;
    this.selectionChange.emit(this.selection);
  }
}
