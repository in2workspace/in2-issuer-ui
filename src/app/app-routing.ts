import { Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { CredentialOfferOnboardingComponent } from './features/credential-offer-onboarding/credential-offer-onboarding.component';
import { OnboardingPolicy } from "./core/policies/onboarding-policy";

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.routes').then(m => m.default)
  },
  {
    path: 'organization/credentials',
    loadChildren: () =>
      import(
        './features/credential-management/credential-management.routes'
      ).then((m) => m.default),
    canActivate: [AutoLoginPartialRoutesGuard,OnboardingPolicy],
  },
  {
    path: 'organization/credentials/create',
    loadChildren: () =>
      import('./features/credential-issuance/credential-issuance-routes').then(
        (m) => m.default
      ),
    canActivate: [AutoLoginPartialRoutesGuard,OnboardingPolicy],
  },
  {
    path: 'organization/credentials/create2/:id',
    loadChildren: () =>
      import('./features/credential-issuance/credential-issuance-routes').then(
        (m) => m.default
      ),
    canActivate: [AutoLoginPartialRoutesGuard,OnboardingPolicy],
  },
  {
    path: 'credential-offer',
    component:CredentialOfferOnboardingComponent,
  },
  {
    path: 'credential-offer-detail',
    loadChildren: () =>
      import('./features/credencial-offer/credencial-offer.routes').then(
        (m) => m.default
      ),
  },
  { path: '**', redirectTo: 'home' }
];