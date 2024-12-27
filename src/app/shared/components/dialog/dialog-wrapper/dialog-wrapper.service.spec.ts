import { TestBed } from '@angular/core/testing';
import { DialogWrapperService } from './dialog-wrapper.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DialogComponent, DialogData } from '../dialog.component';

describe('DialogWrapperService', () => {
  let service: DialogWrapperService;
  let mockMatDialog: jest.Mocked<MatDialog>;

  beforeEach(() => {
    mockMatDialog = {
      open: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        DialogWrapperService,
        { provide: MatDialog, useValue: mockMatDialog },
      ],
    });

    service = TestBed.inject(DialogWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openDialog', () => {
    it('should call MatDialog.open with DialogComponent and correct data', () => {
      const dialogData: DialogData = {
        title: 'Test Title',
        message: 'Test Message',
        isConfirmDialog: true,
        status: 'default',
      };
      service.openDialog(dialogData);

      expect(mockMatDialog.open).toHaveBeenCalledWith(DialogComponent, {
        data: dialogData,
      });
    });
  });

  describe('openDialogWithCallback', () => {
    it('should open a dialog and subscribe to afterClosed with a callback', () => {
      const dialogData: DialogData = {
        title: 'Test Title',
        message: 'Test Message',
        isConfirmDialog: true,
        status: 'default',
      };

      const afterClosed$ = of('Dialog Closed');
      const mockDialogRef = { afterClosed: jest.fn().mockReturnValue(afterClosed$) } as any;
      mockMatDialog.open.mockReturnValue(mockDialogRef);

      const callback = {
        next: jest.fn(),
        error: jest.fn(),
        complete: jest.fn(),
      };

      service.openDialogWithCallback(dialogData, callback);

      expect(mockMatDialog.open).toHaveBeenCalledWith(DialogComponent, {
        data: dialogData,
      });
      expect(mockDialogRef.afterClosed).toHaveBeenCalled();
      expect(callback.next).toHaveBeenCalledWith('Dialog Closed');
    });
  });

  describe('openErrorInfoDialog', () => {
    it('should call MatDialog.open with DialogComponent and default error data', () => {
      const message = 'Error Message';
      const title = 'Error Title';

      service.openErrorInfoDialog(message, title);

      expect(mockMatDialog.open).toHaveBeenCalledWith(DialogComponent, {
        data: {
          title: title,
          message: message,
          isConfirmDialog: false,
          status: 'error',
        },
      });
    });

    it('should use "Error" as the default title if none is provided', () => {
      const message = 'Error Message';

      service.openErrorInfoDialog(message);

      expect(mockMatDialog.open).toHaveBeenCalledWith(DialogComponent, {
        data: {
          title: 'Error',
          message: message,
          isConfirmDialog: false,
          status: 'error',
        },
      });
    });
  });
});
