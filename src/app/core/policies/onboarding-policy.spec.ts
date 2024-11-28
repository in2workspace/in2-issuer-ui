import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import {OnboardingPolicy} from "./onboarding-policy";
import { TestBed } from '@angular/core/testing';
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {of} from "rxjs";

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

  // it('should return false, open dialog, log off and navigate to home when hasOnboardingExecutePower is false', (done) => {
  //   authService.hasOnboardingExecutePower.mockReturnValue(false);
  //
  //   const dialogRef = { afterClosed: jest.fn() };
  //   dialog.open.mockReturnValue(dialogRef);
  //
  //   const guardResponse = TestBed.runInInjectionContext(() => {
  //     return OnboardingPolicy();
  //   });
  //
  //   expect(guardResponse).toBe(false);
  //
  //   expect(dialog.open).toHaveBeenCalledWith(DialogComponent, {
  //     panelClass: 'custom-dialog-error',
  //   });
  //
  //   dialogRef.afterClosed.mockReturnValue(of(true));
  //
  //   dialogRef.afterClosed().subscribe(() => {
  //     expect(oidcService.logoff).toHaveBeenCalled();
  //     done();
  //   });
  // });

});
