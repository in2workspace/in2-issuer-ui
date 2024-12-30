import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';

export type DialogStatus = 'default' | 'warn' | 'error';
export type DialogConfirmationType = 'none' | 'close' | 'load';
export interface DialogData { 
  title: string; 
  message: string; 
  confirmationType: DialogConfirmationType;
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
        AsyncPipe,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatProgressSpinnerModule,
        TranslatePipe,
        NgClass,
    ],
})
export class DialogComponent {
  public data = inject<DialogData>(MAT_DIALOG_DATA);
  public readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  public statusColor = this.initializeStatusColor();
  private loader = inject(LoaderService);
  public isLoading$ = this.loader.isLoading$;

  public hasConfirmedSubj$ = new BehaviorSubject<boolean>(false);
  private hasConfirmed$ = this.hasConfirmedSubj$.asObservable();
  

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

  public onConfirm(){
    if(this.data.confirmationType === 'load'){
      this.confirmWithoutClosing();
    }else if(this.data.confirmationType === 'close'){
      this.confirmAndClose();
    }else if(this.data.confirmationType === 'none'){
      this.confirmAndClose();
    }
  }

  public confirmWithoutClosing(){
    this.hasConfirmedSubj$.next(true);
    this.loader.isLoading$.subscribe(isLoading=>{
      if(isLoading===false){
        this.dialogRef.close();
      }
    })
  }
  public confirmAndClose(): void {
    this.dialogRef.close(true);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  

}
