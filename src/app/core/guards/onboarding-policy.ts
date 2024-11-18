import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const OnboardingPolicy = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasOnboardingExecutePower()) {
    console.info("OnboardingPolicy Guard OKEY!")
    return true;
  } else {
    console.error("OnboardingPolicy Guard NOT OKEY!")
    router.navigate(['/home']);
    return false;
  }
};
