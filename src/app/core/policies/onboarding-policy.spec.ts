import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { OnboardingPolicy } from "./onboarding-policy";
import { TestBed } from '@angular/core/testing';

describe('OnboardingPolicyGuard', () => {
  let authService: {hasOnboardingExecutePower: jest.Mock};
  let oidcService: {logoff: jest.Mock};
  let router: {createUrlTree:jest.Mock};
  let dialog: { open:jest.Mock};
  let activatedRoute: {snapshot:any}

  beforeEach(async () => {
    authService = {hasOnboardingExecutePower: jest.fn()}
    oidcService = {logoff: jest.fn()}
    router = {createUrlTree: jest.fn()}
    dialog = {open:jest.fn()}
    activatedRoute = { snapshot: {}}

  TestBed.configureTestingModule({
    providers: [
       { provide: AuthService, useValue: authService},
       { provide: OidcSecurityService, useValue: oidcService},
       { provide: Router, useValue: router},
       { provide: MatDialog, useValue: dialog},
       { provide: ActivatedRoute, useValue: activatedRoute },
    ],
});
});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when hasOnboardingExecutePower is true', () => {
    authService.hasOnboardingExecutePower.mockReturnValue(true);
    const guardResponse = TestBed.runInInjectionContext(() => {
      return OnboardingPolicy();
  });
  expect(guardResponse).toBe(true);
  });
});
