import { Routes } from '@angular/router';
import { CredentialOfferStepperComponent } from './credential-offer-stepper/credential-offer-stepper.component';

export default [
  {
    path: ':activationCode',
    component: CredentialOfferStepperComponent
  },
] as Routes;
