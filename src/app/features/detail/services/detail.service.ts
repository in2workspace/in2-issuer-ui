import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EMPTY, from, Observable, Observer, switchMap, take, tap } from 'rxjs';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { buildFormFromSchema, FormSchemaByType, getFormDataByType, getFormSchemaByType } from '../utils/detail-utils';
import { FormSchema } from '../models/detail-form-models';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DialogData } from 'src/app/shared/components/dialog/dialog.component';
import { CredentialStatus, CredentialType, LEARCredentialDataDetail } from 'src/app/core/models/entity/lear-credential-employee.entity';

@Injectable()
export class DetailService {
  credentialId = signal<string>('');
  credentialStatus = signal<CredentialStatus | undefined>(undefined);
  credentialDataDetail = signal<LEARCredentialDataDetail | undefined>(undefined);
  form = signal<FormGroup | undefined>(undefined);
  formSchema = signal<FormSchema | undefined>(undefined);

  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly dialog = inject(DialogWrapperService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  constructor() {}

  public setCredentialId(id: string) {
    this.credentialId.set(id);
  }

  public loadCredentialDetailAndForm(): void {  
    this.loadCredentialDetail()
      .subscribe(this.loadFormObserver);
  }

  public loadCredentialDetail(): Observable<LEARCredentialDataDetail> {
    return this.credentialProcedureService
      .getCredentialProcedureById(this.credentialId())
      .pipe(
        take(1),
      tap(data=>{
        this.credentialDataDetail.set(data);
        this.credentialStatus.set(data.credential_status);
      }));
  }

  private loadFormObserver: Observer<LEARCredentialDataDetail> = {
    next: () => {
      this.loadForm();
    },
    error: (err: any) => {
      console.error('Error loading credential detail', err);
    },
    complete: () => {}
  }

  private loadForm(): void {
    const data = this.credentialDataDetail();
    if (!data){
      console.error('No credential data to load the form.');
      return;
    }

    const credential = data.credential.vc;
    const credentialTypes = credential.type as string[];
    const type = credentialTypes.find((t): t is CredentialType => t in FormSchemaByType);

    if (!type) {
      throw new Error(`No supported credential type found in: ${credentialTypes.join(', ')}`);
    }
    console.log('type')
    console.log(type)
    const schema = getFormSchemaByType(type);
    console.log('Schema: ');
    console.log(schema);
    const formData = getFormDataByType(credential, type);
    console.log('form data');
    console.log(formData)
    const builtForm = buildFormFromSchema(this.fb, schema, formData);
    builtForm.disable();

    this.formSchema.set(schema);
    this.form.set(builtForm);

    console.log('Form has been loaded:');
    console.log(this.form());
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
  
    return action(credentialId()).pipe(
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
