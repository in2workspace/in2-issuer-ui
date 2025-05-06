import { Injectable, inject } from '@angular/core';
import {SignatureConfigurationRequest, SignatureConfigTable, SignatureConfigurationResponse, SignatureMode} from '../models/signature.models';
import { SignatureConfigurationRepository } from './signatureConfiguration.repository';
import {  map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignatureConfigurationService {
  private readonly repository= inject(SignatureConfigurationRepository);

  saveSignatureConfiguration(payloadSignature: SignatureConfigurationRequest): Observable<void> {
    return this.repository.saveSignatureConfiguration(payloadSignature);
  }

  getAllConfiguration(signatureMode:SignatureMode): Observable<SignatureConfigTable[] | null> {
    return this.repository.getAllSignatureConfiguration(signatureMode).pipe(
      map((config: any[]) => {
        if (!config || config.length === 0) {
          return null;
        }
  
        return config.map(item => ({
          id: item.id,
          cloudProviderName: item.cloudProviderName,
          credentialName: item.credentialName
        }));
      })
    );
  }

  getSignatureConfigById(id:string): Observable<SignatureConfigurationResponse > {
    return this.repository.getSignatureConfigById(id);
  }
  deleteSignatureConfiguration(id: string, rationale:string): Observable<void> {
    return this.repository.deleteSignatureConfiguration(id, rationale); 
 }

  updateConfiguration(id:string, config: Partial<SignatureConfigurationRequest>): Observable<void> {
    return this.repository.updateSignatureConfiguration(id, config);
  } 

  addCredentialConfiguration(config: SignatureConfigurationRequest): Observable<void> {
    return this.repository.addCredentialConfiguration(config);
  }


}
