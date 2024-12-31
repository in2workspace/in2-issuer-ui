import { DestroyRef, inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent, DialogData } from '../dialog.component';
import { Observable, switchMap, take, tap } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class DialogWrapperService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly loader = inject(LoaderService);

  public openDialog(dialogData:DialogData): MatDialogRef<DialogComponent, any>{
    return this.dialog.open(DialogComponent, {
      data: {
        ...dialogData
      },
    });
  }

  //it is important not to cut error flow (with catchError) in callback passed as argument, since then
  //dialog will be closed before displaying the error message from the server (it reuses the same opened dialog)
  public openDialogWithCallback(dialogData:DialogData, callback:() => Observable<any>): void{
    const dialogRef = this.dialog.open(
      DialogComponent, 
      { data: { ...dialogData } }
    );

    let confirmObservable;
    if(dialogData.confirmationType === 'sync'){
      confirmObservable = dialogRef.afterClosed();
    }else if(dialogData.confirmationType === 'async'){
      confirmObservable = dialogRef.componentInstance.afterConfirmSubj()
        .pipe(tap(() => { 
          const loadingData = dialogData.loadingData;
          if(loadingData){
            dialogRef.componentInstance.updateData(loadingData);
          }
          dialogRef.disableClose=true;
          this.loader.updateIsLoading(true); 
        }));
    }else{
      return;
    }
    confirmObservable
      .pipe(
        take(1),
        switchMap(callback)
      )
      .subscribe({
        next: () => { 
          if(dialogRef?.close){
            dialogRef.close();
          }
        },
        error: err => {
          console.error(err);
        }}).add(() => {
          dialogRef.disableClose=false;
          this.loader.updateIsLoading(false);
        });

  }

  public openErrorInfoDialog(message: string, title?: string): MatDialogRef<DialogComponent, any>{
    const errorDialogData: DialogData = { 
      title: title ?? 'Error',
      message: message,
      confirmationType: 'none',
      status: 'error',
      loadingData: undefined
    };
    const openDialog = this.dialog.openDialogs[0];
    if(openDialog){
      return openDialog.componentInstance.updateData(errorDialogData);
    }else{
      return this.dialog.open(DialogComponent, {
        data: {
          ...errorDialogData
        }
      });
  }
  }

}
