import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { NavbarComponent } from './navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

class MockAuthService {
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

  it('should initialize with username and organization', () => {
    const mockUserData = { name: 'Test User', organization: 'Test Organization' };
    jest.spyOn(authService, 'getUserData').mockReturnValue(of(mockUserData));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.userName).toEqual(mockUserData.name);
    expect(component.organization).toEqual(mockUserData.organization);
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
    const mockUserData = {
      organization: 'Test Organization',
      name: 'Test User'
    };
    component.userName = mockUserData.name;
    component.organization = mockUserData.organization;
    fixture.detectChanges();

    const userNameElement: HTMLElement = fixture.nativeElement.querySelector('#username');
    const organizationElement: HTMLElement = fixture.nativeElement.querySelector('#organization');

    expect(userNameElement.textContent).toContain(mockUserData.name);
    expect(organizationElement.textContent).toContain(mockUserData.organization);
  });

});
