import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCredentialComponent } from './form-credential.component';

describe('FormCredentialComponent', () => {
  let component: FormCredentialComponent;
  let fixture: ComponentFixture<FormCredentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCredentialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
