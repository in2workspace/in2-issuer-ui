import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CredentialManagement } from 'src/app/core/models/credentialManagement.interface';

@Injectable({
  providedIn: 'root'
})
export class CredentialManagementService {
  private apiUrl = 'http://localhost:3000/credentials';

  public constructor(private http: HttpClient) {}

  public getCredentials(): Observable<CredentialManagement[]> {
    return this.http.get<CredentialManagement[]>(this.apiUrl);
  }
  public getCredentialById(id: string): Observable<CredentialManagement> {
    return this.http.get<CredentialManagement>(`${this.apiUrl}/${id}`);
  }
public sendReminder(credentialId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-reminder`, { id: credentialId });
  }

}

