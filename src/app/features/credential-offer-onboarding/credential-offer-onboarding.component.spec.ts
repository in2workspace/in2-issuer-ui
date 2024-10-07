import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialOfferOnboardingComponent } from './credential-offer-onboarding.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { importProvidersFrom, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthModule } from 'angular-auth-oidc-client';
import { of } from 'rxjs';

describe('CredentialOfferOnboardingComponent', () => {
  let component: CredentialOfferOnboardingComponent;
  let fixture: ComponentFixture<CredentialOfferOnboardingComponent>;
  let route: ActivatedRoute;
  let router: Router;
  const dummyCode = 'dummy-code';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialOfferOnboardingComponent, AuthModule.forRoot({config:{}})],
      providers:[
        {
            provide: ActivatedRoute,
            useValue: {
              queryParams: of({ transaction_code: dummyCode })
            }
        },
        Router,
        HttpClient,
        HttpHandler,
        importProvidersFrom(
            TranslateModule.forRoot({
              loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
              },
            })
          )
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredentialOfferOnboardingComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch transactionCode from queryParams', ()=>{
    component.ngOnInit();
    expect(component['transactionCode']).toBe(dummyCode);
  });

  it('should navigate to correct url when executing redirect', ()=>{
   component.ngOnInit();
   component.redirect();
   expect(router.navigate).toHaveBeenCalledWith(['/credential-offer-detail'], {queryParams: {"transaction_code":component["transactionCode"]}});
  })
});;
