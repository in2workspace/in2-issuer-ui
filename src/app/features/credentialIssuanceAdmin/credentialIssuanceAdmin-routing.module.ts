import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CredentialIssuanceAdminComponent } from './credentialIssuanceAdmin.component';

const routes: Routes = [
  {
    path: '',
    component: CredentialIssuanceAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CredentialIssuanceAdminRoutingModule { }
