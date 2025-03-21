import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { environment } from 'src/environments/environment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { ServeErrorInterceptor } from './app/core/interceptors/server-error-interceptor';
import { AuthInterceptor, AuthModule } from 'angular-auth-oidc-client';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { RouterModule } from "@angular/router";
import { routes } from "./app/app-routing";
import { HttpLoaderFactory } from "./app/core/services/translate-http-loader.factory";
import { overrideDefaultValueAccessor } from './app/core/overrides/value-accessor.overrides';

overrideDefaultValueAccessor();

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, RouterModule.forRoot(routes), TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }), AuthModule.forRoot({
            config: {
                postLoginRoute: '/organization/credentials',
                authority: environment.loginParams.login_url,
                redirectUrl: `${window.location.origin}`,
                postLogoutRedirectUri: window.location.origin,
                clientId: environment.loginParams.client_id,
                scope: environment.loginParams.scope,
                responseType: environment.loginParams.grant_type,
                silentRenew: true,
                useRefreshToken: true,
                historyCleanupOff: false,
                ignoreNonceAfterRefresh: true,
                triggerRefreshWhenIdTokenExpired: false,
                secureRoutes: [environment.base_url]
            },
        })),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ServeErrorInterceptor, multi: true },
        provideAnimations(),
    ]
})
  .catch(err => console.error(err));
