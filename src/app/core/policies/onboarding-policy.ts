import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialog } from "@angular/material/dialog";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { DialogComponent, DialogDefaultContent } from 'src/app/shared/components/dialog/dialog.component';

export const OnboardingPolicy = () => {
  const authService = inject(AuthService);
  const oidcService = inject(OidcSecurityService);
  const router = inject(Router);
  const dialog = inject(MatDialog);

  if (authService.hasOnboardingExecutePower()) {
    return true;
  } else {
    const dialogContent: DialogDefaultContent = { 
      data: {
        title: `Access Denied`,
        message: `You do not have the required power to access`,
        isConfirmDialog: false,
        status: `error`
      }
    };

    const dialogRef = dialog.open(DialogComponent, dialogContent);
    dialogRef.afterClosed().subscribe(() => {
      oidcService.logoff()
      router.navigate(['/home']).then(() => false);
    });
    return false;
  }
};
