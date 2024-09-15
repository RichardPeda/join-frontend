import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<Event>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    let innerTarget = target as HTMLElement;

    const clickedInside =
      this.elementRef.nativeElement.contains(innerTarget) ||
      innerTarget.nodeName == 'svg' ||
      innerTarget.nodeName == 'rect' ||
      innerTarget.nodeName == 'path';

    if (!clickedInside) {
      setTimeout(() => {
        this.clickOutside.emit();
      }, 50);
    }
  }
}
