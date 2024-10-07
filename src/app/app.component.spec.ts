import { DebugElement } from '@angular/core';
import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [],
      schemas: []
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

  it('should contain a router-outlet in the template', () => {
    const routerOutlet = debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).not.toBeNull();
  });
});