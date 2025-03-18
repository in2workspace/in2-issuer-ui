import { TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { basicGuard, settingsGuard } from './accessLevel.guard'; 
import { AuthService } from '../services/auth.service';
import { PoliciesService } from '../services/policies.service';
import { RoleType } from '../models/enums/auth-rol-type.enum';

const mockAuthService = {
  roleType: jest.fn()
};

const mockPoliciesService = {
  checkOnboardingPolicy: jest.fn(),
  checkSettingsPolicy: jest.fn()
};

describe('AccessLevel Guard Tests', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PoliciesService, useValue: mockPoliciesService }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

 
  describe('basicGuard', () => {
    it('should return true (Observable) when  RoleType = LER', (done) => {
      mockAuthService.roleType.mockReturnValue(RoleType.LER);

      TestBed.runInInjectionContext(() => {
        const result$ = basicGuard(null as any, null as any) as Observable<boolean>;

        result$.subscribe((value) => {
          expect(value).toBe(true);
          done();
        });
      });
    });

    it('should call checkOnboardingPolicy when RoleType != LER', (done) => {
      mockAuthService.roleType.mockReturnValue(RoleType.LEAR);
      mockPoliciesService.checkOnboardingPolicy.mockReturnValue(of(true));

      TestBed.runInInjectionContext(() => {
        const result$ = basicGuard(null as any, null as any) as Observable<boolean>;

        result$.subscribe((value) => {
          expect(mockPoliciesService.checkOnboardingPolicy).toHaveBeenCalled();
          expect(value).toBe(true);
          done();
        });
      });
    });

    it('should return the same value as checkOnboardingPolicy (false) when RoleType != LER', (done) => {
      mockAuthService.roleType.mockReturnValue(RoleType.LEAR);
      mockPoliciesService.checkOnboardingPolicy.mockReturnValue(of(false));

      TestBed.runInInjectionContext(() => {
        const result$ = basicGuard(null as any, null as any) as Observable<boolean>;

        result$.subscribe((value) => {
          expect(mockPoliciesService.checkOnboardingPolicy).toHaveBeenCalled();
          expect(value).toBe(false);
          done();
        });
      });
    });
  });

 
  describe('settingsGuard', () => {
    it('should return true (Observable) when RoleType = LER', (done) => {
      mockAuthService.roleType.mockReturnValue(RoleType.LER);

      TestBed.runInInjectionContext(() => {
        const result$ = settingsGuard(null as any, null as any) as Observable<boolean>;

        result$.subscribe((value) => {
          expect(value).toBe(true);
          done();
        });
      });
    });

    it('should call checkSettingsPolicy when RoleType != LEAR', (done) => {
      mockAuthService.roleType.mockReturnValue(RoleType.LEAR);
      mockPoliciesService.checkSettingsPolicy.mockReturnValue(of(true));

      TestBed.runInInjectionContext(() => {
        const result$ = settingsGuard(null as any, null as any) as Observable<boolean>;

        result$.subscribe((value) => {
          expect(mockPoliciesService.checkSettingsPolicy).toHaveBeenCalled();
          expect(value).toBe(true);
          done();
        });
      });
    });

    it('should return the same value as checkSettingsPolicy (false) when RoleType != LEAR', (done) => {
      mockAuthService.roleType.mockReturnValue(RoleType.LEAR);
      mockPoliciesService.checkSettingsPolicy.mockReturnValue(of(false));

      TestBed.runInInjectionContext(() => {
        const result$ = settingsGuard(null as any, null as any) as Observable<boolean>;

        result$.subscribe((value) => {
          expect(mockPoliciesService.checkSettingsPolicy).toHaveBeenCalled();
          expect(value).toBe(false);
          done();
        });
      });
    });
  });
});
