import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialOfferStepComponent } from './credential-offer-step.component';

describe('CredentialOfferStepComponent', () => {
  let component: CredentialOfferStepComponent;
  let fixture: ComponentFixture<CredentialOfferStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialOfferStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CredentialOfferStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
