import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EMPTY, from, Observable, switchMap, take, tap } from 'rxjs';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { LEARCredentialEmployeeJwtPayload } from "../../core/models/entity/lear-credential-employee.entity";
import { LearCredentialEmployeeDataDetail } from "../../core/models/dto/lear-credential-employee-data-detail.dto";
import { FormCredentialComponent } from '../../shared/components/form-credential/form-credential.component';
import { NgIf } from '@angular/common';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';
import { DialogData } from 'src/app/shared/components/dialog/dialog.component';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
    selector: 'app-credential-detail',
    templateUrl: './credential-detail.component.html',
    standalone: true,
    imports: [
        NgIf,
        FormCredentialComponent,
        TranslatePipe
    ],
})
export class CredentialDetailComponent implements OnInit {
  public credentialId: string | null = null;
  public credential: LEARCredentialEmployeeJwtPayload | null = null;
  public credentialStatus: string | null = null;
  public isLoading$: Observable<boolean>;

  private readonly route = inject(ActivatedRoute);
  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly dialog = inject(DialogWrapperService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  public constructor(){
    this.isLoading$ = this.loader.isLoading$;
  }

  public ngOnInit(): void {
    this.route.paramMap
    .pipe(take(1))
    .subscribe(params => {
      this.credentialId = params.get('id');
      if (this.credentialId) {
        this.loadCredentialDetail(this.credentialId);
      }
    });
  }

  public loadCredentialDetail(procedureId: string): void {
    this.credentialProcedureService.getCredentialProcedureById(procedureId)
    .pipe(take(1))
    .subscribe({
      next: (credentials: LearCredentialEmployeeDataDetail) => {
        this.credential = credentials['credential'];
        this.credentialStatus = credentials['credential_status'];
      },
      error: (error: Error) => {
        console.error('Error fetching credential details', error);
      }
    });
  }

  public openSendReminderDialog(): void {

    const dialogData: DialogData = {
      title: this.translate.instant("credentialDetail.sendReminderConfirm.title"),
      message: this.translate.instant("credentialDetail.sendReminderConfirm.message"),
      confirmationType: 'async',
      status: 'default',
      loadingData: undefined
    };

    const sendReminderAfterConfirm = (): Observable<boolean> => {
      return this.sendReminder();
    }
    
    this.dialog.openDialogWithCallback(dialogData, sendReminderAfterConfirm);

  }

  public sendReminder(): Observable<boolean>{
    const credentialId = this.credentialId;
    if (!credentialId){
      console.error('No credential id.');
      return EMPTY;
    }

    return this.credentialProcedureService.sendReminder(credentialId)
    // open success dialog and navigate to credentials
    .pipe(
      switchMap(() => {
            const dialogData: DialogData = {
              title: this.translate.instant("credentialDetail.sendReminderSuccess.title"),
              message: this.translate.instant("credentialDetail.sendReminderSuccess.message"),
              confirmationType: 'none',
              status: 'default',
              loadingData: undefined
            };

            const dialogRef = this.dialog.openDialog(dialogData);
            return dialogRef.afterClosed();
      }),
      switchMap(()  => 
        from(this.router.navigate(['/organization/credentials']))
      ),
      tap(() => location.reload())
    );
  }

}
