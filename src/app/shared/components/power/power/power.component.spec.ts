import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PowerComponent } from './power.component';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
        upload: false,
        attest: false
      }
    ];

    const spy=jest.spyOn(component as any, 'showPopup');

    component.addOption();

    expect(component.addedOptions.length).toBe(1);
    expect((component as any).showPopup).toHaveBeenCalledWith('This option has already been added.');
  });

  it('should not add an option if selectedOption is empty', () => {
    component.isDisabled = false;
    component.selectedOption = '';

    const spy = jest.spyOn(component as any, 'showPopup');

    component.addOption();

    expect(component.addedOptions.length).toBe(0);
    expect(spy).toHaveBeenCalledWith('Please select an option.');
  });

  it('should open and close popup', ()=>{
    const msg = 'random message';
    (component as any).showPopup(msg);
    expect(component.popupMessage).toBe(msg);
    expect(component.isPopupVisible).toBe(true);
    setTimeout(()=>{
      expect(component.isPopupVisible).toBe(false);
    }, 1000);
  });

  it('should add an option if it does not already exist', () => {
    component.isDisabled = false;
    component.selectedOption = 'NewOption';

    component.addOption();

    expect(component.addedOptions.length).toBe(1);
    expect(component.addedOptions[0].tmf_function).toBe('NewOption');
  });

  it('should add a "Certification" option with correct properties', () => {
    component.isDisabled = false;
    component.selectedOption = 'Certification';

    component.addOption();

    expect(component.addedOptions.length).toBe(1);
    const addedOption = component.addedOptions[0];
    expect(addedOption.tmf_function).toBe('Certification');
    expect(addedOption.upload).toBe(false);
  });

  it('should add a "ProductOffering" option with correct properties', () => {
    component.isDisabled = false;
    component.selectedOption = 'ProductOffering';

    component.addOption();

    expect(component.addedOptions.length).toBe(1);
    const addedOption = component.addedOptions[0];
    expect(addedOption.tmf_function).toBe('ProductOffering');
    expect(addedOption.create).toBe(false);
    expect(addedOption.update).toBe(false);
    expect(addedOption.delete).toBe(false);
  });

  it('should add an "Onboarding" option with correct properties', () => {
    component.isDisabled = false;
    component.selectedOption = 'Onboarding';

    component.addOption();

    expect(component.addedOptions.length).toBe(1);
    const addedOption = component.addedOptions[0];
    expect(addedOption.tmf_function).toBe('Onboarding');
    expect(addedOption.execute).toBe(false);
  });

  it('should emit addedOptionsChange when an option is added', () => {
    const spy = jest.spyOn(component.addedOptionsChange, 'emit');

    component.isDisabled = false;
    component.selectedOption = 'NewOption';

    component.addOption();

    expect(spy).toHaveBeenCalledWith(component.addedOptions);
  });

  it('should emit handleSelectChange when onHandleSelectChange is called', () => {
    const event = new Event('change');
    const spy = jest.spyOn(component.handleSelectChange, 'emit');

    component.onHandleSelectChange(event);

    expect(spy).toHaveBeenCalledWith(event);
  });

  it('should reset selectedOption after adding an option', () => {
    component.isDisabled = false;
    component.selectedOption = 'NewOption';

    component.addOption();

    expect(component.selectedOption).toBe('');
  });
});
