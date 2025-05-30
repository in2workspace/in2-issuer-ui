import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { PoliciesService } from '../services/policies.service';
import { AuthService } from '../services/auth.service';
import { RoleType } from '../models/enums/auth-rol-type.enum';
import { of } from 'rxjs';


export const basicGuard: CanActivateFn = () => {
  const policiesService = inject(PoliciesService);
  const authService = inject(AuthService);
  const loginType = authService.roleType();
  if (loginType === RoleType.LER) {
    return of(false);
  }else{
    return policiesService.checkOnboardingPolicy()
  }
};


export const settingsGuard: CanActivateFn = () => {
  const policiesService = inject(PoliciesService);
  const authService = inject(AuthService);
  const loginType = authService.roleType();
  if (loginType === RoleType.LER) {
    return of(false);
  }else{
    return policiesService.checkSettingsPolicy()
  }
};

