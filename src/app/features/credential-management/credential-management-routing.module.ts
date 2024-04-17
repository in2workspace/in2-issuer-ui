import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CredentialManagementComponent } from './credential-management.component';


const routes: Routes = [
  {
    path: '',
    component: CredentialManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CredentialManagementRoutingModule { }
