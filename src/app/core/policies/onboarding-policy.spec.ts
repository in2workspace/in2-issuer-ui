import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import {OnboardingPolicy} from "./onboarding-policy";
import { TestBed } from '@angular/core/testing';

// jest.mock('../services/auth.service');
// jest.mock('angular-auth-oidc-client');
// jest.mock('@angular/material/dialog');
// jest.mock('@angular/router');

describe('OnboardingPolicyGuard', () => {
  let authService: {hasOnboardingExecutePower: jest.Mock};
  let oidcService: {logoff: jest.Mock};
  let router: {createUrlTree:jest.Mock};
  let dialog: { open:jest.Mock, afterClosed: jest.Mock };
  let activatedRoute: {snapshot:any}

  beforeEach(async () => {
    authService = {hasOnboardingExecutePower: jest.fn()}
    oidcService = {logoff: jest.fn()}
    router = {createUrlTree: jest.fn()}
    dialog = {open:jest.fn(), afterClosed: jest.fn()}
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

  it('should say hello', ()=>{
    expect(true).toBe(true);
  })

  it('should return true when hasOnboardingExecutePower is true', () => {
    authService.hasOnboardingExecutePower.mockReturnValue(true);
    const guardResponse = TestBed.runInInjectionContext(() => {
      return OnboardingPolicy();
  });
  expect(guardResponse).toBe(true);
  });

  // it('should return false when hasOnboardingExecutePower is false and show dialog', (done) => {
  //   // Simulate the behavior of AuthService to return false for hasOnboardingExecutePower
  //   authService.hasOnboardingExecutePower = jest.fn().mockReturnValue(false);

  //   const result = OnboardingPolicy();

  //   expect(result).toBe(false);
  //   expect(authService.hasOnboardingExecutePower).toHaveBeenCalled();
  //   expect(dialog.open).toHaveBeenCalledTimes(1); // The dialog should open

  //   // Simulate the behavior of afterClosed
  //   dialogRef.afterClosed().subscribe(() => {
  //     // Assert that logoff and router navigation are called when the dialog closes
  //     expect(oidcService.logoff).toHaveBeenCalled();
  //     expect(router.navigate).toHaveBeenCalledWith(['/home']);
  //     done();
  //   });
  // });

  // it('should call logoff and navigate to home when dialog is closed', (done) => {
  //   // Simulate the behavior of AuthService to return false for hasOnboardingExecutePower
  //   authService.hasOnboardingExecutePower = jest.fn().mockReturnValue(false);

  //   // Trigger the guard
  //   OnboardingPolicy();

  //   // Simulate dialog close action and subscribe to afterClosed
  //   dialogRef.afterClosed().subscribe(() => {
  //     expect(oidcService.logoff).toHaveBeenCalled();
  //     expect(router.navigate).toHaveBeenCalledWith(['/home']);
  //     done();
  //   });
  // });
});
