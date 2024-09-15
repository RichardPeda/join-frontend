import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-popup-notification',
  standalone: true,
  imports: [],
  templateUrl: './popup-notification.component.html',
  styleUrl: './popup-notification.component.scss',
  animations: [
    trigger('slideIn', [
      state(
        'out',
        style({
          transform: 'translateY(1000%)',
        })
      ),
      state(
        'in',
        style({
          transform: 'translateY(0)',
        })
      ),
      transition('out => in', [animate('0.8s')]),
    ]),
  ],
})
export class PopupNotificationComponent {
  @Input() svgContent : 'none' | 'board' = 'none';
  @Input() label: string = '';

  animate = false;

  constructor() {}

  startAnimation() {
    this.animate = true;
  }
  ngOnInit() {
    setTimeout(() => {
      this.startAnimation();
    }, 500);
  }
}
