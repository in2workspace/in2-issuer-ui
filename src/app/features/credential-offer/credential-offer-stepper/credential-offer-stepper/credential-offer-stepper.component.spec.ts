import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialOfferStepperComponent } from './credential-offer-stepper.component';

describe('CredentialOfferStepperComponent', () => {
  let component: CredentialOfferStepperComponent;
  let fixture: ComponentFixture<CredentialOfferStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialOfferStepperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CredentialOfferStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
