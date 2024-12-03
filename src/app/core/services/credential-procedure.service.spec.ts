import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CredentialProcedureService } from './credential-procedure.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ProcedureRequest } from '../models/procedure/procedureRequest.interface';
import { ProcedureResponse } from "../models/procedure/procedureResponse.interface";
import { CredentialData } from "../models/vc/learCredential.interface";

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
      imports: [HttpClientTestingModule],
      providers: [CredentialProcedureService]
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
      { credential_procedure:{procedure_id: '1', status: 'completed', full_name: 'John Doe', updated: '2023-01-01', credential: { mandatee: {}, mandator: {}, power: [] } as any}},
      { credential_procedure:{ procedure_id: '2', status: 'pending', full_name: 'Jane Doe', updated: '2023-01-02', credential: { mandatee: {}, mandator: {}, power: [] } as any }}
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
    const mockData: CredentialData =
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

  it('should get credential offer successfully', () => {
    const transactionCode = 'abc123';
    const mockResponse = JSON.stringify({ qrCode: 'mockQRCode' });

    service.getCredentialOffer(transactionCode).subscribe(data => {
      expect(data).toBe('mockQRCode');
    });

    const req = httpMock.expectOne(`${credentialOfferUrl}/transaction-code/${transactionCode}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return raw response if qrCode is not present in JSON response', () => {
    const transactionCode = 'abc123';
    const mockResponse = JSON.stringify({});

    service.getCredentialOffer(transactionCode).subscribe(data => {
      expect(data).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${credentialOfferUrl}/transaction-code/${transactionCode}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return raw response if JSON.parse fails', () => {
    const transactionCode = 'abc123';
    const invalidJSONResponse = 'Invalid JSON string';

    service.getCredentialOffer(transactionCode).subscribe(data => {
      expect(data).toBe(invalidJSONResponse);
    });

    const req = httpMock.expectOne(`${credentialOfferUrl}/transaction-code/${transactionCode}`);
    expect(req.request.method).toBe('GET');
    req.flush(invalidJSONResponse);
  });

  it('should handle error when getting credential offer', () => {
    const transactionCode = 'abc123';
    const errorResponse = serverErrorResp;

    service.getCredentialOffer(transactionCode).subscribe(
      data => fail('should have failed with 500 error'),
      (error: string) => {
        expect(error).toContain('Server-side error: 500');
      }
    );

    const req = httpMock.expectOne(`${credentialOfferUrl}/transaction-code/${transactionCode}`);
    req.flush('500 error', errorResponse);
  });

  it('should return raw response when qrCode is not present in getCredentialOffer', () => {
    const transactionCode = 'abc123';
    const mockResponse = 'raw response';

    service.getCredentialOffer(transactionCode).subscribe(data => {
      expect(data).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${credentialOfferUrl}/transaction-code/${transactionCode}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
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
