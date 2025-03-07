import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { PoliciesService } from '../services/policies.service';
import { AuthService } from '../services/auth.service';
import { AuthLoginType } from '../models/enums/auth-login-type.enum';
import { of } from 'rxjs';


export const basicGuard: CanActivateFn = (route, state) => {
  const policiesService = inject(PoliciesService);
  const authService = inject(AuthService);
  const loginType = authService.authLoginType();
  if (loginType === AuthLoginType.CERT) {
    return of(true);
  }else{
    return policiesService.checkOnboardingPolicy()
  }
};


export const settingsGuard: CanActivateFn = (route, state) => {
  const policiesService = inject(PoliciesService);
  const authService = inject(AuthService);
  const loginType = authService.authLoginType();
  //If certified, it is understood as a LER role.
  if (loginType === AuthLoginType.CERT) {
    return of(true);
  }else{
    return policiesService.checkSettingsPolicy()
  }
};

