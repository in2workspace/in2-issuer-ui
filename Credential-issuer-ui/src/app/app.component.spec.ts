import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AuthenticationService } from './services/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    const oidcSecuritySpy = jasmine.createSpyObj('OidcSecurityService', ['checkAuth', 'authorizeWithPopUp', 'logoff']);
    const authServiceSpyObj = jasmine.createSpyObj('AuthenticationService', ['logout']);
    TestBed.configureTestingModule({
      //declarations: [AppComponent],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientModule, HttpClientTestingModule],
      providers: [AuthenticationService,
        { provide: OidcSecurityService, useValue: oidcSecuritySpy },
        { provide: AuthenticationService, useValue: authServiceSpyObj },],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
})