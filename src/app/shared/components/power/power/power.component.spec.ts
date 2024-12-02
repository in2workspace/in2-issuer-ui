import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PowerComponent } from './power.component';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from "../../../../core/services/auth.service";
import { FormCredentialService } from '../../form-credential/services/form-credential.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

const mockDialogRef = {afterClosed:jest.fn().mockReturnValue(of(true))};

describe('PowerComponent', () => {
  let component: PowerComponent;
  let fixture: ComponentFixture<PowerComponent>;
  let debugElement: DebugElement;

  let mockDialog : {open:jest.Mock<any>};
  let mockAuthService: {hasIn2OrganizationIdentifier: jest.Mock<any>};
  let mockFormService: {
    getAddedPowers: jest.Mock<any>,
    getPlainAddedPowers: jest.Mock<any>,
    getSelectedPowerName: jest.Mock<any>,
    getPlainSelectedPower: jest.Mock<any>,
    addPower: jest.Mock<any>,
    setSelectedPowerName: jest.Mock<any>,
    removePower: jest.Mock<any>,
    checkIfPowerIsAdded: jest.Mock<any>,
  }


  beforeEach(async () => {
    mockDialog={
      open:jest.fn().mockReturnValue(mockDialogRef)
    }
    mockAuthService = {
      hasIn2OrganizationIdentifier: jest.fn().mockReturnValue(true),
    };
    mockFormService = {
      getAddedPowers: jest.fn(),
      getPlainAddedPowers: jest.fn().mockReturnValue([]),
      getSelectedPowerName: jest.fn(),
      getPlainSelectedPower: jest.fn().mockReturnValue(''),
      addPower: jest.fn(),
      setSelectedPowerName: jest.fn(),
      removePower: jest.fn(),
      checkIfPowerIsAdded: jest.fn().mockReturnValue(false)
    };

    await TestBed.configureTestingModule({
      declarations: [PowerComponent],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: MatDialog, useValue: mockDialog},
        { provide: AuthService, useValue: mockAuthService },
        { provide: FormCredentialService, useValue: mockFormService }
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

  it('should call hasIn2OrganizationIdentifier on ngOnInit', () => {
    const spy = jest.spyOn(mockAuthService, 'hasIn2OrganizationIdentifier');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.organizationIdentifierIsIn2).toBe(true);
  });

  it('should not add power if is disabled', ()=>{
    component.isDisabled = true;
    component.addPower();
    expect(mockFormService.addPower).not.toHaveBeenCalled();
  });

  it('should not add "Onboarding" option if organizationIdentifierIsIn2 is false', () => {
    component.isDisabled = false;
    mockAuthService.hasIn2OrganizationIdentifier.mockReturnValue(false);
    mockFormService.getPlainSelectedPower.mockReturnValue('Onboarding');

    component.ngOnInit();
    component.addPower();

    expect(mockFormService.addPower).not.toHaveBeenCalled();
  });

  it('should add "Onboarding" option if organizationIdentifierIsIn2 is true', () => {
    mockAuthService.hasIn2OrganizationIdentifier.mockReturnValue(true);
    component.isDisabled = false;
    mockFormService.getPlainSelectedPower.mockReturnValue('Onboarding');

    component.ngOnInit();
    component.addPower();

    expect(mockFormService.addPower).toHaveBeenCalledWith(
      {
        tmf_action: '',
        tmf_domain: 'DOME',
        tmf_function: 'Onboarding',
        tmf_type: 'Domain',
        execute: false,
        create: false,
        update: false,
        delete: false,
        upload: false,
        attest: false
      });
  

    expect(mockFormService.setSelectedPowerName).toHaveBeenCalledWith('');
  });

  it('should not add an option if selectedOption is empty', () => {
    mockAuthService.hasIn2OrganizationIdentifier.mockReturnValue(false);
    component.isDisabled = false;
    mockFormService.getPlainSelectedPower.mockReturnValue('Certification');

    component.ngOnInit();
    component.addPower();

    expect(mockFormService.addPower).not.toHaveBeenCalled();
  });

  it('should add an option if it does not already exist', () => {
    component.isDisabled = false;
    mockFormService.getPlainSelectedPower.mockReturnValue('Certification');

    component.ngOnInit();
    component.addPower();

    expect(mockFormService.addPower).not.toHaveBeenCalled();
  });

  it('should add "Certification" option if organizationIdentifierIsIn2 is true', () => {
    mockAuthService.hasIn2OrganizationIdentifier.mockReturnValue(true);
    component.isDisabled = false;
    mockFormService.getPlainSelectedPower.mockReturnValue('Certification');

    component.ngOnInit();
    component.addPower();

    expect(mockFormService.addPower).toHaveBeenCalledWith(
      {
        tmf_action: '',
        tmf_domain: 'DOME',
        tmf_function: 'Certification',
        tmf_type: 'Domain',
        execute: false,
        create: false,
        update: false,
        delete: false,
        upload: false,
        attest: false,
      },
      false
    );

    expect(mockFormService.setSelectedPowerName).toHaveBeenCalledWith('');
  });

  it('should not add an option if it already exists', () => {
    component.isDisabled = false;
    mockFormService.getPlainSelectedPower.mockReturnValue('Certification');

    component.ngOnInit();
    component.addPower();

    expect(mockFormService.addPower).toHaveBeenCalledWith(
      {
        tmf_action: '',
        tmf_domain: 'DOME',
        tmf_function: 'Certification',
        tmf_type: 'Domain',
        execute: false,
        create: false,
        update: false,
        delete: false,
        upload: false,
        attest: false,
      },
      false
    );

    expect(mockFormService.setSelectedPowerName).toHaveBeenCalledWith('');
  });

  it('should not add an option if it already exists', () => {
    component.isDisabled = false;
    mockFormService.getPlainSelectedPower.mockReturnValue('TestOption');
    mockFormService.checkIfPowerIsAdded.mockReturnValue(true);

    component.addPower();

    expect(mockFormService.addPower).not.toHaveBeenCalled();
  });

  it('should open dialog before removing power', ()=>{
    const powerName = 'testPowerName';
    component.removePower(powerName);
    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        title: `Remove Power ${powerName}`,
        message: `Are you sure you want to remove this power: ${powerName}?`,
      },
    });
    expect(mockFormService.removePower).toHaveBeenCalledWith(powerName);
  });


  it('should handle select change', () => {
    const eventValue = 'eventValue';
    const event = {value:eventValue} as any;
    const spy = jest.spyOn(mockFormService, 'setSelectedPowerName');

    component.onHandleSelectChange(event);

    expect(spy).toHaveBeenCalledWith(eventValue);
  });

  it('should check if option is disabled', ()=>{
    const powerName = 'powerName'
    component.isOptionDisabled(powerName);
    expect(mockFormService.checkIfPowerIsAdded).toHaveBeenCalledWith(powerName);
  });
});
