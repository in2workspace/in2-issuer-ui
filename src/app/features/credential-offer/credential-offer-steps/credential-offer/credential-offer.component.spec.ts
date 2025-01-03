import { TestBed } from '@angular/core/testing';
import { CredentialOfferComponent } from './credential-offer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { TranslatePipe } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { NgIf } from '@angular/common';
import { environment } from 'src/environments/environment';

describe('CredentialOfferComponent', () => {
  let component: CredentialOfferComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, NgIf, QRCodeModule, TranslatePipe, CredentialOfferComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(CredentialOfferComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize walletSameDeviceUrl with the correct value from the environment', () => {
    const expectedUrl = environment.wallet_url + 'tabs/home/';
    expect(component.walletSameDeviceUrl).toBe(expectedUrl);
  });

  it('should initialize walletUsersGuideUrl with the correct value from the environment', () => {
    const expectedGuideUrl = environment.knowledgebase_url + 'books/dome-digital-wallet-user-guide';
    expect(component.walletUsersGuideUrl).toBe(expectedGuideUrl);
  });

  it('should set the QR color to "#2d58a7"', () => {
    expect(component.qrColor).toBe('#2d58a7');
  });

  it('should compute walletSameDeviceUrl$ correctly when credentialOfferUri$ is provided', () => {
    const credentialOfferUriMock = 'mockCredentialOfferUri';
    (component as any).credentialOfferUri$ = () => credentialOfferUriMock;
  
    const expectedComputedUrl =
      environment.wallet_url + 'tabs/home/' + credentialOfferUriMock;
  
    expect(component.walletSameDeviceUrl$()).toBe(expectedComputedUrl);
  });

  it('should remove the protocol from the given URL string', () => {
    const inputUrl = 'https://example.com';
    const expectedOutput = 'example.com';
    
    const result = component.removeProtocol(inputUrl);
    
    expect(result).toBe(expectedOutput);
  });
});
