
import { Routes } from '@angular/router';
import { CredentialIssuanceComponent } from "./credential-issuance.component";

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