import { Routes } from '@angular/router';
import { CredentialManagementComponent } from './credential-management.component';
import { DetailFormComponent } from '../detail/components/detail-form/detail-form.component';

export default [
  {
    path: '',
    component: CredentialManagementComponent,
  },
  {
    path: 'details/:id',
    component: DetailFormComponent,
  },
] as Routes;
