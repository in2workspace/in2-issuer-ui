import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialIssuanceRoutingModule } from './credentialIssuance-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CredentialIssuanceComponent } from './credentialIssuance.component';

@NgModule({
  declarations: [CredentialIssuanceComponent],
  imports: [CommonModule, CredentialIssuanceRoutingModule, SharedModule],
})
export class CredentialIssuanceModule {}
