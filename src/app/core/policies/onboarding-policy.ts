import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {OidcSecurityService} from "angular-auth-oidc-client";

export const OnboardingPolicy = () => {
  const authService = inject(AuthService);
  const oidcService = inject(OidcSecurityService);
  const router = inject(Router);
  const dialog = inject(MatDialog);

  if (authService.hasOnboardingExecutePower()) {
    console.info("OnboardingPolicy Guard OKEY!")
    return true;
  } else {
    console.error("OnboardingPolicy Guard NOT OKEY!")

    const dialogRef = dialog.open(DialogComponent, {
      panelClass: 'custom-dialog-error'
    });

    dialogRef.afterClosed().subscribe(() => {
      oidcService.logoff()
      router.navigate(['/home']).then(r => false);
    });

    return false;
  }
};
