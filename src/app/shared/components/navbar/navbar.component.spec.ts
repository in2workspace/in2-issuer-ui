import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Location } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let translateService: TranslateService;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        TranslateModule.forRoot(),
        MaterialModule,
        RouterModule.forRoot([]),
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        TranslateService,
        Location
      ]
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default language', () => {
    spyOn(translateService, 'addLangs');
    spyOn(translateService, 'setDefaultLang');
    spyOn(translateService, 'getDefaultLang').and.returnValue('en');

    component.ngOnInit();

    expect(translateService.addLangs).toHaveBeenCalledWith(['en', 'es', 'ca']);
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('en');
    expect(component.selectedLanguage).toBe('en');
  });

  it('should logout and navigate to login page', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should change language', () => {
    spyOn(translateService, 'use');

    component.changeLanguage('es');

    expect(translateService.use).toHaveBeenCalledWith('es');
    expect(component.selectedLanguage).toBe('es');
  });
});
