import {Component, inject, OnInit} from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  template: '<p>Setting everything up...you are getting redirected...</p>'
})
export class CallbackComponent implements OnInit {

  private oidcSecurityService = inject(OidcSecurityService);
  private router = inject(Router);

  public ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated }) => {
      if (isAuthenticated) {
        this.router.navigate(['/organization/credentials']);
      } else {
        this.router.navigate(['/home']);
      }
    });
  }
}
