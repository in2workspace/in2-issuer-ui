import { Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import {basicGuard, settingsGuard} from './core/guards/accessLevel.guard'
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.routes').then(m => m.default)
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.routes').then(m => m.default),
    canActivate: [AutoLoginPartialRoutesGuard, settingsGuard],
  },
  {
    path: 'organization/credentials',
    loadChildren: () =>
      import(
        './features/credential-management/credential-management.routes'
        ).then((m) => m.default),
    canActivate: [AutoLoginPartialRoutesGuard, basicGuard],
  },
  {
    path: 'organization/credentials/create',
    loadChildren: () =>
      import('./features/credential-issuance/credential-issuance.routes').then(
        (m) => m.default
      ),
    canActivate: [AutoLoginPartialRoutesGuard, basicGuard],
  },
  {
    path: 'organization/credentials/create2/:id',
    loadChildren: () =>
      import('./features/credential-issuance/credential-issuance.routes').then(
        (m) => m.default
      ),
    canActivate: [AutoLoginPartialRoutesGuard, basicGuard],
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
