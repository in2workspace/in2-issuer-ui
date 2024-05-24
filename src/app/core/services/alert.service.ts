import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public constructor(private snackbar: MatSnackBar, private translate: TranslateService) {}

    public showAlert(
        messageKey: string,
        alertType: 'error' | 'info' | 'success' | 'warning' = 'info',
        timeOut = 3000
    ): void {
        this.translate.get(messageKey).subscribe((message) => {
            if (message && message.trim().length > 0) {
                this.snackbar.open(message, 'OK', {
                    duration: timeOut,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    panelClass: ['custom-snackbar', alertType]
                });
            }
        });
    }
}
