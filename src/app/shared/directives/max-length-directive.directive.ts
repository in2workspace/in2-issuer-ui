import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appMaxLengthDirective]'
})
export class MaxLengthDirectiveDirective {
  @Input() private maxLength!: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  public onInput(event: Event): void {
    console.log('input directive')
    const input = this.el.nativeElement as HTMLInputElement;
    if (input.value.length > this.maxLength) {
      // Limitar el text al màxim permès
      input.value = input.value.substring(0, this.maxLength);
      this.renderer.setProperty(this.el.nativeElement, 'value', input.value);
    }
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (value && value.length > this.maxLength) {
      return { maxLength: { requiredLength: this.maxLength, actualLength: value.length } };
    }
    return null;
  }
}
