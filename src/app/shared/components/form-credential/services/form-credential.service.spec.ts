import { TestBed } from '@angular/core/testing';

import { FormCredentialService } from './form-credential.service';

describe('FormCredentialService', () => {
  let service: FormCredentialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormCredentialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
