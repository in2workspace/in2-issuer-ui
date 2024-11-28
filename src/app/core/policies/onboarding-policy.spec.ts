import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import {OnboardingPolicy} from "./onboarding-policy";

jest.mock('../services/auth.service');
jest.mock('angular-auth-oidc-client');
jest.mock('@angular/material/dialog');
jest.mock('@angular/router');

describe('OnboardingPolicyGuard', () => {
  let authService: jest.Mocked<AuthService>;
  let oidcService: jest.Mocked<OidcSecurityService>;
  let router: jest.Mocked<Router>;
  let dialog: jest.Mocked<MatDialog>;
  let dialogRef: { afterClosed: jest.Mock };

  beforeEach(() => {
    dialogRef = {
      afterClosed: jest.fn().mockReturnValue(of(true)),
    };

    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  it('should return true when hasOnboardingExecutePower is true', () => {
    // Simulate the behavior of AuthService to return true for hasOnboardingExecutePower
    authService.hasOnboardingExecutePower = jest.fn().mockReturnValue(true);

    const result = OnboardingPolicy();

    expect(result).toBe(true);
    expect(authService.hasOnboardingExecutePower).toHaveBeenCalled();
    expect(dialog.open).not.toHaveBeenCalled(); // The dialog should not open
  });

  it('should return false when hasOnboardingExecutePower is false and show dialog', (done) => {
    // Simulate the behavior of AuthService to return false for hasOnboardingExecutePower
    authService.hasOnboardingExecutePower = jest.fn().mockReturnValue(false);

    const result = OnboardingPolicy();

    expect(result).toBe(false);
    expect(authService.hasOnboardingExecutePower).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalledTimes(1); // The dialog should open

    // Simulate the behavior of afterClosed
    dialogRef.afterClosed().subscribe(() => {
      // Assert that logoff and router navigation are called when the dialog closes
      expect(oidcService.logoff).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      done();
    });
  });

  it('should call logoff and navigate to home when dialog is closed', (done) => {
    // Simulate the behavior of AuthService to return false for hasOnboardingExecutePower
    authService.hasOnboardingExecutePower = jest.fn().mockReturnValue(false);

    // Trigger the guard
    OnboardingPolicy();

    // Simulate dialog close action and subscribe to afterClosed
    dialogRef.afterClosed().subscribe(() => {
      expect(oidcService.logoff).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      done();
    });
  });
});
