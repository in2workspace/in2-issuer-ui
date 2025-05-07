import { MatCard, MatCardContent } from '@angular/material/card';
import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AbstractControl, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PowerActionsMap, TmfAction, TmfFunction } from 'src/app/core/models/entity/lear-credential-employee.entity';
import { CapitalizePipe } from 'src/app/shared/pipes/capitalize.pipe';
import { AddPrefixPipe } from 'src/app/shared/pipes/add-prefix.pipe';
import { CredentialDetailsService } from './services/credential-details.service';


@Component({
  standalone: true,
  imports: [AddPrefixPipe, CapitalizePipe, CommonModule, FormsModule, MatButton, MatCard, MatCardContent, MatFormField, MatIcon, MatInput, MatLabel, MatSlideToggle, ReactiveFormsModule, RouterLink, TranslatePipe ],
  providers:[CredentialDetailsService],
  selector: 'app-detail-from',
  templateUrl: './credential-details.component.html',
  styleUrl: './credential-details.component.scss'
})
export class CredentialDetailsComponent implements OnInit {
  public isLoading$: Observable<boolean>;
  
  private readonly detailService = inject(CredentialDetailsService);
  private readonly loader = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);

  public credentialStatus = this.detailService.credentialStatus;
  public form = this.detailService.credentialDetailsForm;
  public formSchema = this.detailService.formSchema;

  public showReminderButton = computed(()=>{
    return (this.credentialStatus() === 'WITHDRAWN') || (this.credentialStatus() === 'DRAFT') || (this.credentialStatus() === 'PEND_DOWNLOAD');
  })

  public showSignCredentialButton = computed(()=>{
    return this.credentialStatus() === 'PEND_SIGNATURE';
  });

  constructor() {
    this.isLoading$ = this.loader.isLoading$;
  }

  public ngOnInit(): void {
    this.getProcedureId();
    this.initializeForm();
  }
  
  private getProcedureId(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.detailService.setCredentialId(id);
  }
  

  private loadCredentialDetailAndForm(): void {
    this.detailService.loadCredentialDetailAndForm();
  }

  private initializeForm(): void {
    //todo return form
    this.loadCredentialDetailAndForm();
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
  
  
  getActionsForFunction(tmfFunction: TmfFunction): TmfAction[] {
    console.log('getting actions for function ' + tmfFunction);
    console.log('powersactionsmap')
    console.log(PowerActionsMap)
    console.log('returned functions')
    console.log(PowerActionsMap[tmfFunction] || [])
    return PowerActionsMap[tmfFunction] || [];
  }
  

}
