import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpResponse, HttpStatusCode, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ServeErrorInterceptor } from './server-error-interceptor';

describe('ServeErrorInterceptor', () => {
  let interceptor: ServeErrorInterceptor;
  let alertService: jasmine.SpyObj<AlertService>;
  let translateService: jasmine.SpyObj<TranslateService>;
  let httpRequest: jasmine.SpyObj<HttpRequest<any>>;
  let httpHandler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showAlert']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['noMethod']);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        ServeErrorInterceptor,
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    });

    interceptor = TestBed.inject(ServeErrorInterceptor);
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    httpRequest = httpRequestSpy;
    httpHandler = httpHandlerSpy;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('when HttpErrorResponse is received', () => {
    it('should call showAlert with the proper message for 404 error', (done: DoneFn) => {
      const httpErrorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });

      httpHandler.handle.and.returnValue(throwError(() => httpErrorResponse));
      translateService.instant.and.returnValue('error.not_found');

      interceptor.intercept(httpRequest, httpHandler).subscribe({
        next: () => fail('expected an error, not a response'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(404);
          expect(translateService.instant).toHaveBeenCalledWith('error.not_found');
          expect(alertService.showAlert).toHaveBeenCalledWith('error.not_found', 'error');
          done();
        }
      });
    });

    it('should call showAlert with the proper message for 401 error', (done: DoneFn) => {
      const httpErrorResponse = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });

      httpHandler.handle.and.returnValue(throwError(() => httpErrorResponse));
      translateService.instant.and.returnValue('error.unauthorized');

      interceptor.intercept(httpRequest, httpHandler).subscribe({
        next: () => fail('expected an error, not a response'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(401);
          expect(translateService.instant).toHaveBeenCalledWith('error.unauthorized');
          expect(alertService.showAlert).toHaveBeenCalledWith('error.unauthorized', 'error');
          done();
        }
      });
    });

    it('should call showAlert with the proper message for 403 error', (done: DoneFn) => {
      const httpErrorResponse = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' });

      httpHandler.handle.and.returnValue(throwError(() => httpErrorResponse));
      translateService.instant.and.returnValue('error.forbidden');

      interceptor.intercept(httpRequest, httpHandler).subscribe({
        next: () => fail('expected an error, not a response'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(403);
          expect(translateService.instant).toHaveBeenCalledWith('error.forbidden');
          expect(alertService.showAlert).toHaveBeenCalledWith('error.forbidden', 'error');
          done();
        }
      });
    });

    it('should call showAlert with the proper message for 500 error', (done: DoneFn) => {
      const httpErrorResponse = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });

      httpHandler.handle.and.returnValue(throwError(() => httpErrorResponse));
      translateService.instant.and.returnValue('error.internal_server');

      interceptor.intercept(httpRequest, httpHandler).subscribe({
        next: () => fail('expected an error, not a response'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(500);
          expect(translateService.instant).toHaveBeenCalledWith('error.internal_server');
          expect(alertService.showAlert).toHaveBeenCalledWith('error.internal_server', 'error');
          done();
        }
      });
    });

    it('should call showAlert with the proper message for unknown error', (done: DoneFn) => {
      const httpErrorResponse = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });

      httpHandler.handle.and.returnValue(throwError(() => httpErrorResponse));
      translateService.instant.and.returnValue('error.unknown_error');

      interceptor.intercept(httpRequest, httpHandler).subscribe({
        next: () => fail('expected an error, not a response'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(0);
          expect(translateService.instant).toHaveBeenCalledWith('error.unknown_error');
          expect(alertService.showAlert).toHaveBeenCalledWith('error.unknown_error', 'error');
          done();
        }
      });
    });
  });

  describe('when an empty body is received', () => {
    it('should handle an empty body response gracefully', (done: DoneFn) => {
      const httpResponse = new HttpResponse<unknown>({ body: null, status: HttpStatusCode.Ok });

      httpHandler.handle.and.returnValue(of(httpResponse));
      translateService.instant.and.returnValue('Empty Body');

      interceptor.intercept(httpRequest, httpHandler).subscribe({
        next: (result: HttpEvent<unknown>) => {
          if (result instanceof HttpResponse) {
            expect(result.body).toBeNull();
            done();
          }
        },
        error: () => fail('expected a response, not an error')
      });
    });
  });

  describe('when a correct response is received', () => {
    it('should pass the response through', (done: DoneFn) => {
      const expectedBody = { message: 'Correct Body' };
      const httpResponse = new HttpResponse({ body: expectedBody, status: HttpStatusCode.Ok });

      httpHandler.handle.and.returnValue(of(httpResponse));

      interceptor.intercept(httpRequest, httpHandler).subscribe({
        next: (result: HttpEvent<unknown>) => {
          if (result instanceof HttpResponse) {
            expect(result.body).toEqual(expectedBody);
            done();
          }
        },
        error: () => fail('expected a response, not an error')
      });
    });
  });
});
