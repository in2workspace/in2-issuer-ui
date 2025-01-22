import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterOutlet,
        TranslateModule.forRoot(),
        AppComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "Credential-issuer-ui"', () => {
    expect(component.title).toBe('Credential-issuer-ui');
  });

  it('should set default language to "en" on initialization', () => {
    const translateService = TestBed.inject(TranslateService);
    expect(translateService.getDefaultLang()).toBe('en');
    expect(translateService.currentLang).toBe('en');
  });

  it('should contain a router-outlet in the template', () => {
    const routerOutlet = debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).not.toBeNull();
  });
});
