import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { UnicodeValidatorDirective } from './unicode-validator.directive';

@Component({
  template: `
    <form>
      <input type="text" [formControl]="unicodeControl" appUnicodeValidator />
    </form>
  `,
})
class TestComponent {
  unicodeControl = new FormControl('');
}

describe('UnicodeValidatorDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let unicodeControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, UnicodeValidatorDirective],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    unicodeControl = component.unicodeControl;
    fixture.detectChanges();
  });

  it('should create the directive', () => {
    expect(fixture).toBeTruthy();
  });

  it('should not set an error for valid Unicode text', () => {
    const validValues = [
      'Héllo',       // Latin characters with accents
      'Český',       // Diacritics
      'Γειά',        // Greek letters
      'こんにちは',  // Japanese Hiragana/Katakana
      '안녕하세요',   // Korean Hangul
      'مرحبا',       // Arabic
      '中文',         // Chinese
      '’',           // Unicode apostrophe
      'é’.',         // Mixed valid characters
    ];

    validValues.forEach((value) => {
      unicodeControl.setValue(value);
      expect(unicodeControl.errors).toBeNull();
    });
  });

  it('should set an error for invalid characters', () => {
    const invalidValues = [
      'Hello!',      // Exclamation mark
      '12345',       // Numbers
      'Test@Name',   // `@` not allowed
      'Name#Value',  // `#` not allowed
      'Value$',      // `$` not allowed
      'Value%',      // `%` not allowed
      'Value_',      // `_` not allowed
      'Value1',      // Numbers
      '🙂',           // Emoji
    ];

    invalidValues.forEach((value) => {
      unicodeControl.setValue(value);
      expect(unicodeControl.errors).toEqual({ invalidUnicode: true });
    });
  });

  it('should not set an error for an empty value', () => {
    unicodeControl.setValue('');
    expect(unicodeControl.errors).toBeNull();
  });

  it('should not set an error for null or undefined values', () => {
    unicodeControl.setValue(null);
    expect(unicodeControl.errors).toBeNull();

    unicodeControl.setValue(undefined);
    expect(unicodeControl.errors).toBeNull();
  });

  it('should set an error for mixed valid and invalid characters', () => {
    const invalidValues = [
      'Héllo123', // Valid text with numbers
      'Γειά!',    // Valid Greek text with invalid `!`
      '中文🙂',     // Valid Chinese characters with emoji
    ];

    invalidValues.forEach((value) => {
      unicodeControl.setValue(value);
      expect(unicodeControl.errors).toEqual({ invalidUnicode: true });
    });
  });
});
