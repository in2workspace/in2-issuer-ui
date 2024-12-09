import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { CredentialIssuanceAdminComponent } from './credentialIssuanceAdmin.component';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('Credential Issuance Admin Component', () => {
  let component: CredentialIssuanceAdminComponent;
  let fixture: ComponentFixture<CredentialIssuanceAdminComponent>;
 
  let translateService:TranslateService;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [CredentialIssuanceAdminComponent],
      imports: [BrowserAnimationsModule, RouterModule.forRoot([]), HttpClientModule, TranslateModule.forRoot({}),],
      providers: [
        TranslateService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CredentialIssuanceAdminComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);

    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title observable with the translated value', fakeAsync(() => {
    const mockTranslatedValue = 'Translated Credential Details';
    jest.spyOn(translateService, 'get').mockReturnValue(of(mockTranslatedValue));
  
    let emittedValue: string | undefined;
  
    component.title.subscribe((value) => {
      emittedValue = value;
    });
  
    tick(1000);
  
    expect(translateService.get).toHaveBeenCalledWith('credentialIssuance.learCredentialEmployee');
    expect(emittedValue).toBe(mockTranslatedValue);
  }));
  
});
