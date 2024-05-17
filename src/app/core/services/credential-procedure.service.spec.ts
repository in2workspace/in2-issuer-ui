import { TestBed } from '@angular/core/testing';

import { CredentialProcedureService } from './credential-procedure.service';

describe('CredentialProcedureService', () => {
  let service: CredentialProcedureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredentialProcedureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
