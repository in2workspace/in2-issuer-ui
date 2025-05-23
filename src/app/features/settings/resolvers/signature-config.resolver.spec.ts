import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SignatureConfigResolver } from './signature-config.resolver';
import { ConfigurationService } from '../services/configuration.service';
import { SignatureConfigurationService } from '../services/signatureConfiguration.service';
import { SignatureMode } from '../models/signature.models';

describe('SignatureConfigResolver', () => {
  let resolver: SignatureConfigResolver;
  let configurationServiceMock: jest.Mocked<ConfigurationService>;
  let signatureConfigServiceMock: jest.Mocked<SignatureConfigurationService>;

  const mockConfig = { enableRemoteSignature: true, signatureMode: 'CLOUD' };
  const mockCredentials = [
    { id: '123', cloudProviderName: 'AWS', credentialName: 'my-cred' }
  ];

  beforeEach(() => {
    configurationServiceMock = {
      getConfiguration: jest.fn().mockReturnValue(of(mockConfig))
    } as any;

    signatureConfigServiceMock = {
      getAllConfiguration: jest.fn().mockReturnValue(of(mockCredentials))
    } as any;

    TestBed.configureTestingModule({
      providers: [
        SignatureConfigResolver,
        { provide: ConfigurationService, useValue: configurationServiceMock },
        { provide: SignatureConfigurationService, useValue: signatureConfigServiceMock }
      ]
    });

    resolver = TestBed.inject(SignatureConfigResolver);
  });

  it('should resolve configuration and credential list', (done) => {
    resolver.resolve().subscribe(result => {
      expect(result).toEqual({
        config: mockConfig,
        credentialList: mockCredentials
      });
      expect(configurationServiceMock.getConfiguration).toHaveBeenCalled();
      expect(signatureConfigServiceMock.getAllConfiguration).toHaveBeenCalledWith(SignatureMode.CLOUD);
      done();
    });
  });

  it('should handle error and return fallback values', (done) => {
    configurationServiceMock.getConfiguration.mockReturnValueOnce(throwError(() => new Error('config error')));
    signatureConfigServiceMock.getAllConfiguration.mockReturnValueOnce(throwError(() => new Error('cred error')));

    resolver.resolve().subscribe(result => {
      expect(result).toEqual({
        config: null,
        credentialList: []
      });
      done();
    });
  });
});
