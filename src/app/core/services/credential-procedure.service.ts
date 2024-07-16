import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CredentialProcedure, CredentialProcedureResponse,CredentialData } from '../models/credentialProcedure.interface';

@Injectable({
  providedIn: 'root'
})
export class CredentialProcedureService {

  private saveCredential = `${environment.base_url}${environment.save_credential}`;
  private sendFirma = `${environment.base_url}${environment.firma_credential}`;
  private organizationProcedures = `${environment.base_url}${environment.procedures}`;
  private credentialOfferUrl = `${environment.base_url}${environment.credential_offer_url}`;
  private notificationProcedure =`${environment.base_url}${environment.notification}`;
  public constructor(private http: HttpClient) { }

  public getCredentialProcedures(): Observable<CredentialProcedureResponse> {
    return this.http.get<CredentialProcedureResponse>(this.organizationProcedures).pipe(
      catchError(this.handleError)
    );
  }

  public getCredentialProcedureById(procedureId: string): Observable<CredentialData> {
    return this.http.get<CredentialData>(`${this.organizationProcedures}/${procedureId}/credential-decoded`).pipe(
      catchError(this.handleError)
    );
  }

  public saveCredentialProcedure(credentialProcedure: CredentialProcedure): Observable<any> {
    return this.http.post(this.saveCredential, credentialProcedure).pipe(
      catchError(this.handleError)
    );
  }

  public sendReminder(procedureId: string): Observable<any> {
    return this.http.post(`${this.notificationProcedure}/${procedureId}`,{} ).pipe(
      catchError(this.handleError)
    );
  }

  public getCredentialOffer(transactionCode: string): Observable<string> {
    return this.http.get(`${this.credentialOfferUrl}/transaction-code/${transactionCode}`, { responseType: 'text' }).pipe(
      map(response => {
        try {
          const jsonResponse = JSON.parse(response);
          return jsonResponse.qrCode || response;
        } catch (e) {
          return response;
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    console.error('Error response body:', error.error);
    return throwError(()=>errorMessage);
  }
  public signCredential(id: string): Observable<any> {
    return this.http.post(this.sendFirma, {'procedure-id':id}).pipe(
      catchError(this.handleError)
    );
  }

}
