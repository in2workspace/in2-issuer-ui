import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialProcedure } from '../models/credentialProcedure.interface';

@Injectable({
  providedIn: 'root'
})
export class CredentialProcedureService {

  private apiUrl = 'http://localhost:3000/credentialProcedures';

  public constructor(private http: HttpClient) { }

  public getCredentialProcedures(): Observable<CredentialProcedure[]> {
    return this.http.get<CredentialProcedure[]>(this.apiUrl);
  }

  public getCredentialProcedureById(procedureId: string): Observable<CredentialProcedure[]> {
    return this.http.get<CredentialProcedure[]>(`${this.apiUrl}?procedure_id=${procedureId}`);
  }


  public saveCredentialProcedure(credentialProcedure: CredentialProcedure): Observable<any> {
    return this.http.post(this.apiUrl, credentialProcedure);
  }

  public sendReminder(procedureId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${procedureId}/sendReminder`, {});
  }
}
