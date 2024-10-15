import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { HomeComponent } from './features/home/home.component';
import { CallbackComponent } from './features/callback/callback.component';
import { CredentialOfferOnboardingComponent } from './features/credential-offer-onboarding/credential-offer-onboarding.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  {
    path: 'organization/credentials',
    loadChildren: () =>
      import(
        './features/credential-management/credential-management.module'
      ).then((m) => m.CredentialManagementModule),
    canActivate: [AutoLoginPartialRoutesGuard],
  },
  {
    path: 'organization/credentials/createCredential',
    loadChildren: () =>
      import('./features/credentialIssuance/credentialIssuance.module').then(
        (m) => m.CredentialIssuanceModule
      ),
    canActivate: [AutoLoginPartialRoutesGuard],
  },
  {
    path: 'organization/credentials/createCredentialAsSigner',
    loadChildren: () =>
      import('./features/credentialIssuance/credentialIssuance.module').then(
        (m) => m.CredentialIssuanceModule
      ),
    canActivate: [AutoLoginPartialRoutesGuard],
  },
  {
    path: 'credential-offer',
    component:CredentialOfferOnboardingComponent,


  },
  {
    path: 'credential-offer-detail',
    loadChildren: () =>
      import('./features/credencial-offer/credencial-offer.module').then(
        (m) => m.CredencialOfferModule
      ),

  },
  { path: 'callback', component: CallbackComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
