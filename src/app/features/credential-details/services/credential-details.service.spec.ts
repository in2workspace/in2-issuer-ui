import { TestBed } from '@angular/core/testing';
import { CredentialDetailsService } from './credential-details.service';


describe('DetailService', () => {
  let service: CredentialDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredentialDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
