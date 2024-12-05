import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, Directive, inject, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appMaxLength]',
  exportAs: 'appMaxLength',
})
export class MaxLengthDirective implements OnInit{
  @Input('appMaxLength') public maxLength!: number; 

  private readonly ngModel = inject(NgModel);
  private readonly destroyRef = inject(DestroyRef);


  public ngOnInit(): void {
    this.ngModel.control.valueChanges?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.validate();
    });
  }

  private validate(): void {
    const value = this.ngModel.value || '';
    if (value.length > this.maxLength) {
      const errors = { ...this.ngModel.control.errors, maxlengthExceeded: true };
      this.ngModel.control.setErrors(errors);
    }else if(this.ngModel.control.errors) {
      const { ...otherErrors } = this.ngModel.control.errors;
      this.ngModel.control.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }
  }
}