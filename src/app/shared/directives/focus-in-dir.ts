import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[focusInDir]',
})
export class FocusInDir implements AfterViewInit {

  constructor(private eleRef: ElementRef) {
    //this.eleRef.nativeElement.focus(); 
  }
  ngAfterViewInit(): void {
      this.eleRef.nativeElement.focus(); 
  }
}
