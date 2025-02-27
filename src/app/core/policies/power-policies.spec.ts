import { TestBed } from '@angular/core/testing';
import { OnboardingPolicy, SettingsPolicy } from './power-policies';
import { PoliciesService } from '../services/policies.service';
import { of } from 'rxjs';

describe('Power Policies Guards', () => {
  let mockPoliciesService: jest.Mocked<PoliciesService>;

  beforeEach(() => {
    mockPoliciesService = {
      checkOnboardingPolicy: jest.fn(),
      checkSettingsPolicy: jest.fn(),
    } as unknown as jest.Mocked<PoliciesService>;

    TestBed.configureTestingModule({
      providers: [
        { provide: PoliciesService, useValue: mockPoliciesService }
      ]
    });
  });

  it('should return true when OnboardingPolicy allows access', (done) => {
    mockPoliciesService.checkOnboardingPolicy.mockReturnValue(of(true));

    TestBed.runInInjectionContext(() => {
      const guardFunction = OnboardingPolicy();
      const result$ = guardFunction;

      result$.subscribe((result) => {
        expect(result).toBe(true);
        expect(mockPoliciesService.checkOnboardingPolicy).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should return false when OnboardingPolicy denies access', (done) => {
    mockPoliciesService.checkOnboardingPolicy.mockReturnValue(of(false));

    TestBed.runInInjectionContext(() => {
      const guardFunction = OnboardingPolicy();
      const result$ = guardFunction;

      result$.subscribe((result) => {
        expect(result).toBe(false);
        expect(mockPoliciesService.checkOnboardingPolicy).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should return true when SettingsPolicy allows access', (done) => {
    mockPoliciesService.checkSettingsPolicy.mockReturnValue(of(true));

    TestBed.runInInjectionContext(() => {
      const guardFunction = SettingsPolicy();
      const result$ = guardFunction;

      result$.subscribe((result) => {
        expect(result).toBe(true);
        expect(mockPoliciesService.checkSettingsPolicy).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should return false when SettingsPolicy denies access', (done) => {
    mockPoliciesService.checkSettingsPolicy.mockReturnValue(of(false));

    TestBed.runInInjectionContext(() => {
      const guardFunction = SettingsPolicy();
      const result$ = guardFunction;

      result$.subscribe((result) => {
        expect(result).toBe(false);
        expect(mockPoliciesService.checkSettingsPolicy).toHaveBeenCalled();
        done();
      });
    });
  });
});
