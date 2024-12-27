import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<DialogComponent>>;

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
    imports: [DialogComponent, TranslateModule.forRoot({})],
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

  it('should initialize the correct status color based on the dialog status', () => {
    component.data = { title: '', message: '', isConfirmDialog: false, status: 'warn' };
    fixture.detectChanges();
    expect(component.initializeStatusColor()).toBe('warn');

    component.data = { title: '', message: '', isConfirmDialog: false, status: 'error' };
    fixture.detectChanges();
    expect(component.initializeStatusColor()).toBe('warn');
  
    component.data = { title: '', message: '', isConfirmDialog: false, status: 'default' };
    fixture.detectChanges();
    expect(component.initializeStatusColor()).toBe('primary');
  });
});
