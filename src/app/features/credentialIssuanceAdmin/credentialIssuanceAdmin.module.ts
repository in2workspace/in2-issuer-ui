import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialIssuanceAdminRoutingModule } from './credentialIssuanceAdmin-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CredentialIssuanceAdminComponent } from './credentialIssuanceAdmin.component';

@NgModule({
  declarations: [CredentialIssuanceAdminComponent],
  imports: [CommonModule, CredentialIssuanceAdminRoutingModule, SharedModule],
})
export class CredentialIssuanceAdminModule {}
