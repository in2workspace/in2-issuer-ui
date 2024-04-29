import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ServeErrorInterceptor implements HttpInterceptor {
  public constructor(
    private alertService: AlertService,
    private translate: TranslateService
  ) {}

  public  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {

          errorMessage = `Error: ${error.error.message}`;
        } else {

          errorMessage = this.getServerErrorMessage(error);
        }

        this.alertService.showAlert(
          this.translate.instant(errorMessage),
          'error'
        );
        return throwError(() => error);
      })
    );
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404:
        return 'error.not_found';
      case 401:
        return 'error.unauthorized';
      case 403:
        return 'error.forbidden';
      case 500:
        return 'error.internal_server';
      default:
        return 'error.unknown_error';
    }
  }
}
