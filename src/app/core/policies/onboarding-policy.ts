import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';import { TranslateService } from '@ngx-translate/core';
import { switchMap, take } from 'rxjs';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';

export const OnboardingPolicy = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dialog = inject(DialogWrapperService);
  const translate = inject(TranslateService);

  if (authService.hasOnboardingExecutePower()) {
    return true;
  } else {
    const errorTitle = translate.instant("error.policy.onboarding.title");
    const errorMessage = translate.instant("error.policy.onboarding.message");

    const dialogRef = dialog.openErrorInfoDialog(errorMessage, errorTitle);
    dialogRef.afterClosed().pipe(
      take(1),
      switchMap(() => authService.logout())
    ).subscribe(() => {
      router.navigate(['/home']).then(() => false);
    });
    
    return false;
  }
};
