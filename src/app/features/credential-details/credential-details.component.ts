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
import { LoaderService } from 'src/app/core/services/loader.service';
import { TmfAction, TmfFunction } from 'src/app/core/models/entity/lear-credential-employee.entity';
import { CapitalizePipe } from 'src/app/shared/pipes/capitalize.pipe';
import { AddPrefixPipe } from 'src/app/shared/pipes/add-prefix.pipe';
import { CredentialDetailsService } from './services/credential-details.service';
import { getActionsByFunction } from './utils/credential-details-utils';


@Component({
  standalone: true,
  imports: [AddPrefixPipe, CapitalizePipe, CommonModule, FormsModule, MatButton, MatCard, MatCardContent, MatFormField, MatIcon, MatInput, MatLabel, MatSlideToggle, ReactiveFormsModule, RouterLink, TranslatePipe ],
  providers:[CredentialDetailsService],
  selector: 'app-detail-from',
  templateUrl: './credential-details.component.html',
  styleUrl: './credential-details.component.scss'
})
export class CredentialDetailsComponent implements OnInit {
  
  private readonly detailsService = inject(CredentialDetailsService);
  private readonly loader = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);

  public credentialStatus = this.detailsService.credentialStatus;
  public credentialDetailsForm = this.detailsService.credentialDetailsForm;
  public credentialDetailsFormSchema = this.detailsService.credentialDetailsFormSchema;
  public isLoading$ = this.loader.isLoading$;

  public showReminderButton = computed(()=>{
    return (this.credentialStatus() === 'WITHDRAWN') || (this.credentialStatus() === 'DRAFT') || (this.credentialStatus() === 'PEND_DOWNLOAD');
  })

  public showSignCredentialButton = computed(()=>{
    return this.credentialStatus() === 'PEND_SIGNATURE';
  });

  public ngOnInit(): void {
    this.getProcedureId();
    this.initializeForm();
  }
  
  private getProcedureId(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.detailsService.setProcedureId(id);
  }
  

  private loadCredentialDetailAndForm(): void {
    this.detailsService.loadCredentialDetailAndForm();
  }

  //async function
  private initializeForm(): void {
    this.loadCredentialDetailAndForm();
  }

  //SEND REMINDER
  public openSendReminderDialog(){
    this.detailsService.openSendReminderDialog();
  }

  // SIGN
  public openSignCredentialDialog(){
    this.detailsService.openSignCredentialDialog();
  }

  //template functions
  public formKeys(group: any): string[] {
    return Object.keys(group.controls);
  }
  
  public getControlType(control: any): 'group' | 'array' | 'control' {
    if (control.controls && control.getRawValue) {
      if (Array.isArray(control.controls)) {
        return 'array';
      }
      return 'group';
    }
    return 'control';
  }

  public asFormArray(control: AbstractControl | null): FormArray {
    return control as FormArray;
  }
  
  
  public getActionsByFunction(tmfFunction: TmfFunction): TmfAction[] {
    return getActionsByFunction(tmfFunction);
  }
  

}
