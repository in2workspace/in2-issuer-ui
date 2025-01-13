import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { QRCodeModule } from 'angularx-qrcode';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let router: jest.Mocked<Router>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    const routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    const authServiceMock = {
      login: jest.fn(),
      logout: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    TestBed.configureTestingModule({
      imports: [QRCodeModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    component = TestBed.createComponent(HomeComponent).componentInstance;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set walletUrl and knowledgebase_url from environment', () => {
    expect(component.walletUrl).toBe(environment.wallet_url);
    expect(component.knowledgebase_url).toBe(environment.knowledgebase_url);
  });

  it('should call authService.login when login() is called', () => {
    component.login();
    expect(authService.login).toHaveBeenCalled();
  });

  it('should call authService.logout and navigate to /login when logout() is called', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should scroll to the specified section when navigateToSection is called', () => {
    const scrollIntoViewMock = jest.fn();
    jest.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView: scrollIntoViewMock,
    } as unknown as HTMLElement);

    const sectionId = 'section1';
    component.navigateToSection(sectionId);
    expect(document.getElementById).toHaveBeenCalledWith(sectionId);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should do nothing if the section ID is not found', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(null);

    const sectionId = 'nonexistent-section';
    component.navigateToSection(sectionId);
    expect(document.getElementById).toHaveBeenCalledWith(sectionId);
  });
});
