import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { OnboardingPolicy } from "./onboarding-policy";
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('OnboardingPolicyGuard', () => {
  let authService: {hasOnboardingExecutePower: jest.Mock};
  let router: {createUrlTree:jest.Mock};
  let dialog: { open:jest.Mock};
  let activatedRoute: {snapshot:any}

  beforeEach(async () => {
    authService = {hasOnboardingExecutePower: jest.fn()}
    router = {createUrlTree: jest.fn()}
    dialog = {open:jest.fn()}
    activatedRoute = { snapshot: {}}

  TestBed.configureTestingModule({
    imports:[TranslateModule.forRoot({})],
    providers: [
      TranslateService,
       { provide: AuthService, useValue: authService},
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
