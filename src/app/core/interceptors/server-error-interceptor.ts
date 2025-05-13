import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';

@Injectable()
export class ServeErrorInterceptor implements HttpInterceptor {
  private readonly dialog = inject(DialogWrapperService);
  private readonly translate = inject(TranslateService);

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string;
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = this.getServerErrorMessage(error);
        }
        const translatedMessage = this.translate.instant(errorMessage);
        this.dialog.openErrorInfoDialog(translatedMessage);
        
        return throwError(() => error);
      })
    );
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    console.log('getServerErrorMessage')
    console.log('error')
    console.log(error)
    console.log('error.status')
    console.log(error.status)
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
