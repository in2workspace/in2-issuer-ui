import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CredentialIssuanceComponent } from './credentialIssuance.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { CredentialData, Credential } from 'src/app/core/models/credentialProcedure.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('CredentialDetailComponent', () => {
  let component: CredentialIssuanceComponent;
  let fixture: ComponentFixture<CredentialIssuanceComponent>;
 
  let translateService:TranslateService;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [CredentialIssuanceComponent],
      imports: [BrowserAnimationsModule, RouterModule.forRoot([]), HttpClientModule, TranslateModule.forRoot({}),],
      providers: [
        TranslateService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CredentialIssuanceComponent);
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

  it('should set the title observable with the translated value', (done) => {
    const mockTranslatedValue = 'Translated Credential Details';
    jest.spyOn(translateService, 'get').mockReturnValue(of(mockTranslatedValue));
  
    component.title.subscribe((value) => {

    expect(translateService.get).toHaveBeenCalledWith("credentialIssuance.learCredentialEmployee");
    expect(value).toBe(mockTranslatedValue);
    done(); 
    });
  });
  
});
