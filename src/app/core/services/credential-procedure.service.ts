import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ProcedureRequest} from '../models/dto/procedure-request.dto';
import {ProcedureResponse} from '../models/dto/procedure-response.dto';
import {LearCredentialEmployeeDataDetail} from '../models/dto/lear-credential-employee-data-detail.dto';
import {CredentialOfferResponse} from '../models/dto/credential-offer-response';
import {LEARCredentialEmployeeDataNormalizer} from '../models/entity/lear-credential-employee-data-normalizer';
import {LEARCredentialEmployee} from '../models/entity/lear-credential-employee.entity';
import {DialogWrapperService} from "../../shared/components/dialog/dialog-wrapper/dialog-wrapper.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class CredentialProcedureService {

  private readonly saveCredential = `${environment.base_url}${environment.save_credential}`;
  private readonly organizationProcedures = `${environment.base_url}${environment.procedures}`;
  private readonly credentialOfferUrl = `${environment.base_url}${environment.credential_offer_url}`;
  private readonly notificationProcedure = `${environment.base_url}${environment.notification}`;
  private readonly signCredentialUrl = `${environment.base_url}${environment.sign_credential_url}`;

  private readonly http = inject(HttpClient);
  private readonly normalizer = new LEARCredentialEmployeeDataNormalizer();
  private readonly dialog = inject(DialogWrapperService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

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
        const { credential } = learCredentialEmployeeDataDetail;
        // If vc exists, we normalize it, otherwise we assume that credential is already of the expected type
        const credentialData = credential.vc
          ? credential.vc
          : (credential as unknown as LEARCredentialEmployee);

        // Normalize the part which is of type LEARCredentialEmployee
        const normalizedCredential = this.normalizer.normalizeLearCredential(credentialData);

        return {
          ...learCredentialEmployeeDataDetail,
          credential: {
            ...credential,
            vc: normalizedCredential
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

  private handleError(error: HttpErrorResponse) {
    const errorDetail = error.error && error.error.message ? error.error.message : error.message;

    // If the error is a 503 and the message is 'Error during communication with the mail server', show a dialog
    if (error.status === 503 && errorDetail === 'Error during communication with the mail server') {
      const errorMessage = this.translate.instant('error.credentialIssuance.server_mail_error.message');
      const errorTitle = this.translate.instant('error.credentialIssuance.server_mail_error.title');
      this.dialog.openErrorInfoDialog(errorMessage, errorTitle);
      this.redirectToDashboard();
      return throwError(() => new Error(errorMessage));
    } else if (error.error instanceof ErrorEvent) {
      // Client-side error.
      console.error(`Client-side error: ${errorDetail}`);
      return throwError(() => new Error(`Client-side error: ${errorDetail}`));
    } else {
      // Server-side error.
      const defaultErrorMessage = `Server-side error: ${error.status} ${errorDetail}`;
      console.error('Error response body:', defaultErrorMessage);
      return throwError(() => new Error(defaultErrorMessage));
    }
  }
}
