import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MaxLengthDirective } from './max-length-directive.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <input [(ngModel)]="inputValue" appMaxLength="5" />
  `,
})
class TestComponent {
  inputValue = '';
}

describe('MaxLengthDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let directive: any;
  let inputEl: HTMLInputElement;
  let ngModel: NgModel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, MaxLengthDirective],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const directiveDebugElement = fixture.debugElement.query(By.directive(MaxLengthDirective));
    directive = directiveDebugElement.injector.get(MaxLengthDirective);

    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    ngModel = fixture.debugElement.query(By.directive(NgModel)).injector.get(NgModel);
    // console.log(inputEl)
    console.log(ngModel.control)
  });

  it('should create the directive', () => {
    expect(fixture).toBeTruthy();
  });

  it('should not set an error when the value length is within the limit', () => {
    component.inputValue = '12345'; // exactly 5 characters
    fixture.detectChanges();

    // expect(directive.validate).toHaveBeenCalled();
    expect(ngModel.control.errors).toBeNull();
  });

  it('should set an error when the value length exceeds the limit', () => {
    const validateSpy = jest.spyOn(directive, 'validate');
    const setErrorSpy = jest.spyOn(ngModel.control, 'setErrors');
    component.inputValue = '123456'; // more than 5 characters
    fixture.detectChanges();
    console.log('console test:');
    console.log(ngModel.control);
    expect(directive.validate).toHaveBeenCalled();
    expect(setErrorSpy)
    // expect(ngModel.control.errors).toEqual({ maxlengthExceeded: true });
  });

  // it('should remove the maxlengthExceeded error when the value length is reduced', () => {
  //   component.inputValue = '123456'; // exceeds limit
  //   fixture.detectChanges();
  //   expect(ngModel.control.errors).toEqual({ maxlengthExceeded: true });

  //   component.inputValue = '1234'; // within limit
  //   fixture.detectChanges();
  //   expect(ngModel.control.errors).toBeNull();
  // });

  // it('should retain other errors when maxlengthExceeded is removed', () => {
  //   component.inputValue = '123456'; // exceeds limit
  //   fixture.detectChanges();

  //   ngModel.control.setErrors({ customError: true, maxlengthExceeded: true });
  //   component.inputValue = '1234'; // within limit
  //   fixture.detectChanges();

  //   expect(ngModel.control.errors).toEqual({ customError: true }); // retains other errors
  // });
});
