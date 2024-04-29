import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialMandatee } from 'src/app/core/models/credendentialMandatee.interface';
import { CredentialManagement } from 'src/app/core/models/credentialManagement.interface';

@Injectable({
  providedIn: 'root'
})
export class CredentialissuanceService {
  private apiUrl = 'http://localhost:3000';

  public constructor(private http: HttpClient) {}

  public createCredential(credential: CredentialMandatee): Observable<CredentialManagement> {
    const timestamp = new Date().getTime();
    const newCredential: CredentialManagement = {
      id: 'cred-' + timestamp,
      status: 'issued',
      name: `${credential.firstname} ${credential.lastname}`,
      updated: new Date().toISOString().split('T')[0],
      mandatee: {
        ...credential,
        id: 'cred-' + timestamp,
      }
    };

    return this.http.post<CredentialManagement>(`${this.apiUrl}/credentials`, newCredential);
  }
}
