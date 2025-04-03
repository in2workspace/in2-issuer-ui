import { Injectable, inject } from '@angular/core';
import {signatureConfigurationRequest, SignatureConfigTable, signatureConfigurationResponse} from '../models/signature.models';
import { SignatureConfigurationRepository } from './signatureConfiguration.repository';
import {  map, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignatureConfigurationService {
  private readonly repository= inject(SignatureConfigurationRepository);

  saveSignatureConfiguration(payloadSignature: signatureConfigurationRequest): Observable<void> {
    return this.repository.saveSignatureConfiguration(payloadSignature);
  }

  getAllConfiguration(): Observable<SignatureConfigTable[] | null> {
    return this.repository.getAllSignatureConfiguration().pipe(
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

  getSignatureConfigById(id:string): Observable<signatureConfigurationResponse > {
    return this.repository.getSignatureConfigById(id);
  }
  deleteSignatureConfiguration(id: string): Observable<void> {
    return this.repository.deleteSignatureConfiguration(id); 
 }

  updateConfiguration(config: Partial<signatureConfigurationRequest>): Observable<void> {
    return this.repository.updateSignatureConfiguration(config);
  } 

  addCredentialConfiguration(config: signatureConfigurationRequest): Observable<void> {
    return this.repository.addCredentialConfiguration(config);
  }


}
