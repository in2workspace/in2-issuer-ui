import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialManagementComponent } from './credential-management.component';
import { CredentialManagementRoutingModule } from './credential-management-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { CredentialDetailComponent } from './components/credential-detail/credential-detail.component';

@NgModule({
  declarations: [CredentialManagementComponent, CredentialDetailComponent],
  imports: [
    CommonModule,
    CredentialManagementRoutingModule,
    MaterialModule,
    FormsModule,
  ],
  exports: [CredentialManagementComponent, CredentialDetailComponent]
})
export class CredentialManagementModule {}

