import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLearCredentialComponent } from './form-lear-credential.component';
import { FormLearCredentialRoutingModule } from './form-lear-credential-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormLearCredentialComponent],
  imports: [CommonModule, FormLearCredentialRoutingModule, MaterialModule, FormsModule],
})
export class FormLearCredentialModule {}
