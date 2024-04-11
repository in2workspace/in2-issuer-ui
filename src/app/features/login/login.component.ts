import { Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public constructor(public oidcSecurityService: OidcSecurityService) { }


  public login() {
    this.oidcSecurityService.authorize();
  }
}
