import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialDetailsFormComponent } from './credential-details-form.component';

describe('CredentialDetailsFormComponent', () => {
  let component: CredentialDetailsFormComponent;
  let fixture: ComponentFixture<CredentialDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialDetailsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredentialDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
