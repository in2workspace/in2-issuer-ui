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

    let confirmMethod;
    if(dialogData.confirmationType === 'close'){
      confirmMethod = dialogRef.afterClosed();
    }else if(dialogData.confirmationType === 'load'){
      confirmMethod = dialogRef.componentInstance.hasConfirmedSubj$;
    }else{
      return;
    }
    confirmMethod
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(callback);

  }

  public openErrorInfoDialog(message: string, title?:string): MatDialogRef<DialogComponent, any>{
    const errorDialogData: DialogData = { 
      title: title ?? 'Error',
      message: message,
      confirmationType: 'none',
      status: 'error'
    };
    return this.dialog.open(DialogComponent, {
      data: {
        ...errorDialogData
      }
    });
  }

}
