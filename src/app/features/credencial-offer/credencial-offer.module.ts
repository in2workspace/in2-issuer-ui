import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredencialOfferRoutingModule } from './credencial-offer-routing.module';
import { CredencialOfferComponent } from './credencial-offer.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CredencialOfferComponent],
  imports: [
    CommonModule,
    CredencialOfferRoutingModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    SharedModule,
    TranslateModule
  ],
})
export class CredencialOfferModule {}
