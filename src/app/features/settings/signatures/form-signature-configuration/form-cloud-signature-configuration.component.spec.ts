import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCloudSignatureConfigurationComponent } from './form-cloud-signature-configuration.component';

describe('FormCloudSignatureConfigurationComponent', () => {
  let component: FormCloudSignatureConfigurationComponent;
  let fixture: ComponentFixture<FormCloudSignatureConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCloudSignatureConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCloudSignatureConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
