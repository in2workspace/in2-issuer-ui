import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { roleOrPolicyGuard } from './role-or-policy.guard';

describe('roleOrPolicyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleOrPolicyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
