import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignaturesComponent } from './signatures.component';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../services/configuration.service';
import { SignatureConfigurationService } from '../services/signatureConfiguration.service';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';

describe('SignaturesComponent', () => {
  let component: SignaturesComponent;
  let fixture: ComponentFixture<SignaturesComponent>;

  const mockActivatedRoute = {
    snapshot: {
      data: {
        signatureData: {
          config: {
            enableRemoteSignature: true,
            signatureMode: 'CLOUD'
          },
          credentialList: []
        }
      }
    }
  };

  const mockConfigurationService = {
    saveConfiguration: jest.fn().mockReturnValue(of(void 0)),
    updateConfiguration: jest.fn().mockReturnValue(of(void 0)),
  };

  const mockSignatureConfigService = {
    getAllConfiguration: jest.fn().mockReturnValue(of([])),
    addCredentialConfiguration: jest.fn(),
    deleteSignatureConfiguration: jest.fn(),
    updateConfiguration: jest.fn(),
    getSignatureConfigById: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignaturesComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ConfigurationService, useValue: mockConfigurationService },
        { provide: SignatureConfigurationService, useValue: mockSignatureConfigService },
        { provide: DialogWrapperService, useValue: { openDialogWithForm: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial config from route snapshot', () => {
    expect(component.signatureMode).toBe('CLOUD');
    expect(component.enableRemoteSignature).toBe(true);
    expect(component.initialConfig).toEqual({
      signatureMode: 'CLOUD',
      enableRemoteSignature: true
    });
  });

  it('should detect config changes', () => {
    component.signatureMode = 'SERVER';
    expect(component.isConfigChanged).toBe(true);
  });

  it('should return empty patch if no config changed', () => {
    const patch = component.getChangedConfig();
    expect(patch).toEqual({});
  });

  it('should call saveConfiguration when no initialConfig exists', () => {
    component.initialConfig = null as any;
    component.saveConfiguration();
    expect(mockConfigurationService.saveConfiguration).toHaveBeenCalled();
  });

  it('should call updateConfiguration when config changes exist', () => {
    component.signatureMode = 'SERVER';
    component.updateConfiguration();
    expect(mockConfigurationService.updateConfiguration).toHaveBeenCalledWith({
      signatureMode: 'SERVER'
    });
  });
});