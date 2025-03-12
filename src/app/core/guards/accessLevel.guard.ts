import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { PoliciesService } from '../services/policies.service';
import { AuthService } from '../services/auth.service';
import { RolType } from '../models/enums/auth-rol-type.enum';
import { of } from 'rxjs';


export const basicGuard: CanActivateFn = () => {
  const policiesService = inject(PoliciesService);
  const authService = inject(AuthService);
  const loginType = authService.rolType();
  if (loginType === RolType.LER) {
    return of(true);
  }else{
    return policiesService.checkOnboardingPolicy()
  }
};


export const settingsGuard: CanActivateFn = () => {
  const policiesService = inject(PoliciesService);
  const authService = inject(AuthService);
  const loginType = authService.rolType();
  if (loginType === RolType.LER) {
    return of(true);
  }else{
    return policiesService.checkSettingsPolicy()
  }
};

