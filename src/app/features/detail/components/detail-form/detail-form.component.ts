import { MatCard, MatCardContent } from '@angular/material/card';
import { AddPrefixPipe } from '../../../../shared/pipes/add-prefix.pipe';
import { CapitalizePipe } from './../../../../shared/pipes/capitalize.pipe';
import { DetailService } from './../../services/detail.service';
import { CredentialStatus, PowerActionsMap, TmfAction} from './../../models/detail-models';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AbstractControl, FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { FormSchema } from '../../models/detail-form-models';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';


@Component({
  standalone: true,
  imports: [AddPrefixPipe, CapitalizePipe, CommonModule, FormsModule, MatButton, MatCard, MatCardContent, MatFormField, MatIcon, MatInput, MatLabel, MatSlideToggle, ReactiveFormsModule, RouterLink, TranslatePipe ],
  selector: 'app-detail-from',
  templateUrl: './detail-form.component.html',
  styleUrl: './detail-form.component.scss'
})
export class DetailFormComponent implements OnInit {
  credentialId!: string;
  credentialStatus!: CredentialStatus;
  form: FormGroup | undefined;
  formSchema!: FormSchema;
  public isLoading$: Observable<boolean>;

  private readonly detailService = inject(DetailService);
  private readonly loader = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.isLoading$ = this.loader.isLoading$;
  }

  ngOnInit(): void {
    this.getProcedureId();
    this.initializeForm();
  }
  
  private getProcedureId(): void {
    this.detailService.credentialId = this.route.snapshot.paramMap.get('id')!;
  }
  

  private loadCredentialDetailAndForm(): void {
    this.detailService.loadCredentialDetailAndForm();
  }

  private initializeForm(): void {
    //todo return form
    this.loadCredentialDetailAndForm();
    this.credentialStatus = this.detailService.credentialStatus;
    this.form = this.detailService.form;
    this.formSchema = this.detailService.formSchema;
  }

  //SEND REMINDER
  public openSendReminderDialog(){
    this.detailService.openSendReminderDialog();
  }

  // SIGN
  public openSignCredentialDialog(){
    this.detailService.openSignCredentialDialog();
  }

  //template functions
  public showReminderButton(): boolean {
    return (this.credentialStatus === 'WITHDRAWN') || (this.credentialStatus === 'DRAFT') || (this.credentialStatus === 'PEND_DOWNLOAD');
  }

  public showSignCredentialButton(): boolean{
    return this.credentialStatus === 'PEND_SIGNATURE';
  }

  formKeys(group: any): string[] {
    return Object.keys(group.controls);
  }
  
  getControlType(control: any): 'group' | 'array' | 'control' {
    if (control.controls && control.getRawValue) {
      if (Array.isArray(control.controls)) {
        return 'array';
      }
      return 'group';
    }
    return 'control';
  }

  asFormArray(control: AbstractControl | null): FormArray {
    return control as FormArray;
  }
  
  
  getActionsForType(type: string): string[] {
    return PowerActionsMap[type as TmfAction] || [];
  }
  

}
