import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo-animation-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo-animation-mobile.component.html',
  styleUrl: './logo-animation-mobile.component.scss',
  animations: [
    trigger('startAnimation', [
      state(
        'big',
        style({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        })
      ),
      state(
        'small',
        style({
          top: '-83px',
          left: '-50px',
          transform: 'scale(0.2)',
        })
      ),
      transition('big => small', [animate('1s')]),
    ]),
  ],
})
export class LogoAnimationMobileComponent {
  isBig = true;
  showBackground = false;
  animateBackground = '#f3f3f3';
  mobileMode = false;

  constructor() {
    this.isBig = true;
    this.showBackground = false;
    this.startAnimation();
  }

  startAnimation() {
    setTimeout(() => {
      this.isBig = false;
    }, 200);

    setTimeout(() => {
      this.animateBackground = 'transparent';
    }, 1500);

    setTimeout(() => {
      this.showBackground = true;
    }, 2000);
  }
}
