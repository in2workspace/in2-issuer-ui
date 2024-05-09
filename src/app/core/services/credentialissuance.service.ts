import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mandatee } from 'src/app/core/models/mandatee.interface';
import { Mandate } from 'src/app/core/models/mandate.interface';

@Injectable({
  providedIn: 'root'
})
export class CredentialissuanceService {
  private apiUrl = 'http://localhost:3000';

  public constructor(private http: HttpClient) {}

  public createCredential(credential: Mandatee): Observable<Mandate> {
    const timestamp = new Date().getTime();
    const newCredential: Mandate = {
      id: 'cred-' + timestamp,
      status: 'issued',
      name: `${credential.first_name} ${credential.last_name}`,
      updated: new Date().toISOString().split('T')[0],
      mandatee: {
        ...credential,
        id: 'cred-' + timestamp,
      }
    };

    return this.http.post<Mandate>(`${this.apiUrl}/credentials`, newCredential);
  }
}
