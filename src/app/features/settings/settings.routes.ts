import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import {CredentialIssuanceComponent} from '../credential-issuance/credential-issuance.component'
import{SignaturesComponent} from './signatures/signatures.component'
import { SignatureConfigResolver } from './resolvers/signature-config.resolver';

export default [ 
  { path: '', component: SettingsComponent,
    children: [
        { path: 'schemes', component: CredentialIssuanceComponent },
        { path: 'signatures', component: SignaturesComponent,
          resolve: { signatureData: SignatureConfigResolver
        }},
       
      ]
   },
] as Routes;

