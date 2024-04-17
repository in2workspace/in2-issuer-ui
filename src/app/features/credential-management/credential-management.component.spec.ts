import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialManagementComponent } from './credential-management.component';

describe('CredentialManagementComponent', () => {
  let component: CredentialManagementComponent;
  let fixture: ComponentFixture<CredentialManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CredentialManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredentialManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
