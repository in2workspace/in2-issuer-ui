import { TestBed } from '@angular/core/testing';
import { SignatureConfigurationService } from './signatureConfiguration.service';
import { SignatureConfigurationRepository } from './signatureConfiguration.repository';
import { of } from 'rxjs';
import { SignatureConfigurationRequest, SignatureConfigurationResponse } from '../models/signature.models';

describe('SignatureConfigurationService', () => {
  let service: SignatureConfigurationService;
  let repositoryMock: jest.Mocked<SignatureConfigurationRepository>;

  const dummyRequest: SignatureConfigurationRequest = {
    enableRemoteSignature: true,
    signatureMode: 'CLOUD',
    cloudProviderId: 'provider-id',
    clientId: 'client-id',
    credentialId: 'cred-id',
    credentialName: 'My Credential',
    clientSecret: 'secret123',
    credentialPassword: 'password123',
    secret: 'otp-secret'
  };

  const dummyResponse: SignatureConfigurationResponse = {
    id: '123',
    enableRemoteSignature: true,
    signatureMode: 'CLOUD',
    cloudProviderId: 'provider-id',
    clientId: 'client-id',
    credentialId: 'cred-id',
    credentialName: 'My Credential',
  };

  beforeEach(() => {
    repositoryMock = {
      saveSignatureConfiguration: jest.fn().mockReturnValue(of(void 0)),
      getAllSignatureConfiguration: jest.fn().mockReturnValue(of([{
        id: '123',
        cloudProviderName: 'Azure',
        credentialName: 'Azure Cred'
      }])),
      getSignatureConfigById: jest.fn().mockReturnValue(of(dummyResponse)),
      deleteSignatureConfiguration: jest.fn().mockReturnValue(of(void 0)),
      updateSignatureConfiguration: jest.fn().mockReturnValue(of(void 0)),
      addCredentialConfiguration: jest.fn().mockReturnValue(of(void 0)),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        SignatureConfigurationService,
        { provide: SignatureConfigurationRepository, useValue: repositoryMock }
      ]
    });

    service = TestBed.inject(SignatureConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call saveSignatureConfiguration', () => {
    service.saveSignatureConfiguration(dummyRequest).subscribe();
    expect(repositoryMock.saveSignatureConfiguration).toHaveBeenCalledWith(dummyRequest);
  });

  it('should call getAllConfiguration and map data correctly', (done) => {
    service.getAllConfiguration().subscribe(data => {
      expect(data).toEqual([
        {
          id: '123',
          cloudProviderName: 'Azure',
          credentialName: 'Azure Cred'
        }
      ]);
      done();
    });
  });

  it('should return null if no config found in getAllConfiguration', (done) => {
    repositoryMock.getAllSignatureConfiguration.mockReturnValueOnce(of([]));
    service.getAllConfiguration().subscribe(data => {
      expect(data).toBeNull();
      done();
    });
  });

  it('should call getSignatureConfigById', () => {
    service.getSignatureConfigById('123').subscribe();
    expect(repositoryMock.getSignatureConfigById).toHaveBeenCalledWith('123');
  });

  it('should call deleteSignatureConfiguration with id and rationale', () => {
    service.deleteSignatureConfiguration('123', 'testing').subscribe();
    expect(repositoryMock.deleteSignatureConfiguration).toHaveBeenCalledWith('123', 'testing');
  });

  it('should call updateConfiguration with id and partial config', () => {
    const partialConfig = { credentialName: 'Updated Cred' };
    service.updateConfiguration('123', partialConfig).subscribe();
    expect(repositoryMock.updateSignatureConfiguration).toHaveBeenCalledWith('123', partialConfig);
  });

  it('should call addCredentialConfiguration', () => {
    service.addCredentialConfiguration(dummyRequest).subscribe();
    expect(repositoryMock.addCredentialConfiguration).toHaveBeenCalledWith(dummyRequest);
  });
});
