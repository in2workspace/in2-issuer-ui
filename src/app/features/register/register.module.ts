import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule, RegisterRoutingModule, MaterialModule, FormsModule
  ]
})
export class RegisterModule { }
