import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { NavbarComponent } from './navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

class MockAuthService {
  logout() {}
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: AuthService;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        TranslateModule.forRoot(),
        MatIconModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default language', () => {
    component.ngOnInit();
    expect(component.selectedLanguage).toBe('en');
  });

  it('should change language', () => {
    component.changeLanguage('es');
    expect(component.selectedLanguage).toBe('es');
  });

  it('should call logout on authService', () => {
    spyOn(authService, 'logout');
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });
});
