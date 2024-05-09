import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';
import { Observable, shareReplay } from 'rxjs';


@Injectable({
    providedIn: 'root'
  })
  export class IssuerService {
    httpOptions = {
      headers: { 'Content-Type': 'application/json',
    },
    };
    constructor(    private http: HttpClient, private authenticationService: AuthenticationService
      ) { }

      credentialOffer(){
        return this.http.get<any>(
          environment.base_url + '/api/v1/credential-offer?credential-type=LEARCredentialEmployee',
          {
            headers: { 'Content-Type': 'application/json',
              'Authorization': 'Bearer '+this.authenticationService.getToken()
          },
          responseType: 'text' as 'json'}
        ).pipe(
          shareReplay()
        );
    }

    }