import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
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
      data: { messageKey: 'power.invalid_power_message'  },
      panelClass: 'custom-dialog-error',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      router.navigate(['/home']).then(r => false);
    });

    return false;
  }
};
