import { Routes } from '@angular/router';
import { CredentialIssuanceComponent } from './credentialIssuance.component';

export default [
  {
    path: '',
    component: CredentialIssuanceComponent,
  },
  {
    path: ':id',
    component: CredentialIssuanceComponent,
  },
] as Routes;
