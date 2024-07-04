import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { HomeComponent } from './features/home/home.component';
import { CallbackComponent } from './features/callback/callback.component';

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
    path: 'organization/credentials/create',
    loadChildren: () =>
      import('./features/credentialIssuance/credentialIssuance.module').then(
        (m) => m.CredentialIssuanceModule
      ),
    canActivate: [AutoLoginPartialRoutesGuard],
  },
  {
    path: 'organization/credentials/create2/:id',
    loadChildren: () =>
      import('./features/credentialIssuanceAdmin/credentialIssuanceAdmin.module').then(
        (m) => m.CredentialIssuanceAdminModule
      ),
    canActivate: [AutoLoginPartialRoutesGuard],
  },
  {
    path: 'credential-offer',
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
