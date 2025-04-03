import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SignatureConfigTable, signatureConfigurationRequest,signatureConfigurationResponse } from '../models/signature.models'
import {API_PATH} from 'src/app/core/constants/api-paths.constants';
import { environment } from 'src/environments/environment';
@Injectable({ providedIn: 'root' })
export class SignatureConfigurationRepository {
  private readonly http = inject(HttpClient);
  private readonly configurationUrl = environment.base_url+API_PATH.SIGNATURE_CONFIG;

  saveSignatureConfiguration(payload: signatureConfigurationRequest): Observable<void> {
    return this.http.post<void>(this.configurationUrl, payload);
  }

  getSignatureConfigById(id:string):Observable<signatureConfigurationResponse>{
    return this.http.get<signatureConfigurationResponse>(this.configurationUrl+`/${id}`);
  }

  getAllSignatureConfiguration(): Observable<SignatureConfigTable []> {
    return this.http.get<SignatureConfigTable[]>(this.configurationUrl);
  }

  updateSignatureConfiguration(payload: Partial<signatureConfigurationRequest>): Observable<void> {
    return this.http.patch<void>(this.configurationUrl, payload); 
  }

 deleteSignatureConfiguration(id: string): Observable<void> {
    return this.http.delete<void>(this.configurationUrl+`/${id}`); 
  }

  addCredentialConfiguration(config: signatureConfigurationRequest): Observable<void> {
    return this.http.post<void>(this.configurationUrl, config);
  }

}