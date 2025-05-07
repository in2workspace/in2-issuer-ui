import { CredentialDetailsComponent } from './credential-details.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('DetailFormComponent', () => {
  let component: CredentialDetailsComponent;
  let fixture: ComponentFixture<CredentialDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CredentialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
