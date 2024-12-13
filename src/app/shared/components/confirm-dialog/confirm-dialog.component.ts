import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton,
    ],
})
export class ConfirmDialogComponent {
  public data = inject<{ title: string; message: string }>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  public onConfirm(): void {
    this.dialogRef.close(true);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
