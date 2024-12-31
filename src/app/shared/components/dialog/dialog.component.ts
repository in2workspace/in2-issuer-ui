import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, Subject } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ComponentPortal, DomPortal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { MatIconModule } from '@angular/material/icon';

export type DialogStatus = 'default' | 'warn' | 'error' | 'success';
export type DialogConfirmationType = 'none' | 'sync' | 'async';
export interface LoadingData { title:string, message:string; template?:ComponentPortal<any>|TemplatePortal|DomPortal }
export interface DialogData { 
  title: string; 
  message: string; 
  confirmationType: DialogConfirmationType;
  status: DialogStatus;
  loadingData: LoadingData | undefined;
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
        MatIconModule,
        NgClass,
        PortalModule,
        MatProgressSpinnerModule,
        TranslatePipe,
    ],
})
export class DialogComponent {
  public data = inject<DialogData>(MAT_DIALOG_DATA);
  public readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  private readonly loader = inject(LoaderService);
  
  public isLoading$ = this.loader.isLoading$;
  public statusColor = 'primary';
  public currentStatus: DialogStatus | undefined = undefined;

  private readonly confirmSubj$ = new Subject<boolean>();

  public constructor(){
    this.dialogRef.addPanelClass('dialog-custom');
    this.updateStatus();
  }

  public updateStatus(){
    const previousStatus = this.currentStatus;
    if(previousStatus){
      this.dialogRef.removePanelClass(`dialog-${previousStatus}`);
    }
    this.currentStatus = this.data.status;
    this.dialogRef.addPanelClass(`dialog-${this.currentStatus}`);
  }

  public updateData(data: Partial<DialogData>){
    this.data = { ...this.data, ...data };
    this.updateStatus();

  }

  public afterConfirmSubj(): Observable<boolean>{
    return this.confirmSubj$.asObservable();
  }

  public onConfirm(){
    if(this.data.confirmationType === 'none'){
      this.onCancel();
    }
    else if(this.data.confirmationType === 'sync'){
      this.confirmAndClose();
    }
    else if(this.data.confirmationType === 'async'){
      this.confirmWithoutClosing();
    }
  }

  public confirmWithoutClosing(){
    this.confirmSubj$.next(true);
  }

  public confirmAndClose(): void {
    this.dialogRef.close(true);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  

}
