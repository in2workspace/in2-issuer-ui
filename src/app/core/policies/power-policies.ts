import { inject } from '@angular/core';
import { PoliciesService } from '../services/policies.service';
import { AuthService } from '../services/auth.service';

export const OnboardingPolicy = () => {
  const policiesService = inject(PoliciesService);
  const authService = inject(AuthService);

  return policiesService.checkOnboardingPolicy();
};

export const SettingsPolicy = () => {
  const policiesService = inject(PoliciesService);
  return policiesService.checkSettingsPolicy()
};



