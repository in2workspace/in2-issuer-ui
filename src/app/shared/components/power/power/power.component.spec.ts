import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PowerComponent } from './power.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';

describe('PowerComponent', () => {
  let component: PowerComponent;
  let fixture: ComponentFixture<PowerComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PowerComponent],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not add an option if isDisabled is true', () => {
    component.isDisabled = true;
    component.selectedOption = 'TestOption';

    component.addOption();

    expect(component.addedOptions.length).toBe(0);
  });

  it('should not add an option if it already exists', () => {
    component.isDisabled = false;
    component.selectedOption = 'TestOption';
    component.addedOptions = [
      {
        tmf_action: [],
        tmf_domain: 'DOME',
        tmf_function: 'TestOption',
        tmf_type: 'Domain',
        execute: false,
        create: false,
        update: false,
        delete: false,
      },
    ];

    component.addOption();

    expect(component.addedOptions.length).toBe(1);
  });

  it('should not add an option if selectedOption is empty', () => {
    component.isDisabled = false;
    component.selectedOption = '';

    component.addOption();

    expect(component.addedOptions.length).toBe(0);
  });

  it('should add an option if it does not already exist', () => {
    component.isDisabled = false;
    component.selectedOption = 'NewOption';

    component.addOption();

    expect(component.addedOptions.length).toBe(1);
    expect(component.addedOptions[0].tmf_function).toBe('NewOption');
  });

  it('should emit addedOptionsChange when an option is added', () => {
    spyOn(component.addedOptionsChange, 'emit');

    component.isDisabled = false;
    component.selectedOption = 'NewOption';

    component.addOption();

    expect(component.addedOptionsChange.emit).toHaveBeenCalledWith(
      component.addedOptions
    );
  });

  it('should emit handleSelectChange when onHandleSelectChange is called', () => {
    const event = new Event('change');
    spyOn(component.handleSelectChange, 'emit');

    component.onHandleSelectChange(event);

    expect(component.handleSelectChange.emit).toHaveBeenCalledWith(event);
  });
});
