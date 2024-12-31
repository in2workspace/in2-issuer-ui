import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OnboardingPolicy } from "./onboarding-policy";
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';

describe('OnboardingPolicyGuard', () => {
  let authService: { hasOnboardingExecutePower: jest.Mock, logout: jest.Mock };
  let router: { createUrlTree:jest.Mock, navigate:jest.Mock };
  let dialog: { openErrorInfoDialog:jest.Mock };
  let activatedRoute: { snapshot: any }
  let translate: { instant:jest.Mock }
  let dialogRef: { afterClosed():jest.Mock };

  beforeEach(async () => {
    authService = { hasOnboardingExecutePower: jest.fn(), logout: jest.fn().mockReturnValue(of(undefined)) }
    router = { createUrlTree: jest.fn(), navigate:jest.fn().mockResolvedValue(()=> Promise.resolve(undefined)) }
    dialogRef = { afterClosed:jest.fn().mockReturnValue(of(undefined)) }
    dialog = { openErrorInfoDialog:jest.fn().mockReturnValue(dialogRef) }
    activatedRoute = { snapshot: {}}
    translate = { instant:jest.fn().mockReturnValue('translated') }

  TestBed.configureTestingModule({
    imports:[TranslateModule.forRoot({})],
    providers: [
      { provide: TranslateService, useValue: translate },
      { provide: AuthService, useValue: authService },
      { provide: Router, useValue: router },
      { provide: DialogWrapperService, useValue: dialog },
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

  it('should return false when hasOnboardingExecutePower is false', fakeAsync(() => {
    authService.hasOnboardingExecutePower.mockReturnValue(false);
    const guardResponse = TestBed.runInInjectionContext(() => {
      return OnboardingPolicy();
  });
  tick();
  expect(translate.instant).toHaveBeenCalledTimes(2);
  expect(dialog.openErrorInfoDialog).toHaveBeenCalled();
  expect(dialogRef.afterClosed).toHaveBeenCalled();
  expect(authService.logout).toHaveBeenCalled();
  expect(router.navigate).toHaveBeenCalled();
  expect(guardResponse).toBe(false);
  }));
  
});
