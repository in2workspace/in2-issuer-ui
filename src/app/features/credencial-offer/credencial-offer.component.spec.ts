import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredencialOfferComponent } from './credencial-offer.component';

describe('CredencialOfferComponent', () => {
  let component: CredencialOfferComponent;
  let fixture: ComponentFixture<CredencialOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredencialOfferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CredencialOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
