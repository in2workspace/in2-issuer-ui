import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CredencialOfferComponent } from './credencial-offer.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  AuthModule,
  StsConfigLoader,
  StsConfigStaticLoader,
} from 'angular-auth-oidc-client';

describe('CredencialOfferComponent', () => {
  let component: CredencialOfferComponent;
  let fixture: ComponentFixture<CredencialOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CredencialOfferComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MaterialModule,
        SharedModule,
        AuthModule.forRoot({}),
      ],
      providers: [
        AuthService,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredencialOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
