import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialProcedure } from '../models/credentialProcedure.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CredentialProcedureService {

  private apiUrl = `${environment.base_url}${environment.api_base_url}`;
  private credentialOfferUrl = `${environment.base_url}${environment.credential_offer_url}`;

  public constructor(private http: HttpClient) { }

  public getCredentialProcedures(): Observable<CredentialProcedure[]> {
    return this.http.get<CredentialProcedure[]>(this.apiUrl);
  }

  public getCredentialProcedureById(procedureId: string): Observable<CredentialProcedure[]> {
    return this.http.get<CredentialProcedure[]>(`${this.apiUrl}?procedure_id=${procedureId}`);
  }

  public saveCredentialProcedure(credentialProcedure: CredentialProcedure): Observable<any> {
    return this.http.post(this.apiUrl, credentialProcedure);
  }

  public sendReminder(procedureId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${procedureId}/sendReminder`, {});
  }

  public getCredentialOffer(transactionCode: string): Observable<any> {
    return this.http.get<any>(`${this.credentialOfferUrl}/${transactionCode}`);
  }
}
