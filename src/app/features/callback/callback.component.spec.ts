import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallbackComponent } from './callback.component';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

class MockOidcSecurityService {
  checkAuth() {
    return of({ isAuthenticated: true });
  }
}

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [CallbackComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: OidcSecurityService, useClass: MockOidcSecurityService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /credentialManagement if authenticated', () => {
    fixture.detectChanges();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/organization/credentials']);
  });

  it('should navigate to /home if not authenticated', () => {
    (component as any).oidcSecurityService.checkAuth = () => of({ isAuthenticated: false });
    component.ngOnInit();
    fixture.detectChanges();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });
});
