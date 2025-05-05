import { MatCard, MatCardContent } from '@angular/material/card';
import { AddPrefixPipe } from '../../../../shared/pipes/add-prefix.pipe';
import { CapitalizePipe } from './../../../../shared/pipes/capitalize.pipe';
import { DetailService } from './../../services/detail.service';
import { PowerActionsMap, TmfAction} from './../../models/detail-models';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { FormSchema } from '../../models/detail-form-models';
import { MatIcon } from '@angular/material/icon';


@Component({
  standalone: true,
  imports: [AddPrefixPipe, CapitalizePipe, CommonModule, FormsModule, MatCard, MatCardContent, MatFormField, MatIcon, MatInput, MatLabel, MatSlideToggle, ReactiveFormsModule, TranslatePipe ],
  selector: 'app-detail-from',
  templateUrl: './detail-form.component.html',
  styleUrl: './detail-form.component.scss'
})
export class DetailFormComponent implements OnInit {
  credentialId!: string;
  form: FormGroup | undefined;
  formSchema!: FormSchema;

  private route = inject(ActivatedRoute);
  private detailService = inject(DetailService);

  constructor() {}

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
    this.form = this.detailService.form;
    this.formSchema = this.detailService.formSchema;
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
  
  
  getActionsForType(type: string): string[] {
    return PowerActionsMap[type as TmfAction] || [];
  }
  

}
