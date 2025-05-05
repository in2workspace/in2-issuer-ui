import { inject, Injectable } from '@angular/core';
import { CredentialType, LearCredentialDataDetail } from '../models/detail-models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Observer, take } from 'rxjs';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { buildFormFromSchema, getFormDataByType, getFormSchemaByType, typeCast } from '../utils/detail-utils';
import { FormSchema } from '../models/detail-form-models';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

    credentialId!: string;
    credentialData!: LearCredentialDataDetail;
    form!: FormGroup;
    formSchema!: FormSchema;

    credentialProcedureService = inject(CredentialProcedureService);
    fb = inject(FormBuilder);

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
  }

}
