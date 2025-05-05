import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowersTwoComponent } from './powers-two.component';

describe('PowersTwoComponent', () => {
  let component: PowersTwoComponent;
  let fixture: ComponentFixture<PowersTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowersTwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowersTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
