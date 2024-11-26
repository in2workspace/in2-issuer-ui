import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { MaterialModule } from 'src/app/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { QRCodeModule } from 'angularx-qrcode';
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {SharedModule} from "../../shared/shared.module";
import {TranslateModule, TranslatePipe} from "@ngx-translate/core";



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule, HomeRoutingModule, MaterialModule, QRCodeModule, SharedModule, TranslateModule
  ],
  providers: [DialogComponent]
})
export class HomeModule { }
