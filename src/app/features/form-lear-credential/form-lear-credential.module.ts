import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLearCredentialComponent } from './form-lear-credential.component';
import { FormLearCredentialRoutingModule } from './form-lear-credential-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [FormLearCredentialComponent],
  imports: [CommonModule, FormLearCredentialRoutingModule, SharedModule],
})
export class FormLearCredentialModule {}
