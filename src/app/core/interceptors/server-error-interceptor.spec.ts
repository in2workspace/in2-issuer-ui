import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { ServeErrorInterceptor } from './server-error-interceptor';
import { of, throwError } from 'rxjs';

describe('GIVEN ServerErrorsInterceptor', () => {
    let interceptor: ServeErrorInterceptor;
    let alertServiceMock;
    let translateSpy;
    let httpRequestSpy;
    let httpHandlerSpy;

    beforeEach(() => {
        alertServiceMock = jasmine.createSpyObj('AlertService', ['showAlert']);
        translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);

        httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['noMethod']);
        httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

        interceptor = new ServeErrorInterceptor(alertServiceMock, translateSpy);
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    describe('WHEN HttpErrorResponse is recived', () => {
        it('Should call showAlert on error with the proper message', (done: DoneFn) => {
            httpHandlerSpy.handle.and.returnValue(
                throwError(() => {
                    const error: HttpErrorResponse = new HttpErrorResponse({ status: 400, statusText: 'Not Found' });
                    return error;
                })
            );

            const expectedMessage = 'Error';
            translateSpy.instant.and.returnValue(expectedMessage);

            interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
                next(result) {
                    fail(`got result from test: ${result}`);
                },
                error(err: HttpErrorResponse) {
                    expect(err.statusText).toEqual('Not Found');
                    expect(translateSpy.instant).toHaveBeenCalled();
                    expect(alertServiceMock.showAlert).toHaveBeenCalledOnceWith(expectedMessage, 'error');
                    done();
                }
            });
        });
    });

    describe('WHEN empty body is recived', () => {
        it('Should call showAlert on error with the proper message', (done: DoneFn) => {
            const httpResponse: HttpResponse<unknown> = new HttpResponse<unknown>({
                body: null,
                status: HttpStatusCode.Ok
            });

            httpHandlerSpy.handle.and.returnValue(of(httpResponse));

            const expectedMessage = 'Empty Body';
            translateSpy.instant.and.returnValue(expectedMessage);

            interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
                next(result) {
                    fail(`got result from test: ${result}`);
                },
                error(err: HttpErrorResponse) {
                    expect(err.statusText).toEqual('Empty response, no body.');
                    expect(translateSpy.instant).toHaveBeenCalled();
                    expect(alertServiceMock.showAlert).toHaveBeenCalledOnceWith(expectedMessage, 'error');
                    done();
                }
            });
        });
    });

    describe('WHEN correct response is recived', () => {
        it('Should call showAlert on error with the proper message', (done: DoneFn) => {
            const expectedBody = { message: 'Correct Body' };

            const httpResponse: HttpResponse<unknown> = new HttpResponse<unknown>({
                body: expectedBody,
                status: HttpStatusCode.Ok
            });

            httpHandlerSpy.handle.and.returnValue(of(httpResponse));

            interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
                next(result: HttpResponse<unknown>) {
                    expect(result.body).toEqual(expectedBody);
                    done();
                },
                error(err: HttpErrorResponse) {
                    fail('There was an error on correct body');
                }
            });
        });
    });
});
