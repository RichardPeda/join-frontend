import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-greeting-animation',
  standalone: true,
  imports: [],
  templateUrl: './greeting-animation.component.html',
  styleUrl: './greeting-animation.component.scss',
  animations: [
    trigger('show-fadeout', [
      state(
        'show',
        style({
          visibility: 'visible',
          opacity: '1',
        })
      ),
      state(
        'hide',
        style({
          visibility: 'hidden',
          opacity: ' 0',
        })
      ),
      transition('show => hide', [animate('0.5s ease-in')]),
    ]),
  ],
})
export class GreetingAnimationComponent {
  @Input() animationState: 'show' | 'hide' = 'show';

  @Input() greeting = '';
  @Input() name = '';
}
