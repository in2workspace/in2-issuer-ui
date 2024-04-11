import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { MaterialModule } from 'src/app/material.module';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, MaterialModule,LoginRoutingModule ],
  exports:[LoginComponent]
})
export class LoginModule {}
