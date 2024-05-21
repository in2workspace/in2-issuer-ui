import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;
  let snackbarService: MatSnackBar;
  let translateService: TranslateService;
  let snackbarSpy: jasmine.Spy;
  let translateSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, TranslateModule.forRoot(), BrowserAnimationsModule],
      providers: [AlertService]
    });

    service = TestBed.inject(AlertService);
    snackbarService = TestBed.inject(MatSnackBar);
    translateService = TestBed.inject(TranslateService);

    snackbarSpy = spyOn(snackbarService, 'open').and.callThrough();
    translateSpy = spyOn(translateService, 'get').and.callFake((key: string) => of(key));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when showAlert is called', () => {
    it('should call MatSnackBar with the proper parameters for error', () => {
      service.showAlert('testMessage', 'error', 10);

      expect(translateSpy).toHaveBeenCalledWith('testMessage');
      expect(snackbarSpy).toHaveBeenCalledWith('testMessage', 'OK', {
        duration: 10,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar', 'error']
      });
    });

    it('should call MatSnackBar with the proper parameters for info', () => {
      service.showAlert('testMessage', 'info', 10);

      expect(translateSpy).toHaveBeenCalledWith('testMessage');
      expect(snackbarSpy).toHaveBeenCalledWith('testMessage', 'OK', {
        duration: 10,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar', 'info']
      });
    });

    it('should call MatSnackBar with the proper parameters for success', () => {
      service.showAlert('testMessage', 'success', 10);

      expect(translateSpy).toHaveBeenCalledWith('testMessage');
      expect(snackbarSpy).toHaveBeenCalledWith('testMessage', 'OK', {
        duration: 10,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar', 'success']
      });
    });

    it('should call MatSnackBar with the proper parameters for warning', () => {
      service.showAlert('testMessage', 'warning', 10);

      expect(translateSpy).toHaveBeenCalledWith('testMessage');
      expect(snackbarSpy).toHaveBeenCalledWith('testMessage', 'OK', {
        duration: 10,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar', 'warning']
      });
    });

    it('should ignore the call if the message is empty', () => {
      const emptyMessage = '';
      service.showAlert(emptyMessage);
      expect(snackbarSpy).not.toHaveBeenCalled();

      const whitespaceMessage = '   ';
      service.showAlert(whitespaceMessage);
      expect(snackbarSpy).not.toHaveBeenCalled();
    });
  });
});
