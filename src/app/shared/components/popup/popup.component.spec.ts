import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupComponent } from './popup.component';
import { SharedModule } from '../../shared.module';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the popup when isVisible is true, and hide it when is false', () => {
    //show
    component.isVisible = true;
    fixture.detectChanges();

    let popupElement = fixture.debugElement.query(By.css('.popup-overlay'));
    expect(popupElement).not.toBeNull();

    //hide
    component.isVisible = false;
    fixture.detectChanges();
    popupElement = fixture.debugElement.query(By.css('.popup-overlay'));

    expect(popupElement).toBeNull();
  });

  it('should call showPopupMethod when isVisible changes', ()=>{
    const spy = jest.spyOn(component, 'showPopup');
    component.isVisible=true;
    component.ngOnChanges({
      isVisible: new SimpleChange(false, true, false)
    });
    expect(spy).toHaveBeenCalled();
  });

  it('closes popup after clicking close button', ()=>{
    const spy = jest.spyOn(component, 'closePopup');
    component.isVisible=true;
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    expect(spy).toHaveBeenCalled();
    expect(component.isVisible).toBe(false);
  });

  it('should hide the popup 3000ms after executing showPopup', () => {
    jest.useFakeTimers();
    component.isVisible = true;
    component.showPopup();

    expect(component.isVisible).toBe(true);

    jest.advanceTimersByTime(3000);

    expect(component.isVisible).toBe(false);

    jest.useRealTimers();
  });
});
