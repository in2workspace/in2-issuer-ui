import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CredentialManagementComponent } from './credential-management.component';
import { CredentialDetailComponent } from './components/credential-detail/credential-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CredentialManagementComponent,
  },
  {
    path: 'details/:id',
    component: CredentialDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CredentialManagementRoutingModule {}
