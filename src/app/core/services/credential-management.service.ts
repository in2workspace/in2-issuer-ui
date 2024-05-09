import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Mandate } from 'src/app/core/models/mandate.interface';
import { AlertService } from './alert.service';


@Injectable({
  providedIn: 'root'
})
export class CredentialManagementService {
  private apiUrl = 'http://localhost:3000/credentials';

  public constructor(private http: HttpClient, private alertService: AlertService) {}

  public getCredentials(): Observable<Mandate[]> {
    return this.http.get<Mandate[]>(this.apiUrl).pipe(
      catchError(this.handleError<Mandate[]>('getCredentials', []))
    );
  }

  public getCredentialById(id: string): Observable<Mandate> {
    return this.http.get<Mandate>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<Mandate>('getCredentialById'))
    );
  }

  public sendReminder(credentialId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-reminder`, { id: credentialId }).pipe(
      catchError(this.handleError('sendReminder'))
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.alertService.showAlert(`${operation} failed: ${error.message}`, 'error');
      return throwError(() => error);
    };
}
}
