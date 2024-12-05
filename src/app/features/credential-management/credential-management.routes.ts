import { Routes } from '@angular/router';
import { CredentialManagementComponent } from './credential-management.component';
import { CredentialDetailComponent } from '../credential-detail/credential-detail.component';

export default [
  {
    path: '',
    component: CredentialManagementComponent,
  },
  {
    path: 'details/:id',
    component: CredentialDetailComponent,
  },
] as Routes;
