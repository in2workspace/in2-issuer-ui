// TODO this test class needs to be fixed
// The error occurred because the TestBed was trying to add a standalone component
// to the 'declarations' array instead of the 'imports' array. Standalone components
// should be added to the 'imports' array. Additionally, 'ActivatedRoute' needs to be
// mocked to avoid 'NullInjectorError'.

// import { ComponentFixture, TestBed } from '@angular/core/testing';
//
// import { CredentialOfferOnboardingComponent } from './credential-offer-onboarding.component';
//
// describe('CredentialOfferOnboardingComponent', () => {
//   let component: CredentialOfferOnboardingComponent;
//   let fixture: ComponentFixture<CredentialOfferOnboardingComponent>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [CredentialOfferOnboardingComponent]
//     })
//     .compileComponents();
//
//     fixture = TestBed.createComponent(CredentialOfferOnboardingComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
