import { inject } from '@angular/core';
import { PoliciesService } from '../services/policies.service';

export const OnboardingPolicy = () => {
  const policiesService = inject(PoliciesService);
  return policiesService.checkOnboardingPolicy();
};

export const SettingsPolicy = () => {
  const policiesService = inject(PoliciesService);
  return policiesService.checkSettingsPolicy()
};



