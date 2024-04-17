import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormCredentialComponent } from './components/form-credential/form-credential.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FormCredentialComponent
  ],
  imports: [
    CommonModule,MaterialModule, FormsModule
  ],
  exports:[CommonModule,MaterialModule, FormsModule,FormCredentialComponent]
})
export class SharedModule { }
