import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickTarget]',
  standalone: true
})
export class ClickTargetDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener('click', ['$event.target'])
  public onClick(target: any) {
    // console.log(target.srcElement);
    // console.log(this.elementRef.nativeElement.contains(target.srcElement));
    
    
  
  }

}
