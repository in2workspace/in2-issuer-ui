import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CredencialOfferComponent } from './credencial-offer.component';

const routes: Routes = [
  {
    path: '',
    component: CredencialOfferComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CredencialOfferRoutingModule { }
