import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<DialogComponent>>;

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
    imports: [DialogComponent],
    providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
            provide: MAT_DIALOG_DATA,
            useValue: { title: 'Test Title', message: 'Test Message' },
        },
    ],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with true when onConfirm is called', () => {
    component.onConfirm();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false when onCancel is called', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
