import { DestroyRef, inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent, DialogData } from '../dialog.component';
import { EMPTY, filter, Observable, switchMap, take, tap } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';

export type observableCallback = () => Observable<any>;

@Injectable({
  providedIn: 'root'
})
export class DialogWrapperService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly loader = inject(LoaderService);

  //simple dialog method: opens dialog and returns a reference to it
  public openDialog(dialogData:DialogData): MatDialogRef<DialogComponent, any>{
    return this.dialog.open(DialogComponent, {
      data: {
        ...dialogData
      },
      autoFocus:false
    });
  }

  //similar to openDialog, but with a predefined error data
  //if a dialog is already open, it will update its data instead of opening a new one
  public openErrorInfoDialog(message: string, title?: string): MatDialogRef<DialogComponent, any>{
    const errorDialogData: DialogData = { 
      title: title ?? 'Error',
      message: message,
      confirmationType: 'none',
      status: 'error'
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

  //Allow opening a dialog with a callback that can be a sync or async function
  //in case of async function, it is possible to pass loadingData to be displayed while waiting for the callback to finish, including text and template
  //It is important not to cut error flow (tipically with catchError) in callback passed as argument, since then the
  //dialog will be closed in the next callback of openDialogWithCallback. The server interceptor reuses the already opened dialog to display its error message (see openErrorInfoDialog),
  //which will be immediately closed by the next callback of openDialogWithCallback if the error flow is cut.
  public openDialogWithCallback(dialogData: DialogData, callback: observableCallback, cancelCallback?: () => Observable<any>, disableClose?:'DISABLE_CLOSE'):  MatDialogRef<DialogComponent, any>{
    const dialogRef = this.dialog.open(
      DialogComponent, 
      { 
        data: { ...dialogData },
        autoFocus: false,
        disableClose: disableClose === 'DISABLE_CLOSE'
      },
    );

    let confirmObservable;

    if(dialogData.confirmationType === 'sync'){
      confirmObservable = dialogRef.afterClosed();
    }else if(dialogData.confirmationType === 'async'){
      confirmObservable = dialogRef.componentInstance.afterConfirm$()
        .pipe(tap(() => { 
          const loadingData = dialogData.loadingData;
          if(loadingData){
            dialogRef.componentInstance.updateData(loadingData);
          }
          dialogRef.disableClose=true;
          this.loader.updateIsLoading(true); 
        }));
    }else{
      return dialogRef;
    }
    confirmObservable
      .pipe(
        take(1),
        switchMap((confirmation:boolean)=>{
          return this.executeCallbackOnCondition(callback, confirmation);
        })
      )
      .subscribe({
        next: () => { 
          if(dialogRef?.close){
            dialogRef.close();
          }
        },
        error: err => {
          console.error(err);
        },
        complete: () => { 
          if(dialogRef?.close){
            dialogRef.close();
          }
        },
      }).add(() => {
          dialogRef.disableClose=false;
          this.loader.updateIsLoading(false);
      });

      if(cancelCallback){
        dialogRef.afterClosed().pipe(
          take(1), 
          filter(val => val === false),
          switchMap(cancelCallback)).subscribe({
          next: () => { 
            console.info('Cancel callback completed');
          },
          error: err => {
            console.error(err);
          },
          complete: () => {
            console.info('Cancel callback completed');
          }
        });
      }
      return dialogRef;

  }

  public openDialogWithForm<TFormValue>(
    dialogData: DialogData,                               // título, mensajes, loadingData opcional, etc.
    validateForm: (formInstance: any) => boolean,         // tu lógica de validación
    getFormValue: (formInstance: any) => TFormValue,      // cómo extraer el valor del form
    asyncOperation: (formValue: TFormValue) => Observable<any>
  ): MatDialogRef<DialogComponent, any> {

    // Forzamos que tenga confirmación async para que el Dialog muestre los botones Aceptar/Cancelar
   

    // Abrimos el diálogo
    const dialogRef = this.dialog.open(
      DialogComponent, 
      { 
        data: { ...dialogData },
        autoFocus: false,
        disableClose: true
      },
    );

    // Nos suscribimos al "Confirmar"
    dialogRef.componentInstance.afterConfirm$().subscribe(() => {
      // 1) Obtenemos la instancia del form
      const formInstance = dialogRef.componentInstance.getEmbeddedInstance<any>();
      if (!formInstance) return;

      // 2) Validamos
      if (!validateForm(formInstance)) {
        // Marcar campos como tocados, si el form expone un método
        if (typeof formInstance.markTouched === 'function') {
          formInstance.markTouched();
        }
        return;
      }

      // 3) Loading
      if (dialogData.loadingData) {
        dialogRef.componentInstance.updateData({
          loadingData: dialogData.loadingData
        });
      }
      this.loader.updateIsLoading(true);

      // 4) Ejecutamos la operación
      const formValue = getFormValue(formInstance);
      asyncOperation(formValue).subscribe({
        next: () => {
          dialogRef.close(); // Solo cierra si todo sale bien
        },
        error: (err) => {
          console.error('❌ Error ejecutando asyncOperation', err);
          // No cierra el diálogo, se queda abierto
        },
        complete: () => {
          this.loader.updateIsLoading(false);
        }
      });
    });

    return dialogRef;
  }
 
  private executeCallbackOnCondition(callback: observableCallback, condition: boolean): Observable<any> {
    if(condition){
      return callback();
    }
     return EMPTY;
  }


}
