import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DialogComponent } from "../../shared/components/dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";

export const OnboardingPolicy = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dialog = inject(MatDialog);

  if (authService.hasOnboardingExecutePower()) {
    return true;
  } else {
    const dialogRef = dialog.open(DialogComponent, {
      panelClass: 'custom-dialog-error'
    });
    dialogRef.afterClosed().subscribe(() => {
      authService.logout().subscribe(() => {
        router.navigate(['/home']).then(() => false);
      });
    });
    return false;
  }
};
