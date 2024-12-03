import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {

  private readonly dialogRef = inject(MatDialogRef<DialogComponent>);

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
