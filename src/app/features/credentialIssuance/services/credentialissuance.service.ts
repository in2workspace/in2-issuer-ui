import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CredentialMandatee } from 'src/app/core/models/credendentialMandatee.interface';

@Injectable({
  providedIn: 'root'
})
export class CredentialissuanceService {

  private apiUrl = 'http://localhost:3000/credentials';

  public constructor(private http: HttpClient) {}

  public createCredential(credential: CredentialMandatee): Observable<CredentialMandatee> {
    return this.http.post<CredentialMandatee>(this.apiUrl, credential);
  }
}
