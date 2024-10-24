import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallbackComponent } from './callback.component';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;
  let mockRouter: {
    navigate: jest.Mock;
  };
  let mockOidcSecurityService: {
    checkAuth: jest.Mock;
  } 

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    };
    mockOidcSecurityService = {
      checkAuth: jest.fn().mockReturnValue(of({ isAuthenticated: true }))
    }

    await TestBed.configureTestingModule({
      declarations: [CallbackComponent],
      providers: [
        { provide: OidcSecurityService, useValue: mockOidcSecurityService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /credentialManagement if authenticated', () => {
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/organization/credentials']);
  });

  it('should navigate to /home if not authenticated', () => {
    mockOidcSecurityService.checkAuth.mockReturnValue(of({ isAuthenticated: false }));
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });
});
