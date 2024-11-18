import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const OnboardingGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasOnboardingExecutePower()) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
