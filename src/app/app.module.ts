import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';
import { LoginModule } from './features/login/login.module';
import { MaterialModule } from './material.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    LoginModule,
    BrowserAnimationsModule,
    AuthModule.forRoot({
      config: {
        postLoginRoute: '/home',
        authority: environment.loginParams.login_url,
        redirectUrl: `${window.location.origin}/callback`,
        postLogoutRedirectUri: window.location.origin,
        clientId: environment.loginParams.client_id,
        scope: environment.loginParams.scope,
        responseType: environment.loginParams.grant_type,
        silentRenew: true,
        useRefreshToken: true,
        ignoreNonceAfterRefresh: true,
        triggerRefreshWhenIdTokenExpired: false,
        autoUserInfo: false,
        logLevel: LogLevel.Debug,
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
