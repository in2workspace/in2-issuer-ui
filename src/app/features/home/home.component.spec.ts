import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let mockAuthService: {
    login:jest.Mock,
    logout: jest.Mock
  };

  beforeEach(async () => {
    mockAuthService = {
      login:jest.fn(),
      logout: jest.fn()
    };;

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    jest.spyOn(console, 'log');
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login on authService and log message to console', () => {
    component.login();
    expect(console.log).toHaveBeenCalledWith('HomeComponent: login button clicked');
    expect(mockAuthService.login).toHaveBeenCalled();
  });

  it('should logout and navigate to login page', () => {
    component.logout();
    expect(console.log).toHaveBeenCalledWith('HomeComponent: logging out');
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
