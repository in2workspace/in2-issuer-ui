import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { NavbarComponent } from './navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

class MockAuthService {
  getMandator() {
    return of(null);
  }
  getUserData(){
    return of(null);
  }
  logout() {
    return of(void 0);
  }
}

export class MockRouter implements Partial<Router> {
  navigate = jest.fn();
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: AuthService;
  let translateService: TranslateService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        TranslateModule.forRoot(),
        MatIconModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    translateService = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);

    jest.spyOn(component, 'logout');

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with mandator', () => {
    const mockMandator = { name: 'Test Mandator' };
    jest.spyOn(authService, 'getMandator').mockReturnValue(of(mockMandator));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.mandator).toEqual(mockMandator);
  });

  it('should initialize with username', () => {
    const mockUserData = { first_name: 'Test', last_name: 'User' };
    const mockUserName = 'Test User';
    jest.spyOn(authService, 'getUserData').mockReturnValue(of(mockUserData));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.userName).toEqual(mockUserName);
  });

  it('should initialize with default language', () => {
    component.ngOnInit();
    expect(component.selectedLanguage).toBe('en');
  });

  it('should initialize languages', ()=>{
    jest.spyOn(translateService, 'setDefaultLang');
    jest.spyOn(translateService, 'addLangs');

    component.ngOnInit();
    fixture.detectChanges();

    expect(translateService.setDefaultLang).toHaveBeenCalled();
    expect(translateService.addLangs).toHaveBeenCalled();
  });

  it('should change language', () => {
    component.changeLanguage('es');
    expect(component.selectedLanguage).toBe('es');
  });

  it('should call logout on authService', () => {
    component.logout();
    expect(component.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home'], {});
  });

  it('should call logout on click', () => {
    const logoutLink = fixture.nativeElement.querySelector('#logout-link');

    logoutLink.click();

    expect(component.logout).toHaveBeenCalled();
  });

  it('should display the correct username and mandator', () => {
    const mockUserName = 'Test User';
    const mockMandator = {
      organization: 'Test Organization',
      organizationIdentifier: '12345',
      commonName: 'Test Common Name',
      emailAddress: 'test@test.com',
      serialNumber: 'SN123456',
      country: 'ES'
    };
    component.userName = mockUserName;
    component.mandator = mockMandator;
    fixture.detectChanges();

    const userNameElement: HTMLElement = fixture.nativeElement.querySelector('#username');
    const mandatorElement: HTMLElement = fixture.nativeElement.querySelector('#mandator');

    expect(userNameElement.textContent).toContain(mockUserName);
    expect(mandatorElement.textContent).toContain(mockMandator.organization);
  });

});
