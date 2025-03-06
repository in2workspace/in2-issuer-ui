import { CanActivateFn } from '@angular/router';

export const settingsGuard: CanActivateFn = (route, state) => {
  return true;
};
