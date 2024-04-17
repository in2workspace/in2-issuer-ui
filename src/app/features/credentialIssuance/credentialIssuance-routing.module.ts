import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CredentialIssuanceComponent } from './credentialIssuance.component';

const routes: Routes = [
  {
    path: '',
    component: CredentialIssuanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CredentialIssuanceRoutingModule { }
