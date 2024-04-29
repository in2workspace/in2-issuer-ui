import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { MatIcon } from '@angular/material/icon';

describe('AlertService', () => {
    let service: AlertService;
    let snackbarService: MatSnackBar;
    let snackbarSpy: jasmine.Spy<any>;
    let testMessage = 'Test';
    let snackOptions = {
        duration: 0,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: []
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
            providers: [
                AlertService
            ]
        });
        service = TestBed.inject(AlertService);
        snackbarService = TestBed.inject(MatSnackBar);
        snackbarSpy = spyOn<any>(snackbarService, 'open');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('WHEN showAlert is called', () => {
        describe('AND message is not empty', () => {
            describe('AND is alertType of error', () => {
                it('SHOULD call MatSnackbar with the proper parameters', () => {
                    service.showAlert(testMessage, 'error', 10);
                    snackOptions = {
                        ...snackOptions,
                        duration: 10,
                        panelClass: ['vy-alert', 'error', 'alert-custom-button']
                    };
                    expect(snackbarSpy).toHaveBeenCalledOnceWith(testMessage, 'X', snackOptions);
                });
            });

            describe('AND is alertType of info', () => {
                it('SHOULD call MatSnackbar with the proper parameters', () => {
                    service.showAlert(testMessage, 'info', 10);
                    snackOptions = {
                        ...snackOptions,
                        duration: 10,
                        panelClass: ['vy-alert', 'info', 'alert-custom-button']
                    };
                    expect(snackbarSpy).toHaveBeenCalledOnceWith(testMessage, 'X', snackOptions);
                });
            });

            describe('AND is alertType of success', () => {
                it('SHOULD call MatSnackbar with the proper parameters', () => {
                    service.showAlert(testMessage, 'success', 10);
                    snackOptions = {
                        ...snackOptions,
                        duration: 10,
                        panelClass: ['vy-alert', 'success', 'alert-custom-button']
                    };
                    expect(snackbarSpy).toHaveBeenCalledOnceWith(testMessage, 'X', snackOptions);
                });
            });

            describe('AND is alertType of warning', () => {
                it('SHOULD call MatSnackbar with the proper parameters', () => {
                    service.showAlert(testMessage, 'warning', 10);
                    snackOptions = {
                        ...snackOptions,
                        duration: 10,
                        panelClass: ['vy-alert', 'warning', 'alert-custom-button']
                    };
                    expect(snackbarSpy).toHaveBeenCalledOnceWith(testMessage, 'X', snackOptions);
                });
            });
        });

        describe('AND message is empty', () => {
            it('SHOULD ignore the call', () => {
                const testMessageTemp = '';
                service.showAlert(testMessageTemp);
                expect(snackbarSpy).not.toHaveBeenCalled();

                const emptyTestsMessage = '   ';
                service.showAlert(emptyTestsMessage);
                expect(snackbarSpy).not.toHaveBeenCalled();
            });
        });
    });
});
