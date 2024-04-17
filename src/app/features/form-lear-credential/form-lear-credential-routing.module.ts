import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormLearCredentialComponent } from './form-lear-credential.component';

const routes: Routes = [
  {
    path: '',
    component: FormLearCredentialComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormLearCredentialRoutingModule { }
