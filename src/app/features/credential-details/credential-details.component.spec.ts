import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CredentialDetailsComponent } from './credential-details.component';
import { CredentialDetailsService } from './services/credential-details.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('CredentialDetailsComponent', () => {
  let component: CredentialDetailsComponent;
  let fixture: ComponentFixture<CredentialDetailsComponent>;

  const credentialDetailsServiceMock = {
    credentialValidFrom$: signal('2024-01-01'),
    credentialValidUntil$: signal('2025-01-01'),
    credentialType$: signal('LEARCredentialEmployee'),
    credentialStatus$: signal('DRAFT'),
    credentialDetailsForm$: signal({}),
    credentialDetailsFormSchema$: signal({}),
    loadCredentialDetailsAndForm: jest.fn(),
    setProcedureId: jest.fn(),
    openSendReminderDialog: jest.fn(),
    openSignCredentialDialog: jest.fn()
  };

  const loaderServiceMock = {
    isLoading$: of(false)
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('123')
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialDetailsComponent],
      providers: [
        { provide: CredentialDetailsService, useValue: credentialDetailsServiceMock },
        { provide: LoaderService, useValue: loaderServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CredentialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call setProcedureId on init', () => {
    expect(credentialDetailsServiceMock.setProcedureId).toHaveBeenCalledWith('123');
  });

  it('should return true for showReminderButton$ if status is DRAFT and type is LEARCredentialEmployee', () => {
    expect(component.showReminderButton$()).toBe(true);
  });

  it('should return false for showSignCredentialButton$ if status is not PEND_SIGNATURE', () => {
    expect(component.showSignCredentialButton$()).toBe(false);
  });

  it('should call openSendReminderDialog', () => {
    component.openSendReminderDialog();
    expect(credentialDetailsServiceMock.openSendReminderDialog).toHaveBeenCalled();
  });

  it('should call openSignCredentialDialog', () => {
    component.openSignCredentialDialog();
    expect(credentialDetailsServiceMock.openSignCredentialDialog).toHaveBeenCalled();
  });
});
