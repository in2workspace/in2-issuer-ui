import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, throwError, Subject } from 'rxjs';
import { DialogWrapperService } from './dialog-wrapper.service';
import { DialogComponent, DialogData } from '../dialog.component';
import { LoaderService } from 'src/app/core/services/loader.service';

jest.mock('@angular/material/dialog');

describe('DialogWrapperService', () => {
  let service: DialogWrapperService;
  let matDialogMock: jest.Mocked<MatDialog>;
  let loaderServiceMock: jest.Mocked<LoaderService>;

  beforeEach(() => {
    matDialogMock = {
      open: jest.fn(),
      openDialogs: []
    } as unknown as jest.Mocked<MatDialog>;

    loaderServiceMock = {
      updateIsLoading: jest.fn(),
    } as unknown as jest.Mocked<LoaderService>;

    TestBed.configureTestingModule({
      providers: [
        DialogWrapperService,
        { provide: MatDialog, useValue: matDialogMock },
        { provide: LoaderService, useValue: loaderServiceMock },
      ],
    });

    service = TestBed.inject(DialogWrapperService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should open a dialog with given data', () => {
    const dialogData: DialogData = {
      title: 'Sync Title',
      message: 'Sync Message',
      confirmationType: 'sync',
      status: 'default'
    };
    const mockDialogRef = {} as MatDialogRef<DialogComponent, any>;

    matDialogMock.open.mockReturnValue(mockDialogRef);

    const result = service.openDialog(dialogData);

    expect(matDialogMock.open).toHaveBeenCalledWith(DialogComponent, {
      data: {
        ...dialogData
      },
      autoFocus: false
    });

    expect(result).toBe(mockDialogRef);
  });

  it('should open a dialog and execute the callback with sync confirmation type', () => {
    const dialogData: DialogData = {
      title: 'Sync Title',
      message: 'Sync Message',
      confirmationType: 'sync',
      status: 'default'
    };
    const callback = jest.fn(() => of('success'));
    const afterClosedSubject = new Subject<boolean>();
    const dialogRefMock = {
      afterClosed: jest.fn(() => afterClosedSubject.asObservable()),
      close: jest.fn(),
    } as unknown as MatDialogRef<DialogComponent, any>;

    matDialogMock.open.mockReturnValue(dialogRefMock);

    service.openDialogWithCallback(dialogData, callback);

    afterClosedSubject.next(true);
    afterClosedSubject.complete();

    expect(matDialogMock.open).toHaveBeenCalledWith(DialogComponent, {
      data: { ...dialogData },
      autoFocus:false,
      disableClose: false
    });
    expect(callback).toHaveBeenCalled();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should open a dialog and execute the callback with async confirmation type', () => {
    const dialogData: DialogData = {
      title: 'Async Title',
      message: 'Async Message',
      confirmationType: 'async',
      status: 'default',
      loadingData: { title: 'Loading', message: 'Loading Message' },
    };
    const callback = jest.fn(() => of('success'));
    const afterConfirmSubject = new Subject<true>();
    const dialogRefMock = {
      componentInstance: {
        afterConfirm$: jest.fn(() => afterConfirmSubject.asObservable()),
        updateData: jest.fn(),
      },
      close: jest.fn(),
    } as unknown as MatDialogRef<DialogComponent, any>;

    matDialogMock.open.mockReturnValue(dialogRefMock);

    service.openDialogWithCallback(dialogData, callback);

    afterConfirmSubject.next(true);
    afterConfirmSubject.complete();

    expect(matDialogMock.open).toHaveBeenCalledWith(DialogComponent, {
      data: { ...dialogData },
      autoFocus:false,
      disableClose: false
    });
    expect(dialogRefMock.componentInstance.updateData).toHaveBeenCalledWith(dialogData.loadingData);
    expect(loaderServiceMock.updateIsLoading).toHaveBeenCalledWith(true);
    expect(callback).toHaveBeenCalled();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should handle errors in the callback and keep dialog open', () => {
    const dialogData: DialogData = {
      title: 'Error Title',
      message: 'Error Message',
      confirmationType: 'sync',
      status: 'default'
    };
    const callback = jest.fn(() => throwError(() => new Error('Callback Error')));
    const afterClosedSubject = new Subject<boolean>();
    const dialogRefMock = {
      afterClosed: jest.fn(() => afterClosedSubject.asObservable()),
      close: jest.fn(),
    } as unknown as MatDialogRef<DialogComponent, any>;

    matDialogMock.open.mockReturnValue(dialogRefMock);

    service.openDialogWithCallback(dialogData, callback);

    afterClosedSubject.next(true);
    afterClosedSubject.complete();

    expect(matDialogMock.open).toHaveBeenCalledWith(DialogComponent, {
      data: { ...dialogData },
      autoFocus:false,
      disableClose: false
    });
    expect(callback).toHaveBeenCalled();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
    expect(loaderServiceMock.updateIsLoading).toHaveBeenCalledWith(false);
  });

  
  it('should set disableClose to true when disableClose parameter is "DISABLE_CLOSE"', () => {
    const dialogData: DialogData = {
      title: 'Test Title',
      message: 'Test Message',
      confirmationType: 'sync',
      status: 'default'
    };
    const callback = jest.fn(() => of('success'));
    const afterClosedSubject = new Subject<boolean>();
    const dialogRefMock = {
      afterClosed: jest.fn(() => afterClosedSubject.asObservable()),
      close: jest.fn(),
    } as unknown as MatDialogRef<DialogComponent, any>;
  
    matDialogMock.open.mockReturnValue(dialogRefMock);
  
    service.openDialogWithCallback(dialogData, callback, undefined, 'DISABLE_CLOSE');
  
    expect(matDialogMock.open).toHaveBeenCalledWith(DialogComponent, {
      data: { ...dialogData },
      autoFocus: false,
      disableClose: true  
    });
  });
  
  it('should reset disableClose to false after async callback execution', () => {
    const dialogData: DialogData = {
      title: 'Async Title',
      message: 'Async Message',
      confirmationType: 'async',
      status: 'default',
      loadingData: { title: 'Loading', message: 'Loading Message' },
    };
    const callback = jest.fn(() => of('success'));
    const afterConfirmSubject = new Subject<boolean>();
    const dialogRefMock = {
      componentInstance: {
        afterConfirm$: jest.fn(() => afterConfirmSubject.asObservable()),
        updateData: jest.fn(),
      },
      disableClose: false,
      close: jest.fn(),
    } as unknown as MatDialogRef<DialogComponent, any>;
  
    matDialogMock.open.mockReturnValue(dialogRefMock);
  
    service.openDialogWithCallback(dialogData, callback);
  
    afterConfirmSubject.next(true);
    afterConfirmSubject.complete();
  
    expect(dialogRefMock.disableClose).toBe(false);
    expect(loaderServiceMock.updateIsLoading).toHaveBeenCalledWith(false);
  });
  
  it('should handle errors in the async callback and keep dialog open', () => {
    const dialogData: DialogData = {
      title: 'Async Error Title',
      message: 'Async Error Message',
      confirmationType: 'async',
      status: 'default',
      loadingData: { title: 'Loading', message: 'Loading Message' },
    };
    const callback = jest.fn(() => throwError(() => new Error('Async Callback Error')));
    const afterConfirmSubject = new Subject<boolean>();
    const dialogRefMock = {
      componentInstance: {
        afterConfirm$: jest.fn(() => afterConfirmSubject.asObservable()),
        updateData: jest.fn(),
      },
      disableClose: false,
      close: jest.fn(),
    } as unknown as MatDialogRef<DialogComponent, any>;
  
    matDialogMock.open.mockReturnValue(dialogRefMock);
  
    service.openDialogWithCallback(dialogData, callback);
  
    afterConfirmSubject.next(true);
    afterConfirmSubject.complete();
  
    expect(matDialogMock.open).toHaveBeenCalledWith(DialogComponent, {
      data: { ...dialogData },
      autoFocus: false,
      disableClose: false
    });
    expect(callback).toHaveBeenCalled();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
    expect(loaderServiceMock.updateIsLoading).toHaveBeenCalledWith(false);
  });
  

  it('should execute cancel callback when dialog is closed with false', () => {
    const dialogData: DialogData = {
      title: 'Cancel Title',
      message: 'Cancel Message',
      confirmationType: 'sync',
      status: 'default'
    };
    
    const callback = jest.fn(() => of('success'));
    const cancelCallback = jest.fn(() => of('cancel success'));

    const afterClosedSubject = new Subject<boolean>();
    const dialogRefMock = {
      afterClosed: jest.fn(() => afterClosedSubject.asObservable()),
      close: jest.fn(),
    } as unknown as MatDialogRef<DialogComponent, any>;

    matDialogMock.open.mockReturnValue(dialogRefMock);

    service.openDialogWithCallback(dialogData, callback, cancelCallback);

    afterClosedSubject.next(false);
    afterClosedSubject.complete();

    expect(matDialogMock.open).toHaveBeenCalledWith(DialogComponent, {
      data: { ...dialogData },
      autoFocus: false,
      disableClose: false
    });

    expect(cancelCallback).toHaveBeenCalled();
  });

  it('should handle errors in cancel callback', () => {
    const dialogData: DialogData = {
      title: 'Cancel Error Title',
      message: 'Cancel Error Message',
      confirmationType: 'sync',
      status: 'default'
    };

    const callback = jest.fn(() => of('success'));
    const cancelCallback = jest.fn(() => throwError(() => new Error('Cancel Callback Error')));

    const afterClosedSubject = new Subject<boolean>();
    const dialogRefMock = {
      afterClosed: jest.fn(() => afterClosedSubject.asObservable()),
      close: jest.fn(),
    } as unknown as MatDialogRef<DialogComponent, any>;

    matDialogMock.open.mockReturnValue(dialogRefMock);

    service.openDialogWithCallback(dialogData, callback, cancelCallback);

    afterClosedSubject.next(false);
    afterClosedSubject.complete();

    expect(matDialogMock.open).toHaveBeenCalledWith(DialogComponent, {
      data: { ...dialogData },
      autoFocus: false,
      disableClose: false
    });

    expect(cancelCallback).toHaveBeenCalled();
  });

  it('should execute callback on true condition', () => {
    const callback = jest.fn(() => of('executed'));
    const result = service['executeCallbackOnCondition'](callback, true);
  
    return result.toPromise().then((value) => {
      expect(callback).toHaveBeenCalled();
      expect(value).toBe('executed');
    });
  });
  
  it('should return EMPTY on false condition', () => {
    const callback = jest.fn(() => of('executed'));
    const result = service['executeCallbackOnCondition'](callback, false);
  
    return result.toPromise().then((value) => {
      expect(callback).not.toHaveBeenCalled();
      expect(value).toBeUndefined(); // EMPTY no emet cap valor
    });
  });
  
});
