import { Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { OnboardingPolicy } from "./core/policies/onboarding-policy";
import { CredentialOfferStepperComponent } from './features/credential-offer/credential-offer-stepper/credential-offer-stepper.component';
import { CredentialManagementComponent } from './features/credential-management/credential-management.component';
import { CredentialDetailComponent } from './features/credential-detail/credential-detail.component';
import { FormCredentialComponent } from './shared/components/form-credential/form-credential.component';
import { CredentialOfferOnboardingComponent } from './features/credential-offer/credential-offer-steps/credential-offer-onboarding/credential-offer-onboarding.component';
import { CredentialOfferComponent } from './features/credential-offer/credential-offer-steps/credential-offer/credential-offer.component';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    // loadChildren: () => import('./features/home/home.routes').then(m => m.default)
    component: CredentialOfferStepperComponent
  },
  {
    path: 'organization/credentials',
    loadChildren: () =>
      import(
        './features/credential-management/credential-management.routes'
        ).then((m) => m.default),
    canActivate: [AutoLoginPartialRoutesGuard, OnboardingPolicy],
  },
  {
    path: 'organization/credentials/create',
    loadChildren: () =>
      import('./features/credential-issuance/credential-issuance.routes').then(
        (m) => m.default
      ),
    canActivate: [AutoLoginPartialRoutesGuard, OnboardingPolicy],
  },
  {
    path: 'organization/credentials/create2/:id',
    loadChildren: () =>
      import('./features/credential-issuance/credential-issuance.routes').then(
        (m) => m.default
      ),
    canActivate: [AutoLoginPartialRoutesGuard, OnboardingPolicy],
  },
  {
    path: 'credential-offer',
    loadChildren: () =>
      import('./features/credential-offer/credential-offer.routes').then(
        (m) => m.default
      ),
  },
  { path: '**', redirectTo: 'home' }
];
