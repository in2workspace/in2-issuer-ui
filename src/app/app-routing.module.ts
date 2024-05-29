import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'credentialManagement',
    loadChildren: () =>
      import(
        './features/credential-management/credential-management.module'
      ).then((m) => m.CredentialManagementModule),
  },
  {
    path: 'credentialIssuance',
    loadChildren: () =>
      import('./features/credentialIssuance/credentialIssuance.module').then(
        (m) => m.CredentialIssuanceModule
      ),
  },
  {
    path: 'credential-offer',
    loadChildren: () =>
      import('./features/credencial-offer/credencial-offer.module').then(
        (m) => m.CredencialOfferModule
      ),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
