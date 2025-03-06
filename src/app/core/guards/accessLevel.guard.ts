import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { PoliciesService } from '../services/policies.service';

export const basicGuard: CanActivateFn = (route, state) => {
  const policiesService = inject(PoliciesService);
  return policiesService.checkSettingsPolicy()
};

export const settingsGuard: CanActivateFn = (route, state) => {
  return true;
};
