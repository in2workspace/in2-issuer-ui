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

  it('should open a dialog and execute the callback with sync confirmation type', () => {
    const dialogData: DialogData = {
      title: 'Sync Title',
      message: 'Sync Message',
      confirmationType: 'sync',
      status: 'default',
      loadingData: undefined,
    };
    const callback = jest.fn(() => of('success'));
    const afterClosedSubject = new Subject<void>();
    const dialogRefMock = {
      afterClosed: jest.fn(() => afterClosedSubject.asObservable()),
      close: jest.fn(),
    } as unknown as MatDialogRef<DialogComponent, any>;

    matDialogMock.open.mockReturnValue(dialogRefMock);

    service.openDialogWithCallback(dialogData, callback);

    afterClosedSubject.next();
    afterClosedSubject.complete();

    expect(matDialogMock.open).toHaveBeenCalledWith(DialogComponent, {
      data: { ...dialogData },
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
    const afterConfirmSubject = new Subject<void>();
    const dialogRefMock = {
      componentInstance: {
        afterConfirmSubj: jest.fn(() => afterConfirmSubject.asObservable()),
        updateData: jest.fn(),
      },
      close: jest.fn(),
    } as unknown as MatDialogRef<DialogComponent, any>;

    matDialogMock.open.mockReturnValue(dialogRefMock);

    service.openDialogWithCallback(dialogData, callback);

    afterConfirmSubject.next();
    afterConfirmSubject.complete();

    expect(matDialogMock.open).toHaveBeenCalledWith(DialogComponent, {
      data: { ...dialogData },
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
      status: 'default',
      loadingData: undefined,
    };
    const callback = jest.fn(() => throwError(() => new Error('Callback Error')));
    const afterClosedSubject = new Subject<void>();
    const dialogRefMock = {
      afterClosed: jest.fn(() => afterClosedSubject.asObservable()),
      close: jest.fn(),
    } as unknown as MatDialogRef<DialogComponent, any>;

    matDialogMock.open.mockReturnValue(dialogRefMock);

    service.openDialogWithCallback(dialogData, callback);

    afterClosedSubject.next();
    afterClosedSubject.complete();

    expect(matDialogMock.open).toHaveBeenCalledWith(DialogComponent, {
      data: { ...dialogData },
    });
    expect(callback).toHaveBeenCalled();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
    expect(loaderServiceMock.updateIsLoading).toHaveBeenCalledWith(false);
  });
});
