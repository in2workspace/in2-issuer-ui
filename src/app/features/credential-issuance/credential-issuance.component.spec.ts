import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { CredentialIssuanceComponent } from './credential-issuance.component';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {StsConfigLoader} from "angular-auth-oidc-client";

describe('Credential Issuance Component', () => {
  let component: CredentialIssuanceComponent;
  let fixture: ComponentFixture<CredentialIssuanceComponent>;

  let translateService:TranslateService;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
    imports: [BrowserAnimationsModule, RouterModule.forRoot([]), HttpClientModule, TranslateModule.forRoot({}), CredentialIssuanceComponent,],
    providers: [
        TranslateService,StsConfigLoader
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
