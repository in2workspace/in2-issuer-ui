import { Routes } from '@angular/router';
import { CredentialManagementComponent } from './credential-management.component';
import { CredentialDetailsComponent } from '../credential-details/credential-details.component';

export default [
  {
    path: '',
    component: CredentialManagementComponent,
  },
  {
    path: 'details/:id',
    component: CredentialDetailsComponent,
  },
] as Routes;
