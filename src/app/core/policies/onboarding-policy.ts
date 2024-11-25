import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

export const OnboardingPolicy = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dialog = inject(MatDialog);

  if (authService.hasOnboardingExecutePower()) {
    console.info("OnboardingPolicy Guard OKEY!")
    return true;
  } else {
    console.error("OnboardingPolicy Guard NOT OKEY!")

    const dialogRef = dialog.open(DialogComponent, {
      data: { message: 'You do not have the required permissions to access Onboarding.' },
      disableClose: true  // Prevents closing until the user acknowledges
    });

    dialogRef.afterClosed().subscribe(() => {
      router.navigate(['/home']).then(r => false);
    });

    return false;
  }
};
