import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CredentialProcedureService } from './credential-procedure.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ProcedureRequest } from '../models/dto/procedure-request.dto';
import { ProcedureResponse } from "../models/dto/procedure-response.dto";
import { LearCredentialEmployeeDataDetail } from "../models/dto/lear-credential-employee-data-detail.dto";
import { throwError } from 'rxjs';

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
  const apiUrl = `${environment.base_url}${environment.save_credential}`;
  const proceduresURL = `${environment.base_url}${environment.procedures}`;
  const notificationUrl = `${environment.base_url}${environment.notification}`;
  const credentialOfferUrl = `${environment.base_url}${environment.credential_offer_url}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [CredentialProcedureService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(CredentialProcedureService);
    httpMock = TestBed.inject(HttpTestingController);
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
    const mockData: LearCredentialEmployeeDataDetail =
      { procedure_id: '1', credential_status: 'completed', credential: { mandatee: {}, mandator: {}, power: [] } as any }
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
    const IssuanceRequestMock:ProcedureRequest = {
      schema: "LEARCredentialEmployee",
      format: "jwt_vc_json",
      payload: {
        mandatee: {
          first_name: '',
          last_name: '',
          email: '',
          mobile_phone: ''
        }, mandator: {
          organizationIdentifier: '',
          organization: '',
          commonName: '',
          emailAddress: '',
          serialNumber: '',
          country: ''
        }, power: [],
        signer: {
          commonName: '',
          country: '',
          emailAddress: '',
          organization: '',
          organizationIdentifier: '',
          serialNumber: ''
        }
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
    const IssuanceRequestMock:ProcedureRequest = {
      schema: "LEARCredentialEmployee",
      format: "jwt_vc_json",
      payload: {
        mandatee: {
          first_name: '',
          last_name: '',
          email: '',
          mobile_phone: ''
        }, mandator: {
          organizationIdentifier: '',
          organization: '',
          commonName: '',
          emailAddress: '',
          serialNumber: '',
          country: ''
        }, power: [],
        signer: {
          commonName: '',
          country: '',
          emailAddress: '',
          organization: '',
          organizationIdentifier: '',
          serialNumber: ''
        }
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

  it('should handle error when sending reminder', () => {
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

    const req = httpMock.expectOne(`${notificationUrl}/${procedureId}`);
    req.flush('500 error', errorResponse);
  });

  describe('Get credential offer by transaction code', () => {
  it('should get credential offer successfully', () => {
    const transactionCode = 'abc123';
    const mockResponse = JSON.stringify({ qrCode: 'mockQRCode' });

    service.getCredentialOfferByTransactionCode(transactionCode).subscribe(data => {
      expect(data).toBe('mockQRCode');
    });

    const req = httpMock.expectOne(`${credentialOfferUrl}/transaction-code/${transactionCode}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return raw response if qrCode is not present in JSON response', () => {
    const transactionCode = 'abc123';
    const mockResponse = JSON.stringify({});

    service.getCredentialOfferByTransactionCode(transactionCode).subscribe(data => {
      expect(data).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${credentialOfferUrl}/transaction-code/${transactionCode}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return raw response if JSON.parse fails', () => {
    const transactionCode = 'abc123';
    const invalidJSONResponse = 'Invalid JSON string';

    service.getCredentialOfferByTransactionCode(transactionCode).subscribe(data => {
      expect(data).toBe(invalidJSONResponse);
    });

    const req = httpMock.expectOne(`${credentialOfferUrl}/transaction-code/${transactionCode}`);
    expect(req.request.method).toBe('GET');
    req.flush(invalidJSONResponse);
  });

  it('should handle error when getCredentialOfferByTransactionCode fails', (done) => {
    const transactionCode = 'invalid-code';
    const errorResponse = { status: 404, message: 'Not Found' };
  
    jest.spyOn(service['http'], 'get').mockReturnValue(throwError(() => errorResponse));
  
    service.getCredentialOfferByTransactionCode(transactionCode).subscribe({
      next: () => {
        // No hauria d'arribar aquí
        fail('Expected an error, but got a success response');
      },
      error: (error) => {
        expect(error).toEqual(errorResponse);
        done(); 
      }
    });
  });
});
  
describe('get credential offer by c-code', () => {
  it('should handle error when getting credential offer by c code', () => {
    const transactionCode = 'abc123';
    const errorResponse = serverErrorResp;

    service.getCredentialOfferByCTransactionCode(transactionCode).subscribe(
      () => fail('should have failed with 500 error'),
      (error: string) => {
        expect(error).toContain('Server-side error: 500');
      }
    );

    const req = httpMock.expectOne(`${credentialOfferUrl}/c-transaction-code/${transactionCode}`);
    req.flush('500 error', errorResponse);
  });

  it('should return raw response when qrCode is not present in getCredentialOffer', () => {
    const transactionCode = 'abc123';
    const mockResponse = 'raw response';

    service.getCredentialOfferByCTransactionCode(transactionCode).subscribe(data => {
      expect(data).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${credentialOfferUrl}/c-transaction-code/${transactionCode}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error when getCredentialOfferByCTransactionCode fails', (done) => {
    const transactionCode = 'invalid-code';
    const errorResponse = { status: 404, message: 'Not Found' };
  
    jest.spyOn(service['http'], 'get').mockReturnValue(throwError(() => errorResponse));
  
    service.getCredentialOfferByCTransactionCode(transactionCode).subscribe({
      next: () => {
        // No hauria d'arribar aquí
        fail('Expected an error, but got a success response');
      },
      error: (error) => {
        expect(error).toEqual(errorResponse);
        done(); 
      }
    });
  });
});

  it('should return client-side error message if error is an ErrorEvent', () => {
    const mockErrorEvent = new ErrorEvent('Network error', {
      message: 'Client-side error occurred',
    });

    const mockErrorResponse = new HttpErrorResponse({
      error: mockErrorEvent,
      status: 0,
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
});
