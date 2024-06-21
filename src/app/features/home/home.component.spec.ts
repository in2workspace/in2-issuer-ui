import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let routerNavigateSpy: jasmine.Spy;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'logout']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    routerNavigateSpy = spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login on authService and log message to console', () => {
    spyOn(console, 'log');
    component.login();
    expect(console.log).toHaveBeenCalledWith('HomeComponent: login button clicked');
    expect(mockAuthService.login).toHaveBeenCalled();
  });

  it('should logout and navigate to login page', () => {
    spyOn(console, 'log');
    component.logout();
    expect(console.log).toHaveBeenCalledWith('HomeComponent: logging out');
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
