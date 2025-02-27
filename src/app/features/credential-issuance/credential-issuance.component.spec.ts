import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CredentialIssuanceComponent } from './credential-issuance.component';
import { RouterModule, ActivatedRoute, convertToParamMap } from '@angular/router';
import { TranslateModule, TranslateService} from '@ngx-translate/core';
import { OidcSecurityService, StsConfigLoader } from "angular-auth-oidc-client";
import { AuthService } from "../../core/services/auth.service";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

(globalThis as any).structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));

describe('CredentialIssuanceComponent', () => {
  let component: CredentialIssuanceComponent;
  let fixture: ComponentFixture<CredentialIssuanceComponent>;

  let translateService: TranslateService;

  let configService: any;

  let oidcSecurityService: {
    checkAuth: jest.Mock,
    authorize: jest.Mock,
    logoff: jest.Mock
  };

  const mockAuthResponse = {
    isAuthenticated: false,
    userData: { emailAddress: 'test@example.com' },
    accessToken: 'dummyAccessToken',
    idToken: 'dummyIdToken'
  };

  const mockActivatedRoute = {
    paramMap: of(convertToParamMap({ id: '123' }))
  };

  beforeEach(async () => {
    configService = { loadConfigs: () => {} };

    oidcSecurityService = {
      checkAuth: jest.fn().mockReturnValue(of(mockAuthResponse)),
      authorize: jest.fn(),
      logoff: jest.fn()
    };

    await TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [BrowserAnimationsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot({}),
        CredentialIssuanceComponent],
    providers: [
        TranslateService,
        AuthService,
        { provide: OidcSecurityService, useValue: oidcSecurityService },
        { provide: StsConfigLoader, useValue: configService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClient(),
    ]
}).compileComponents();

    fixture = TestBed.createComponent(CredentialIssuanceComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);

    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set "asSigner$" to true when param "id" is present', fakeAsync(() => {
    let asSignerValue: boolean | undefined;
    component.asSigner$.subscribe(value => (asSignerValue = value));
    tick();
    expect(asSignerValue).toBeTruthy();
  }));

  it('should set "asSigner$" to false when param "id" is not present', fakeAsync(() => {
    const mockActivatedRoute = TestBed.inject(ActivatedRoute);
    (mockActivatedRoute as any).paramMap = of(convertToParamMap({}));
  
    fixture = TestBed.createComponent(CredentialIssuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  
    let asSignerValue: boolean | undefined;
    component.asSigner$.subscribe(value => (asSignerValue = value));
    tick();
    expect(asSignerValue).toBeFalsy();
  }));
  

});
