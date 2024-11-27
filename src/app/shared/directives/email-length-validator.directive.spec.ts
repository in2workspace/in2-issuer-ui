import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl, ValidationErrors } from '@angular/forms';
import { EmailLengthValidatorDirective } from './email-length-validator.directive';

@Component({
  template: `
    <form>
      <input type="email" [formControl]="emailControl" appValidateEmailLength />
    </form>
  `,
})
class TestComponent {
  emailControl = new FormControl('');
}

describe('EmailLengthValidatorDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let emailControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, EmailLengthValidatorDirective],
      imports: [ReactiveFormsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    emailControl = component.emailControl;
    fixture.detectChanges();
  });

  it('should create the directive', () => {
    expect(fixture).toBeTruthy();
  });

  it('should not set an error for a valid email', () => {
    emailControl.setValue('valid.email@example.com');
    expect(emailControl.errors).toBeNull();
  });

  it('should set an error if the local part exceeds 64 characters', () => {
    const longLocalPart = 'a'.repeat(65) + '@example.com';
    emailControl.setValue(longLocalPart);
    expect(emailControl.errors).toEqual({ emailLocalPartTooLong: true });
  });

  it('should set an error if the domain exceeds 255 characters', () => {
    const longDomain = 'user@' + 'a'.repeat(256) + '.com';
    emailControl.setValue(longDomain);
    expect(emailControl.errors).toEqual({ emailDomainTooLong: true });
  });

  it('should not set an error for a null or empty value', () => {
    emailControl.setValue(null);
    expect(emailControl.errors).toBeNull();

    emailControl.setValue('');
    expect(emailControl.errors).toBeNull();
  });

  it('should not set an error for a non-string value', () => {
    emailControl.setValue(12345);
    expect(emailControl.errors).toBeNull();
  });
});
