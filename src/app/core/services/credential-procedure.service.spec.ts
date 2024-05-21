import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CredentialProcedureService } from './credential-procedure.service';
import { CredentialProcedure } from '../models/credentialProcedure.interface';

describe('CredentialProcedureService', () => {
  let service: CredentialProcedureService;
  let httpMock: HttpTestingController;

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
    const mockData: CredentialProcedure[] = [
      { procedure_id: '1', status: 'completed', full_name: 'John Doe', updated: '2023-01-01', credential: { mandatee: {}, mandator: {}, powers: [] } as any },
      { procedure_id: '2', status: 'pending', full_name: 'Jane Doe', updated: '2023-01-02', credential: { mandatee: {}, mandator: {}, powers: [] } as any }
    ];

    service.getCredentialProcedures().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://localhost:3000/credentialProcedures');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch credential procedure by id successfully', () => {
    const procedureId = '1';
    const mockData: CredentialProcedure[] = [
      { procedure_id: '1', status: 'completed', full_name: 'John Doe', updated: '2023-01-01', credential: { mandatee: {}, mandator: {}, powers: [] } as any }
    ];

    service.getCredentialProcedureById(procedureId).subscribe(data => {
      expect(data.length).toBe(1);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`http://localhost:3000/credentialProcedures?procedure_id=${procedureId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should save credential procedure successfully', () => {
    const mockData: CredentialProcedure = {
      procedure_id: '1', status: 'completed', full_name: 'John Doe', updated: '2023-01-01', credential: { mandatee: {}, mandator: {}, powers: [] } as any
    };

    service.saveCredentialProcedure(mockData).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://localhost:3000/credentialProcedures');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(mockData);
  });

  it('should send reminder successfully', () => {
    const procedureId = '1';

    service.sendReminder(procedureId).subscribe(data => {
      expect(data).toBeTruthy();
    });

    const req = httpMock.expectOne(`http://localhost:3000/credentialProcedures/${procedureId}/sendReminder`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
