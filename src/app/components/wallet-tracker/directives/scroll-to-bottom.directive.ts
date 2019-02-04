import {
  Directive,
  ElementRef,
  AfterViewInit,
  DoCheck
} from '@angular/core';

@Directive({
  selector: '[scrollToBottom]'
})
export class ScrollToBottomDirective implements DoCheck {

  constructor(private el: ElementRef) {
  }

  // TODO: think When scrollDown should be called. Probably not every checking cycle.
  // Might expose the function to be public and access it from outside the component
  // Note: reading the property 'scrollHeight' is expensive. Should avoid doing repeatedly.

  ngDoCheck(): void {
    console.log(this.el.nativeElement.scrollHeight, this.el.nativeElement.offsetHeight);
    this.scrollDown();
  }

  private scrollDown(): void {
    this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
  }

}
