import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Mandator } from '../models/madator.interface';

@Injectable({
  providedIn: 'root',
})
export class MandatorService {
  private apiUrl = 'http://localhost:3000/mandators';

  public constructor(private http: HttpClient) {}

  public getMandator(): Observable<Mandator> {
    return this.http.get<Mandator[]>(this.apiUrl).pipe(
      map((mandators: Mandator[]) => mandators[0])
    );
}
}
