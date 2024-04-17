import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLearCredentialComponent } from './form-lear-credential.component';

describe('FormLearCredentialComponent', () => {
  let component: FormLearCredentialComponent;
  let fixture: ComponentFixture<FormLearCredentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormLearCredentialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLearCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
