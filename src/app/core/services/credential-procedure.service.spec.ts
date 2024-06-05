import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CredentialProcedureService } from './credential-procedure.service';
import { CredentialData, CredentialProcedure, CredentialProcedureResponse } from '../models/credentialProcedure.interface';
import { environment } from 'src/environments/environment';

describe('CredentialProcedureService', () => {
  let service: CredentialProcedureService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.base_url}${environment.procedures}`;

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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch credential procedures successfully', () => {
    const mockData: CredentialProcedureResponse = {credential_procedures:[
      { credential_procedure:{procedure_id: '1', status: 'completed', full_name: 'John Doe', updated: '2023-01-01', credential: { mandatee: {}, mandator: {}, power: [] } as any} },
      {credential_procedure:{ procedure_id: '2', status: 'pending', full_name: 'Jane Doe', updated: '2023-01-02', credential: { mandatee: {}, mandator: {}, power: [] } as any }}
    ]};

    service.getCredentialProcedures().subscribe(data => {
      expect(data.credential_procedures.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch credential procedure by id successfully', () => {
    const procedureId = '1';
    const mockData: CredentialData = 
      { procedure_id: '1', credential_status: 'completed', credential: { mandatee: {}, mandator: {}, power: [] } as any }
    ;

    service.getCredentialProcedureById(procedureId).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${apiUrl}?procedure_id=${procedureId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should save credential procedure successfully', () => {
    const mockData: CredentialProcedure ={credential_procedure: {
      procedure_id: '1', status: 'completed', full_name: 'John Doe', updated: '2023-01-01', credential: { mandatee: {}, mandator: {}, power: [] } as any
    }};

    service.saveCredentialProcedure(mockData).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(mockData);
  });

  it('should send reminder successfully', () => {
    const procedureId = '1';

    service.sendReminder(procedureId).subscribe(data => {
      expect(data).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/${procedureId}/sendReminder`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
