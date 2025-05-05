import { inject, Injectable } from '@angular/core';
import { CredentialStatus, CredentialType, LearCredentialDataDetail } from '../models/detail-models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EMPTY, from, Observable, Observer, switchMap, take, tap } from 'rxjs';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { buildFormFromSchema, getFormDataByType, getFormSchemaByType, typeCast } from '../utils/detail-utils';
import { FormSchema } from '../models/detail-form-models';
import { DialogData } from 'src/app/shared/components/dialog/dialog.component';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

    credentialId!: string; //todo remove?
    credentialStatus!: CredentialStatus;
    credentialData!: LearCredentialDataDetail;
    form!: FormGroup;
    formSchema!: FormSchema;

    private readonly credentialProcedureService = inject(CredentialProcedureService);
    private readonly dialog = inject(DialogWrapperService);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);
    

  constructor() { }

  public loadCredentialDetailAndForm(): void {  
    this.loadCredentialDetail()
    .subscribe(this.loadFormObserver);
  }

    public loadCredentialDetail(): Observable<LearCredentialDataDetail> {
      return this.credentialProcedureService
        .getCredentialProcedureDetailsById(this.credentialId)
        .pipe(take(1));
    }

  private loadFormObserver: Observer<LearCredentialDataDetail> = {
    next: (data: LearCredentialDataDetail) => {
      this.credentialData = data;
      this.credentialStatus = this.credentialData.credential_status;
      this.loadForm();
    },
    error: (err: any) => {
      console.error('Error loading credential detail', err);
    },
    complete: () => {}
  }

  private loadForm(): void {
    const credential = this.credentialData.credential.vc;
    const type = credential.type[0] as CredentialType;
  
    const schema = getFormSchemaByType(type);
    this.formSchema = schema; //todo
    const data = getFormDataByType(typeCast(credential, type));
  
    this.form = buildFormFromSchema(this.fb, schema, data);
    this.form.disable();
    console.log('Form has been loaded: ');
    console.log(this.form);
  }


  //SEND REMINDER AND SIGN
   public openSendReminderDialog(): void {
  
      const dialogData: DialogData = {
        title: this.translate.instant("credentialDetail.sendReminderConfirm.title"),
        message: this.translate.instant("credentialDetail.sendReminderConfirm.message"),
        confirmationType: 'async',
        status: 'default'
      };
  
      const sendReminderAfterConfirm = (): Observable<boolean> => {
        return this.sendReminder();
      }
  
      this.dialog.openDialogWithCallback(dialogData, sendReminderAfterConfirm);
  
    }
  
    public openSignCredentialDialog(): void {
  
      const dialogData: DialogData = {
        title: this.translate.instant("credentialDetail.signCredentialConfirm.title"),
        message: this.translate.instant("credentialDetail.signCredentialConfirm.message"),
        confirmationType: 'async',
        status: 'default'
      };
  
      const signCredentialAfterConfirm = (): Observable<boolean> => {
        return this.signCredential();
      }
      
      this.dialog.openDialogWithCallback(dialogData, signCredentialAfterConfirm);
    }
  
    private executeCredentialAction(
      action: (credentialId: string) => Observable<void>,
      titleKey: string,
      messageKey: string
    ): Observable<boolean> {
      const credentialId = this.credentialId;
      if (!credentialId) {
        console.error('No credential id.');
        return EMPTY;
      }
    
      return action(credentialId).pipe(
        switchMap(() => {
          const dialogData: DialogData = {
            title: this.translate.instant(titleKey),
            message: this.translate.instant(messageKey),
            confirmationType: 'none',
            status: 'default'
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
  
    public sendReminder(): Observable<boolean> {
      return this.executeCredentialAction(
        (credentialId) => this.credentialProcedureService.sendReminder(credentialId),
        "credentialDetail.sendReminderSuccess.title",
        "credentialDetail.sendReminderSuccess.message"
      );
    }
    
    public signCredential(): Observable<boolean> {
      return this.executeCredentialAction(
        (credentialId) => this.credentialProcedureService.signCredential(credentialId),
        "credentialDetail.signCredentialSuccess.title",
        "credentialDetail.signCredentialSuccess.message"
      );
    }

}
