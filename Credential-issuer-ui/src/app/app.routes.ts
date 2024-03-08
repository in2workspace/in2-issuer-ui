import { Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

export const routes: Routes = [
  {
    path: 'home',
    canActivate: [AutoLoginPartialRoutesGuard],
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {path: 'callback',
  loadComponent: () => import('./callback/callback.page').then((m) => m.CallbackPage)
  },
  {path: 'user-info',
  canActivate: [AutoLoginPartialRoutesGuard],
  loadComponent: () =>
    import('./info/info.page').then(
      (m) => m.InfoPage
    )}
];
