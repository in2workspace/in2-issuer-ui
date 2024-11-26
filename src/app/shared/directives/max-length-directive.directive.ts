import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, Directive, inject, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appMaxLength]',
  exportAs: 'appMaxLength',
})
export class MaxLengthDirective implements OnInit{
  @Input('appMaxLength') public maxLength!: number; 

  private ngModel = inject(NgModel);
  private destroyRef = inject(DestroyRef);


  public ngOnInit(): void {
    this.ngModel.control.valueChanges?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.validate();
    });
  }

  private validate(): void {
    const value = this.ngModel.value || '';
    console.log('value: ')
    console.log(value)
    if (value.length > this.maxLength) {
      const errors = { ...this.ngModel.control.errors, maxlengthExceeded: true };
      console.log(errors)
      this.ngModel.control.setErrors(errors);
    } else {
      console.log('errors: ')
      console.log(this.ngModel.control.errors)
      if (this.ngModel.control.errors) {
        const { ...otherErrors } = this.ngModel.control.errors;
        this.ngModel.control.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
      }
    }
  }
}