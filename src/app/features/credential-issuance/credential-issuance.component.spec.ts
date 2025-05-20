import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { CredentialIssuanceComponent } from './credential-issuance.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OidcSecurityService, StsConfigLoader } from "angular-auth-oidc-client";
import { AuthService } from "../../core/services/auth.service";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

(globalThis as any).structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));

describe('CredentialIssuanceComponent', () => {
  let component: CredentialIssuanceComponent;
  let fixture: ComponentFixture<CredentialIssuanceComponent>;

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

  function createMockActivatedRoute(path: string): any {
    return {
      snapshot: {
        pathFromRoot: [
          { url: [] },
          { url: [] },
          { url: [{ path }] }
        ]
      }
    };
  }

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  it('should set "asSigner" to true when path includes "create-as-signer"', async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        CredentialIssuanceComponent
      ],
      providers: [
        TranslateService,
        AuthService,
        { provide: OidcSecurityService, useValue: {
          checkAuth: jest.fn().mockReturnValue(of(mockAuthResponse)),
          authorize: jest.fn(),
          logoff: jest.fn()
        }},
        { provide: StsConfigLoader, useValue: { loadConfigs: () => {} } },
        { provide: ActivatedRoute, useValue: createMockActivatedRoute('create-as-signer') },
        provideHttpClient(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CredentialIssuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.asSigner).toBe(true);
  });

  it('should set "asSigner" to false when path is not "create-as-signer"', async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        CredentialIssuanceComponent
      ],
      providers: [
        TranslateService,
        AuthService,
        { provide: OidcSecurityService, useValue: {
          checkAuth: jest.fn().mockReturnValue(of(mockAuthResponse)),
          authorize: jest.fn(),
          logoff: jest.fn()
        }},
        { provide: StsConfigLoader, useValue: { loadConfigs: () => {} } },
        { provide: ActivatedRoute, useValue: createMockActivatedRoute('create') },
        provideHttpClient(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CredentialIssuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.asSigner).toBe(false);
  });
});
