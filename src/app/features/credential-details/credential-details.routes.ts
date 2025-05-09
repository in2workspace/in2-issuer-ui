import { Routes } from '@angular/router';
import { CredentialDetailsComponent } from './credential-details.component';

const routes: Routes = [
  {
    path: ':id',
    component: CredentialDetailsComponent
  }
];

export default routes;
