import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProcedureRequest } from '../models/dto/procedure-request.dto';
import { ProcedureResponse } from '../models/dto/procedure-response.dto';
import { LearCredentialEmployeeDataDetail } from '../models/dto/lear-credential-employee-data-detail.dto';
import { CredentialOfferResponse } from '../models/dto/credential-offer-response';
import { LEARCredentialEmployeeDataNormalizer } from '../models/entity/lear-credential-employee-data-normalizer';
import { API_PATH } from '../constants/api-paths.constants';

@Injectable({
  providedIn: 'root'
})
export class CredentialProcedureService {

  private readonly saveCredential = `${environment.server_url}${API_PATH.SAVE_CREDENTIAL}`;
  private readonly organizationProcedures = `${environment.server_url}${API_PATH.PROCEDURES}`;
  private readonly credentialOfferUrl = `${environment.server_url}${API_PATH.CREDENTIAL_OFFER}`;
  private readonly notificationProcedure = `${environment.server_url}${API_PATH.NOTIFICATION}`;
  private readonly http = inject(HttpClient);
  private readonly normalizer = new LEARCredentialEmployeeDataNormalizer();

  public getCredentialProcedures(): Observable<ProcedureResponse> {
    return this.http.get<ProcedureResponse>(this.organizationProcedures).pipe(
      catchError(this.handleError)
    );
  }

  public getCredentialProcedureById(procedureId: string): Observable<LearCredentialEmployeeDataDetail> {
    return this.http.get<LearCredentialEmployeeDataDetail>(
      `${this.organizationProcedures}/${procedureId}/credential-decoded`
    ).pipe(
      map(learCredentialEmployeeDataDetail => {
        // Normalize the vc part which is of type LEARCredentialEmployee
        const normalizedLearCredentialEmployee = this.normalizer.normalizeLearCredential(learCredentialEmployeeDataDetail.credential.vc);
        // Rebuild the object, keeping the rest intact
        return {
          ...learCredentialEmployeeDataDetail,
          credential: {
            ...learCredentialEmployeeDataDetail.credential,
            vc: normalizedLearCredentialEmployee
          }
        } as LearCredentialEmployeeDataDetail;
      }),
      catchError(this.handleError)
    );
  }


  public createProcedure(procedureRequest: ProcedureRequest): Observable<void> {
    return this.http.post<void>(this.saveCredential, procedureRequest).pipe(
      catchError(this.handleError)
    );
  }

  public sendReminder(procedureId: string): Observable<void> {
    return this.http.post<void>(`${this.notificationProcedure}/${procedureId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  public getCredentialOfferByTransactionCode(transactionCode: string): Observable<CredentialOfferResponse> {
    console.info('Getting credential offer by transaction code: ' + transactionCode);
    return this.http.get<CredentialOfferResponse>(`${this.credentialOfferUrl}/transaction-code/${transactionCode}`).pipe(
      catchError(this.handleError)
    );
  }

  public getCredentialOfferByCTransactionCode(cTransactionCode: string): Observable<CredentialOfferResponse> {
    console.info('Refreshing QR code: getting credential offer by c-transaction code: ' + cTransactionCode);
    return this.http.get<CredentialOfferResponse>(`${this.credentialOfferUrl}/c-transaction-code/${cTransactionCode}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    console.error('Error response body:', errorMessage);
    return throwError(() => error);
  }
}
