import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProcedureRequest } from '../models/dto/procedure-request.dto';
import { ProcedureResponse } from "../models/dto/procedure-response.dto";
import { LearCredentialEmployeeDataDetail } from "../models/dto/lear-credential-employee-data-detail.dto";

@Injectable({
  providedIn: 'root'
})
export class CredentialProcedureService {

  private readonly saveCredential = `${environment.base_url}${environment.save_credential}`;
  private readonly organizationProcedures = `${environment.base_url}${environment.procedures}`;
  private readonly credentialOfferUrl = `${environment.base_url}${environment.credential_offer_url}`;
  private readonly notificationProcedure =`${environment.base_url}${environment.notification}`;
  //private sendFirma = `${environment.base_url}${environment.firma_credential}`; The`sendFirma` variable has been commented out as it was initially intended for the signature functionality,which remains incomplete. This configuration is currently unnecessary for the existing flows but is expected to be reintroduced in the future when the related use case is implemented.

  private readonly http = inject(HttpClient);

  public getCredentialProcedures(): Observable<ProcedureResponse> {
    return this.http.get<ProcedureResponse>(this.organizationProcedures).pipe(
      catchError(this.handleError)
    );
  }

  public getCredentialProcedureById(procedureId: string): Observable<LearCredentialEmployeeDataDetail> {
    return this.http.get<LearCredentialEmployeeDataDetail>(`${this.organizationProcedures}/${procedureId}/credential-decoded`).pipe(
      catchError(this.handleError)
    );
  }

  public createProcedure(procedureRequest: ProcedureRequest): Observable<void> {

    return this.http.post<void>(this.saveCredential, procedureRequest).pipe(
      catchError(this.handleError)
    );
  }

  public sendReminder(procedureId: string): Observable<void> {
    return this.http.post<void>(`${this.notificationProcedure}/${procedureId}`,{} ).pipe(
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

  /**
    The `signCredential` method has been commented out as the implementation was initially started
    but left incomplete. Currently, this functionality is not required in the existing flows.
    However, it is expected to be revisited and fully implemented in the future when the use case demands it.
   **/
  // public signCredential(id: string): Observable<any> {
  //   return this.http.post(this.sendFirma, {'procedure-id':id}).pipe(
  //     catchError(this.handleError)
  //   );
  // }


}
