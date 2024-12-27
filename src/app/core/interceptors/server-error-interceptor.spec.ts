import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpResponse, HttpStatusCode, HttpRequest, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ServeErrorInterceptor } from './server-error-interceptor';
import { MatDialog } from '@angular/material/dialog';

describe('ServeErrorInterceptor', () => {
  let interceptor: ServeErrorInterceptor;

  let dialogServiceSpy: { open: jest.Mock };
  let translateServiceSpy: { instant: jest.Mock };
  let httpRequest: Partial<HttpRequest<any>>;
  let httpHandler: { handle: jest.Mock };

  beforeEach(() => {
    httpRequest = { url: 'mocked-url', method: 'GET' } as Partial<HttpRequest<any>>;
    httpHandler = { handle: jest.fn() };
    dialogServiceSpy = { open: jest.fn() };
    translateServiceSpy = { instant: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        ServeErrorInterceptor,
        { provide: MatDialog, useValue: dialogServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    });

    interceptor = TestBed.inject(ServeErrorInterceptor);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks(); 
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('when HttpErrorResponse is received', () => {
    it('should call showAlert with the proper message for 404 error', done => {
      const httpErrorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });

      httpHandler.handle.mockReturnValue(throwError(() => httpErrorResponse));
      translateServiceSpy.instant.mockReturnValue('error.not_found');

      interceptor.intercept(httpRequest as HttpRequest<any>, httpHandler).subscribe({
        next: () => fail('expected an error, not a response'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(404);
          expect(translateServiceSpy.instant).toHaveBeenCalledWith('error.not_found');
          expect(dialogServiceSpy.open).toHaveBeenCalledWith('error.not_found', 'error');
          done();
        }
      });
    });

    it('should call showAlert with the proper message for 401 error', done => {
      const httpErrorResponse = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });

      httpHandler.handle.mockReturnValue(throwError(() => httpErrorResponse));
      translateServiceSpy.instant.mockReturnValue('error.unauthorized');

      interceptor.intercept(httpRequest as HttpRequest<any>, httpHandler).subscribe({
        next: () => fail('expected an error, not a response'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(401);
          expect(translateServiceSpy.instant).toHaveBeenCalledWith('error.unauthorized');
          expect(dialogServiceSpy.open).toHaveBeenCalledWith('error.unauthorized', 'error');
          done();
        }
      });
    });

    it('should call showAlert with the proper message for 403 error', done => {
      const httpErrorResponse = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' });

      httpHandler.handle.mockReturnValue(throwError(() => httpErrorResponse));
      translateServiceSpy.instant.mockReturnValue('error.forbidden');

      interceptor.intercept(httpRequest as HttpRequest<any>, httpHandler).subscribe({
        next: () => fail('expected an error, not a response'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(403);
          expect(translateServiceSpy.instant).toHaveBeenCalledWith('error.forbidden');
          expect(dialogServiceSpy.open).toHaveBeenCalledWith('error.forbidden', 'error');
          done();
        }
      });
    });

    it('should call showAlert with the proper message for 500 error', done => {
      const httpErrorResponse = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });

      httpHandler.handle.mockReturnValue(throwError(() => httpErrorResponse));
      translateServiceSpy.instant.mockReturnValue('error.internal_server');

      interceptor.intercept(httpRequest as HttpRequest<any>, httpHandler).subscribe({
        next: () => fail('expected an error, not a response'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(500);
          expect(translateServiceSpy.instant).toHaveBeenCalledWith('error.internal_server');
          expect(dialogServiceSpy.open).toHaveBeenCalledWith('error.internal_server', 'error');
          done();
        }
      });
    });

    it('should call showAlert with the proper message for unknown error', done => {
      const httpErrorResponse = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });

      httpHandler.handle.mockReturnValue(throwError(() => httpErrorResponse));
      translateServiceSpy.instant.mockReturnValue('error.unknown_error');

      interceptor.intercept(httpRequest as HttpRequest<any>, httpHandler).subscribe({
        next: () => fail('expected an error, not a response'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(0);
          expect(translateServiceSpy.instant).toHaveBeenCalledWith('error.unknown_error');
          expect(dialogServiceSpy.open).toHaveBeenCalledWith('error.unknown_error', 'error');
          done();
        }
      });
    });
  });

  describe('when an empty body is received', () => {
    it('should handle an empty body response gracefully', done => {
      const httpResponse = new HttpResponse<unknown>({ body: null, status: HttpStatusCode.Ok });

      httpHandler.handle.mockReturnValue(of(httpResponse));
      translateServiceSpy.instant.mockReturnValue('Empty Body');

      interceptor.intercept(httpRequest as HttpRequest<any>, httpHandler).subscribe({
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
    it('should pass the response through', done => {
      const expectedBody = { message: 'Correct Body' };
      const httpResponse = new HttpResponse({ body: expectedBody, status: HttpStatusCode.Ok });

      httpHandler.handle.mockReturnValue(of(httpResponse));

      interceptor.intercept(httpRequest as HttpRequest<any>, httpHandler).subscribe({
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
