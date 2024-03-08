import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OidcSecurityService } from 'angular-auth-oidc-client';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthenticationService', ['getName', 'logout']);
    const oidcSecuritySpy = jasmine.createSpyObj('OidcSecurityService', ['checkAuth', 'authorizeWithPopUp', 'logoff']);
    TestBed.configureTestingModule({
      //declarations: [HomePage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers:[
        { provide: OidcSecurityService, useValue: oidcSecuritySpy },
        { provide: HttpClientModule},
        { provide: AuthenticationService, useValue: authServiceSpyObj },
      ]
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }))

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
