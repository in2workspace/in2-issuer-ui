import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let dialogRefMock: { close: jest.Mock };

  beforeEach(() => {
    dialogRefMock = { close: jest.fn() };

    TestBed.configureTestingModule({
      declarations: [DialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock }
      ]
    });

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the dialog component', () => {
    expect(component).toBeTruthy();
  });

  it('should call dialogRef.close(true) when onConfirm is called', () => {
    component.onConfirm();

    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });
});
