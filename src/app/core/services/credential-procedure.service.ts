import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map } from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ProcedureResponse} from '../models/dto/procedure-response.dto';
import {CredentialOfferResponse} from '../models/dto/credential-offer-response';
import {LEARCredential, LEARCredentialDataDetails, RawLEARCredentialDataDetail} from '../models/entity/lear-credential-employee.entity';
import {DialogWrapperService} from "../../shared/components/dialog/dialog-wrapper/dialog-wrapper.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {API} from "../constants/api.constants";
import { LEARCredentialDataNormalizer } from '../models/entity/lear-credential-employee-data-normalizer';
import { EmployeeProcedureRequest } from '../models/dto/procedure-request.dto';
import { mockCredentialCertification, mockCredentialEmployee, mockCredentialMachine } from '../mocks/detail-mocks';

@Injectable({
  providedIn: 'root'
})
export class CredentialProcedureService {

  private readonly saveCredential = `${environment.server_url}${API.SAVE_CREDENTIAL_PATH}`;
  private readonly organizationProcedures = `${environment.server_url}${API.PROCEDURES_PATH}`;
  private readonly credentialOfferUrl = `${environment.server_url}${API.CREDENTIAL_OFFER_PATH}`;
  private readonly notificationProcedure = `${environment.server_url}${API.NOTIFICATION_PATH}`;
  private readonly signCredentialUrl = `${environment.server_url}${API.SIGN_CREDENTIAL_PATH}`;

  private readonly http = inject(HttpClient);
  private readonly normalizer = new LEARCredentialDataNormalizer();
  private readonly dialog = inject(DialogWrapperService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  public getCredentialProcedures(): Observable<ProcedureResponse> {
    return this.http.get<ProcedureResponse>(this.organizationProcedures).pipe(
      catchError(this.handleError)
    );
  }

  public getCredentialProcedureById(procedureId: string): Observable<LEARCredentialDataDetails> {
    // return this.http.get<RawLEARCredentialDataDetail>(
    //   `${this.organizationProcedures}/${procedureId}/credential-decoded`
    // )
    //todo
    return of(mockCredentialEmployee)
    .pipe(
      map(response => {
        const { credential } = response;
        // If vc exists, we normalize it, otherwise we assume that credential is already of the expected type
        const credentialData = ('vc' in credential
          ? credential.vc
          : credential) as LEARCredential;

        // Normalize the part which is of type LEARCredentialEmployee
        const normalizedCredential = this.normalizer.normalizeLearCredential(credentialData);

        return {
          ...response,
          credential: {
            ...credential,
            vc: normalizedCredential
          }
        } as LEARCredentialDataDetails;
      }),
      catchError(this.handleError)
    );
  }

  public createProcedure(procedureRequest: EmployeeProcedureRequest): Observable<void> {
    return this.http.post<void>(this.saveCredential, procedureRequest).pipe(
      catchError(this.handleError)
    );
  }

  public sendReminder(procedureId: string): Observable<void> {
    return this.http.post<void>(`${this.notificationProcedure}/${procedureId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  public signCredential(procedureId: string): Observable<void> {
    return this.http.post<void>(`${this.signCredentialUrl}/${procedureId}`, {} ).pipe(
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

  public redirectToDashboard(): void{
    setTimeout(()=>{
      this.router.navigate(['/organization/credentials']);
    }, 0);
  }

  private readonly handleError = (error: HttpErrorResponse) => {
    let errorDetail: string;
    if (error.error && typeof error.error === 'object' && error.error.message) {
      errorDetail = error.error.message;
    } else if (error.error && typeof error.error === 'string') {
      errorDetail = error.error;
    } else {
      errorDetail = error.message;
    }

    console.log('handleError -> status:', error.status, 'errorDetail:', errorDetail);

    if (error.status === 503 && errorDetail.trim() === 'Error during communication with the mail server') {
      const errorMessage = this.translate.instant('error.serverMailError.message');
      const errorTitle = this.translate.instant('error.serverMailError.title');
      console.log('Translated errorMessage:', errorMessage);
      console.log('Translated errorTitle:', errorTitle);
      this.dialog.openErrorInfoDialog(errorMessage, errorTitle);
      this.redirectToDashboard();
      return throwError(() => new Error(errorMessage));
    } else if (error.error instanceof ErrorEvent) {
      console.error(`Client-side error: ${errorDetail}`);
      return throwError(() => new Error(`Client-side error: ${errorDetail}`));
    } else {
      const defaultErrorMessage = `Server-side error: ${error.status} ${errorDetail}`;
      console.error('Error response body:', defaultErrorMessage);
      return throwError(() => new Error(defaultErrorMessage));
    }
  }

}
