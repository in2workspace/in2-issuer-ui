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
    it('should call showAlert with the proper message', (done: DoneFn) => {
      const httpErrorResponse = new HttpErrorResponse({ status: 400, statusText: 'Bad Request' });

      httpHandler.handle.and.returnValue(throwError(() => httpErrorResponse));
      translateService.instant.and.returnValue('Error');

      interceptor.intercept(httpRequest, httpHandler).subscribe({
        next: () => fail('expected an error, not a response'),
        error: (err: HttpErrorResponse) => {
          expect(err.statusText).toBe('Bad Request');
          expect(translateService.instant).toHaveBeenCalled();
          expect(alertService.showAlert).toHaveBeenCalledWith('Error', 'error');
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
