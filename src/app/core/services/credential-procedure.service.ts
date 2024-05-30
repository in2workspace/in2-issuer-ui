import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CredentialProcedure } from '../models/credentialProcedure.interface';

@Injectable({
  providedIn: 'root'
})
export class CredentialProcedureService {

  private apiUrl = `${environment.base_url}${environment.api_base_url}`;
  private credentialOfferUrl = `${environment.base_url}${environment.credential_offer_url}`;
  private proceduresURL : string = `${environment.base_url}${environment.procedures_path}`;

  public constructor(private http: HttpClient) { }

  public getCredentialProcedures(): Observable<CredentialProcedure[]> {
    return this.http.get<CredentialProcedure[]>(this.proceduresURL).pipe(
      catchError(this.handleError)
    );
  }

  public getCredentialProcedureById(procedureId: string): Observable<CredentialProcedure[]> {
    return this.http.get<CredentialProcedure[]>(`${this.proceduresURL}/${procedureId}/credential-decoded`).pipe(
      catchError(this.handleError)
    );
  }

  public saveCredentialProcedure(credentialProcedure: CredentialProcedure): Observable<any> {
    return this.http.post(this.apiUrl, credentialProcedure).pipe(
      catchError(this.handleError)
    );
  }

  public sendReminder(procedureId: string): Observable<any> {
    return this.http.post(`${this.proceduresURL}/${procedureId}/sendReminder`, {}).pipe(
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
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    console.error('Error response body:', error.error);
    return throwError(errorMessage);
  }
}
