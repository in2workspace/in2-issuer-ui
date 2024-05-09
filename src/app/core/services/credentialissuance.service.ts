import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialManagement } from 'src/app/core/models/credentialManagement.interface';

@Injectable({
  providedIn: 'root'
})
export class CredentialissuanceService {
  private apiUrl = 'http://localhost:3000';

  public constructor(private http: HttpClient) {}

  public createCredential(credentialManagement: CredentialManagement): Observable<any> {
    return this.http.post(`${this.apiUrl}/credentials`, credentialManagement);
  }
}
