import { DestroyRef, inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent, DialogData } from '../dialog.component';
import { Observer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class DialogWrapperService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  public openDialog(dialogData:DialogData): MatDialogRef<DialogComponent, any>{
    return this.dialog.open(DialogComponent, {
      data: {
        ...dialogData
      },
    });
  }

  public openDialogWithCallback(dialogData:DialogData, callback:Partial<Observer<any>>|undefined): void{
    const dialogRef = this.dialog.open(
      DialogComponent, 
      { data: { ...dialogData } }
    );
    
      dialogRef.afterClosed()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(callback);
  }

  public openErrorInfoDialog(message: string, title?:string):MatDialogRef<DialogComponent, any>{
    return this.dialog.open(DialogComponent, {
      data: { 
        title: title ?? 'Error',
        message: message,
        isConfirmDialog: false,
        status: 'error'
      }
    });
  }

}
