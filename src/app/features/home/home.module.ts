import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { MaterialModule } from 'src/app/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { QRCodeModule } from 'angularx-qrcode';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule, HomeRoutingModule, MaterialModule, QRCodeModule
  ]
})
export class HomeModule { }
