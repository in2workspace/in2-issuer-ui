import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialManagementComponent } from './credential-management.component';
import { CredentialManagementRoutingModule } from './credential-management-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CredentialManagementComponent],
  imports: [
    CommonModule,
    CredentialManagementRoutingModule,
    MaterialModule,
    FormsModule,
  ],
})
export class CredentialManagementModule {}
