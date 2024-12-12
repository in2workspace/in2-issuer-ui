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
import { DialogComponent } from "./components/dialog/dialog.component";
import { MaxLengthDirective } from './directives/validators/max-length-directive.directive';
import { CustomEmailValidatorDirective } from './directives/validators/custom-email-validator.directive';
import { UnicodeValidatorDirective } from './directives/validators/unicode-validator.directive';
import { OrganizationNameValidatorDirective } from './directives/validators/organization-name.validator.directive';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { OrganizationIdentifierValidatorDirective } from './directives/validators/organization-identifier.directive';
import {
  CertificationCredentialComponent
} from "../features/credential-management/components/certification/certification-credential-component";



@NgModule({
  declarations: [
    FormCredentialComponent,
    CertificationCredentialComponent,
    NavbarComponent,
    PowerComponent,
    PopupComponent,
    MaxLengthDirective,
    DialogComponent,
    ConfirmDialogComponent,
    CustomEmailValidatorDirective,
    UnicodeValidatorDirective,
    OrganizationNameValidatorDirective,
    OrganizationIdentifierValidatorDirective
  ],
  imports: [
    CommonModule, MaterialModule, FormsModule, RouterModule, TranslateModule, ReactiveFormsModule
  ],
  exports: [CommonModule, MaterialModule, FormsModule, FormCredentialComponent, NavbarComponent, PowerComponent, PopupComponent, DialogComponent, CertificationCredentialComponent]
})
export class SharedModule { }
