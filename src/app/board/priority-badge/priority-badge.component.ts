import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [],
  templateUrl: './priority-badge.component.html',
  styleUrl: './priority-badge.component.scss'
})
export class PriorityBadgeComponent implements OnChanges {

@Input() priority: string = '';


ngOnChanges(){

}


}
