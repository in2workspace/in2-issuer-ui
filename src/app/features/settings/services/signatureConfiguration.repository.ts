import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SignatureConfigTable, SignatureConfigurationRequest,SignatureConfigurationResponse, SignatureMode } from '../models/signature.models'
import {API_PATH} from 'src/app/core/constants/api-paths.constants';
import { environment } from 'src/environments/environment';
@Injectable({ providedIn: 'root' })
export class SignatureConfigurationRepository {
  private readonly http = inject(HttpClient);
  private readonly configurationUrl = environment.base_url+API_PATH.SIGNATURE_CONFIG;

  saveSignatureConfiguration(payload: SignatureConfigurationRequest): Observable<void> {
    return this.http.post<void>(this.configurationUrl, payload);
  }

  getSignatureConfigById(id:string):Observable<SignatureConfigurationResponse>{
    return this.http.get<SignatureConfigurationResponse>(this.configurationUrl+`/${id}`);
  }

  getAllSignatureConfiguration(signatureMode:SignatureMode): Observable<SignatureConfigTable []> {
    const params = new HttpParams().set('signatureMode', signatureMode);
    return this.http.get<SignatureConfigTable[]>(this.configurationUrl);
  }

  updateSignatureConfiguration(id:string, payload: Partial<SignatureConfigurationRequest>): Observable<void> {
    return this.http.patch<void>(this.configurationUrl+`/${id}`, payload); 
  }

 deleteSignatureConfiguration(id: string, rationale:string): Observable<void> {
    const params = new HttpParams().set('rationale', rationale);
    return this.http.delete<void>(this.configurationUrl+`/${id}`, { params }); 
    
  }

  addCredentialConfiguration(config: SignatureConfigurationRequest): Observable<void> {
    return this.http.post<void>(this.configurationUrl, config);
  }

}