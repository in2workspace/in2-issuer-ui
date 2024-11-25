import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormCredentialComponent } from './components/form-credential/form-credential.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PowerComponent } from './components/power/power/power.component';
import { PopupComponent } from './components/popup/popup.component';
import {DialogComponent} from "./components/dialog/dialog.component";



@NgModule({
  declarations: [
    FormCredentialComponent,
    NavbarComponent,
    PowerComponent,
    PopupComponent,
    DialogComponent

  ],
  imports: [
    CommonModule, MaterialModule, FormsModule, RouterModule, TranslateModule, ReactiveFormsModule
  ],
  exports:[CommonModule,MaterialModule, FormsModule,FormCredentialComponent, NavbarComponent, PowerComponent, PopupComponent, DialogComponent],
})
export class SharedModule { }
