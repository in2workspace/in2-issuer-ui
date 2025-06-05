import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {CredentialProcedureService} from './credential-procedure.service';
import {environment} from 'src/environments/environment';
import {HttpErrorResponse, provideHttpClient} from '@angular/common/http';

import {ProcedureResponse} from "../models/dto/procedure-response.dto";

import {throwError} from 'rxjs';
import {DialogWrapperService} from "../../shared/components/dialog/dialog-wrapper/dialog-wrapper.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {API} from "../constants/api.constants";
import { LEARCredentialDataDetails } from '../models/entity/lear-credential';
import { EmployeeProcedureRequest } from '../models/dto/procedure-request.dto';

const notFoundErrorResp = new HttpErrorResponse({
  error: '404 error',
  status: 404, statusText: 'Not Found'
});

const serverErrorResp = new HttpErrorResponse({
  error: '500 error',
  status: 500,
  statusText: 'Server Error'
});

describe('CredentialProcedureService', () => {
  let service: CredentialProcedureService;
  let httpMock: HttpTestingController;
  let dialogSpy: jest.Mocked<DialogWrapperService>;
  let translateSpy: jest.Mocked<TranslateService>;
  let routerSpy: jest.Mocked<Router>;
  const apiUrl = `${environment.server_url}${API.SAVE_CREDENTIAL_PATH}`;
  const proceduresURL = `${environment.server_url}${API.PROCEDURES_PATH}`;
  const notificationUrl = `${environment.server_url}${API.NOTIFICATION_PATH}`;
  const credentialOfferUrl = `${environment.server_url}${API.CREDENTIAL_OFFER_PATH}`;
  const signCredentialUrl = `${environment.server_url}${API.SIGN_CREDENTIAL_PATH}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [CredentialProcedureService,
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: DialogWrapperService, useValue: { openErrorInfoDialog: jest.fn(), openWarningDialog: jest.fn() } },
      { provide: TranslateService, useValue: { instant: jest.fn((key: string) => key) } },
      { provide: Router, useValue: { navigate: jest.fn() } }
    ]
});

    service = TestBed.inject(CredentialProcedureService);
    httpMock = TestBed.inject(HttpTestingController);
    dialogSpy = TestBed.inject(DialogWrapperService) as jest.Mocked<DialogWrapperService>;
    translateSpy = TestBed.inject(TranslateService) as jest.Mocked<TranslateService>;
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch credential procedures successfully', () => {
    const mockData: ProcedureResponse = {credential_procedures:[
      { credential_procedure:{procedure_id: '1', status: 'completed', subject: 'John Doe', updated: '2023-01-01', credential_type: 'LEARCredentialEmployee'}},
      { credential_procedure:{ procedure_id: '2', status: 'pending', subject: 'Jane Doe', updated: '2023-01-02', credential_type: 'VerifiableCertification'}}
    ]};

    service.getCredentialProcedures().subscribe(data => {
      expect(data.credential_procedures.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(proceduresURL);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should handle error when fetching credential procedures', () => {
    const errorResponse = notFoundErrorResp;

    service.getCredentialProcedures().subscribe({
      next: data => fail('should have failed with 404 error'),
      error: (error: string) => {
        expect(error).toContain('Server-side error: 404');
      }
  });

    const req = httpMock.expectOne(proceduresURL);
    req.flush('404 error', errorResponse);
  });

  it('should fetch credential procedure by id successfully', () => {
    const procedureId = '1';
    const mockData: LEARCredentialDataDetails =
      { procedure_id: '1', credential_status: 'VALID', credential: { mandatee: {}, mandator: {}, power: [] } as any }
    ;

    service.getCredentialProcedureById(procedureId).subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${proceduresURL}/${procedureId}/credential-decoded`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should handle error when fetching credential procedure by id', () => {
    const procedureId = '1';
    const errorResponse = notFoundErrorResp;

    service.getCredentialProcedureById(procedureId).subscribe(
      data => fail('should have failed with 404 error'),
      (error: string) => {
        expect(error).toContain('Server-side error: 404');
      }
    );

    const req = httpMock.expectOne(`${proceduresURL}/${procedureId}/credential-decoded`);
    req.flush('404 error', errorResponse);
  });

  it('should save credential procedure successfully', () => {
    const IssuanceRequestMock:EmployeeProcedureRequest = {
      schema: "LEARCredentialEmployee",
      format: "jwt_vc_json",
      payload: {
        mandatee: {
          firstName: '',
          lastName: '',
          email: '',
          nationality: ''
        }, mandator: {
          organizationIdentifier: '',
          organization: '',
          commonName: '',
          emailAddress: '',
          serialNumber: '',
          country: ''
        }, power: []
      },
      operation_mode: "S"
    };
    service.createProcedure(IssuanceRequestMock).subscribe(data => {
      expect(data).toEqual(IssuanceRequestMock);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(IssuanceRequestMock);
    req.flush(IssuanceRequestMock);
  });

  it('should handle error when saving credential procedure', () => {
    const IssuanceRequestMock:EmployeeProcedureRequest = {
      schema: "LEARCredentialEmployee",
      format: "jwt_vc_json",
      payload: {
        mandatee: {
          firstName: '',
          lastName: '',
          email: '',
          nationality: ''
        }, mandator: {
          organizationIdentifier: '',
          organization: '',
          commonName: '',
          emailAddress: '',
          serialNumber: '',
          country: ''
        }, power: []
      },
      operation_mode: "S"
    };
    const errorResponse = new HttpErrorResponse({
      error: '500 error',
      status: 500,
      statusText: 'Server Error'
    });

    service.createProcedure(IssuanceRequestMock).subscribe(
      data => fail('should have failed with 500 error'),
      (error: string) => {
        expect(error).toContain('Server-side error: 500');
      }
    );

    const req = httpMock.expectOne(apiUrl);
    req.flush('500 error', errorResponse);
  });

  it('should send reminder successfully', () => {
    const procedureId = '1';

    service.sendReminder(procedureId).subscribe(data => {
      expect(data).toBeTruthy();
    });

    const req = httpMock.expectOne(`${notificationUrl}/${procedureId}`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should sign credential successfully', () => {
    const procedureId = '1';

    service.signCredential(procedureId).subscribe(data => {
      expect(data).toBeTruthy();
    });

    const req = httpMock.expectOne(`${signCredentialUrl}/${procedureId}`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should handle error when sending reminder or signing credential', () => {
    const procedureId = '1';
    const errorResponse = new HttpErrorResponse({
      error: '500 error',
      status: 500,
      statusText: 'Server Error'
    });

    service.sendReminder(procedureId).subscribe(
      data => fail('should have failed with 500 error'),
      (error: string) => {
        expect(error).toContain('Server-side error: 500');
      }
    );

    service.signCredential(procedureId).subscribe(
      data => fail('should have failed with 500 error'),
      (error: string) => {
        expect(error).toContain('Server-side error: 500');
      }
    );

    const requests = httpMock.match(() => true);

    expect(requests.length).toBeGreaterThanOrEqual(2);

    requests.forEach((req) => {
      expect(req.request.method).toBe('POST');
      req.flush('500 error', errorResponse);
    });
  });

  describe('Get credential offer by activation code', () => {
  it('should get credential offer successfully', () => {
    const activationCode = 'abc123';
    const mockResponse = JSON.stringify({ qrCode: 'mockQRCode' });

    service.getCredentialOfferByActivationCode(activationCode).subscribe(data => {
      expect(data).toBe('mockQRCode');
    });

    const req = httpMock.expectOne(`${credentialOfferUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should return raw response if qrCode is not present in JSON response', () => {
    const activationCode = 'abc123';
    const mockResponse = JSON.stringify({});

    service.getCredentialOfferByActivationCode(activationCode).subscribe(data => {
      expect(data).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${credentialOfferUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should return raw response if JSON.parse fails', () => {
    const activationCode = 'abc123';
    const invalidJSONResponse = 'Invalid JSON string';

    service.getCredentialOfferByActivationCode(activationCode).subscribe(data => {
      expect(data).toBe(invalidJSONResponse);
    });

    const req = httpMock.expectOne(`${credentialOfferUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush(invalidJSONResponse);
  });


  });

describe('get credential offer by c-activation-code', () => {
  it('should handle error when getting credential offer by c code', () => {
    const cCode = 'abc123';
    const errorResponse = serverErrorResp;

    service.getCredentialOfferByCCode(cCode).subscribe(
      () => fail('should have failed with 500 error'),
      (error: string) => {
        expect(error).toContain('Server-side error: 500');
      }
    );

    const req = httpMock.expectOne(`${credentialOfferUrl}`);
    req.flush('500 error', errorResponse);
  });

  it('should return raw response when cCode is not present in getCredentialOffer', () => {
    const cCode = 'abc123';
    const mockResponse = 'raw response';

    service.getCredentialOfferByCCode(cCode).subscribe(data => {
      expect(data).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${credentialOfferUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});

  it('should return client-side error message if error is an ErrorEvent', () => {
    const mockErrorEvent = new ErrorEvent('Network error', {
      message: 'Client-side error occurred',
    });

    const mockErrorResponse = new HttpErrorResponse({
      error: mockErrorEvent,
      status: 403,
      statusText: 'Client-side error'
    });

    const errorMessage = service['handleError'](mockErrorResponse);

    errorMessage.subscribe({
      error: (error: string) => {
        expect(error).toBe('Client-side error: Client-side error occurred');
      }
    });
  });

  it('should return server-side error message if error is not an ErrorEvent', () => {

    const errorMessage = service['handleError'](serverErrorResp);

    errorMessage.subscribe({
      error: (error: string) => {
        expect(error).toBe('Server-side error: 500 Internal Server Error');
      }
    });
  });

  it('should handle sendReminder error for server mail error', () => {
    const procedureId = '1';
    const errorResponse = new HttpErrorResponse({
      error: { status: 503, message: 'Error during communication with the mail server' },
      status: 503,
      statusText: 'Service Unavailable',
      url: notificationUrl
    });

    service.sendReminder(procedureId).subscribe({
      next: () => fail('should have failed with a server mail error'),
      error: (err: HttpErrorResponse) => {
        expect(translateSpy.instant).toHaveBeenCalledWith('error.serverMailError.message');
        expect(dialogSpy.openErrorInfoDialog).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalled();
        expect(err).toEqual(errorResponse);
      }
    });

    const req = httpMock.expectOne(`${notificationUrl}/${procedureId}`);
    expect(req.request.method).toBe('POST');
    req.flush(
      { message: 'Error during communication with the mail server' },
      errorResponse
    );
  });

  describe('handleCredentialOfferError', () => {
    it('should show expired message and redirect on 404 error', () => {
      const error = new HttpErrorResponse({ status: 404, error: {} });
      const spy = jest.spyOn(service as any, 'redirectToDashboard');
  
      service['handleCredentialOfferError'](error).subscribe({
        error: err => {
          expect(translateSpy.instant).toHaveBeenCalledWith('error.credentialOffer.not-found');
          expect(dialogSpy.openErrorInfoDialog).toHaveBeenCalledWith('error.credentialOffer.not-found');
          expect(spy).toHaveBeenCalled();
          expect(err).toBe(error);
        }
      });
    });
  
    it('should show specific message and redirect on 409 error', () => {
      const error = new HttpErrorResponse({ status: 409, error: {} });
      const spy = jest.spyOn(service as any, 'redirectToDashboard');
  
      service['handleCredentialOfferError'](error).subscribe({
        error: err => {
          expect(dialogSpy.openErrorInfoDialog).toHaveBeenCalledWith('error.credentialOffer.conflict');
          expect(spy).toHaveBeenCalled();
          expect(err).toBe(error);
        }
      });
    });
  
    it('should show unexpected message and redirect on other errors', () => {
      const error = new HttpErrorResponse({ status: 500, error: {} });
      const spy = jest.spyOn(service as any, 'redirectToDashboard');
  
      service['handleCredentialOfferError'](error).subscribe({
        error: err => {
          expect(translateSpy.instant).toHaveBeenCalledWith('error.credentialOffer.unexpected');
          expect(dialogSpy.openErrorInfoDialog).toHaveBeenCalledWith('error.credentialOffer.unexpected');
          expect(spy).toHaveBeenCalled();
          expect(err).toBe(error);
        }
      });
    });
  });

  describe('getCredentialOfferByActivationCode', () => {
    it('should propagate error returned by handleCredentialOfferError', () => {
      const activationCode = 'test-code';
      const error = new HttpErrorResponse({ status: 404, error: {} });
  
      service.getCredentialOfferByActivationCode(activationCode).subscribe({
        next: () => fail('Expected error'),
        error: err => {
          expect(err).toBe(error);
        }
      });
  
      const req = httpMock.expectOne(`${credentialOfferUrl}`);
      req.flush({}, error);
    });
  });
  
  describe('getCredentialOfferByCCode', () => {
    it('should propagate error returned by handleCredentialOfferError', () => {
      const cCode = 'test-code';
      const error = new HttpErrorResponse({ status: 409, error: {} });
  
      service.getCredentialOfferByCCode(cCode).subscribe({
        next: () => fail('Expected error'),
        error: err => {
          expect(err).toBe(error);
        }
      });
  
      const req = httpMock.expectOne(`${credentialOfferUrl}`);
      req.flush({}, error);
    });
  });
  
  

});
