import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

export type DialogStatus = 'default' | 'warn' | 'error';
export interface DialogData { 
  title: string; 
  message: string; 
  isConfirmDialog: boolean;
  status: DialogStatus;
}
export interface DialogDefaultContent {
  data: DialogData;
}

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        TranslatePipe,
        NgClass
    ],
})
export class DialogComponent {
  public data = inject<DialogData>(MAT_DIALOG_DATA);
  public readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  public statusColor = this.initializeStatusColor();

  public initializeStatusColor(){
    switch (this.data.status) {
      case 'warn':
        return 'warn';
      case 'error':
        return 'warn';
      default:
        return 'primary';
    }
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

}
