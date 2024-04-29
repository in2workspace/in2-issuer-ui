import { TestBed } from '@angular/core/testing';

import { CredentialManagementService } from './credential-management.service';

describe('CredentialManagementService', () => {
  let service: CredentialManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredentialManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
