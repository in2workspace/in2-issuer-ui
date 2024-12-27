import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent, DialogDefaultContent } from 'src/app/shared/components/dialog/dialog.component';
import { TranslateService } from '@ngx-translate/core';

export const OnboardingPolicy = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dialog = inject(MatDialog);
  const translate = inject(TranslateService);

  if (authService.hasOnboardingExecutePower()) {
    return true;
  } else {
    const dialogContent: DialogDefaultContent = { 
      data: {
        title: translate.instant("policy.onboarding.title"),
        message: translate.instant("policy.onboarding.message"),
        isConfirmDialog: false,
        status: `error`
      }
    };

    const dialogRef = dialog.open(DialogComponent, dialogContent);
    dialogRef.afterClosed().subscribe(() => {
      authService.logout().subscribe(() => {
        router.navigate(['/home']).then(() => false);
      });
    });
    return false;
  }
};
