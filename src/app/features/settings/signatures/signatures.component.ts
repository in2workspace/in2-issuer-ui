import { Component, inject, ViewChild ,ViewEncapsulation, TemplateRef, ViewContainerRef, Injector, StaticProvider } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from '../services/configuration.service';
import { SignatureConfigPayload, SignatureMode, FormMode, SignatureConfigurationRequest, SignatureConfigurationResponse, UpdateSignatureConfigurationRequest} from '../models/signature.models';
import { SignatureConfigurationService } from '../services/signatureConfiguration.service';
import { DialogData } from 'src/app/shared/components/dialog/dialog.component';
import {  Observable, of  } from 'rxjs';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';
import {DISPLAYED_COLUMNS, SECRET_INITIAL_VALUE,SPECIAL_EDIT_FIELDS, SECRETS_FIELDS} from '../models/signature.constants';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComponentPortal } from '@angular/cdk/portal';
import { DATA_CREDENTIAL, FormCloudSignatureConfigurationComponent } from './form-signature-configuration/form-cloud-signature-configuration.component'; 
import { FORM_MODE } from './form-signature-configuration/form-cloud-signature-configuration.component';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-signatures',
  standalone: true,
  imports: [MatCard,MatCheckboxModule,MatTableModule,MatButtonModule,MatButton,MatIconModule,TranslatePipe,
    MatCardContent,MatRadioModule, FormsModule, MatSortModule, MatInputModule, MatFormFieldModule],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './signatures.component.html',
  styleUrls: ['./signatures.component.scss']

})
export class SignaturesComponent  {
  signatureMode!: string;
  enableRemoteSignature: boolean = false;
  signatureModes: string[] = Object.values(SignatureMode);
  displayedColumns: string[] = DISPLAYED_COLUMNS;
  private configurationService = inject(ConfigurationService); 
  private signatureConfigService = inject(SignatureConfigurationService); 
  private readonly dialog = inject(DialogWrapperService);
  private readonly translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  initialConfig: SignatureConfigPayload | null = null;
  private readonly loader = inject(LoaderService);

  @ViewChild(MatSort) sort!: MatSort;
  signatureConfigDataSource = new MatTableDataSource();
  private readonly viewContainerRef= inject(ViewContainerRef);
  @ViewChild('deleteForm') deleteFormTemplate!: TemplateRef<any>;


  constructor(){
      const resolvedSignatureConfig  = this.route.snapshot.data['signatureData'];
    
      const config = resolvedSignatureConfig ?.config;
      const credentials = resolvedSignatureConfig ?.credentialList;
  
      if (config) {
        this.signatureMode = config.signatureMode;
        this.enableRemoteSignature = config.enableRemoteSignature;
        this.initialConfig = { ...config };
      }
  
      this.signatureConfigDataSource.data = credentials ?? [];
  }

  editCredential(element: any) {
    let title= this.translate.instant("signature.settings.modal.edit.title");

    this.signatureConfigService.getSignatureConfigById(element.id).subscribe({
      next: (credential) => {
          this.openCredentialDialog('edit', title, credential)
      },
      error: (err) => {
        console.error('Error retrieving credential', err);
      }
    });
  }

  deleteCredential(credential: SignatureConfigurationResponse) {
    let title= this.translate.instant("signature.settings.modal.delete.title");
    this.openCredentialDialog('delete', title, credential );
  }

  addCredential(): void {
    let title= this.translate.instant("signature.settings.modal.create.title");
    this.openCredentialDialog('create', title);
  }


  private createFormInjector(mode: FormMode, credential?: SignatureConfigurationResponse): Injector {
    const providers: StaticProvider[] = [{ provide: FORM_MODE, useValue: mode }];
  
    if (credential && mode === 'edit') {
      providers.push({ provide: DATA_CREDENTIAL, useValue: credential });
    }
  
    return Injector.create({
      providers,
      parent: this.viewContainerRef.injector
    });
  }

  private buildCreatePayload(formValue: SignatureConfigurationRequest):  SignatureConfigurationRequest {
    return {
      ...formValue,
      signatureMode: this.signatureMode,
      enableRemoteSignature: true,
    };
  }
  
  private buildUpdatePayload(formValue: UpdateSignatureConfigurationRequest,signatureConfigInit: SignatureConfigurationResponse): Partial<UpdateSignatureConfigurationRequest> {
    
    const entries: [keyof UpdateSignatureConfigurationRequest, string][] = [];
  
    for (const key of Object.keys(formValue) as (keyof UpdateSignatureConfigurationRequest)[]) {
      const currentValue = formValue[key];
  
      if (currentValue === SECRET_INITIAL_VALUE ||currentValue === '' || currentValue == null) continue;
      
  
      if (SECRETS_FIELDS.has(key) || SPECIAL_EDIT_FIELDS.has(key)) {
        entries.push([key, currentValue as string]);
        continue;
      }
  
      if (key in signatureConfigInit) {
        const originalValue = signatureConfigInit[key as keyof SignatureConfigurationResponse];
        if (originalValue !== currentValue) {
          entries.push([key, currentValue as string]);
        }
      }
    }
  
    return Object.fromEntries(entries) as Partial<UpdateSignatureConfigurationRequest>;
  }
  
 
  private handleCreate(formValue: any): Observable<any> {
    const payload = this.buildCreatePayload(formValue);
    return this.signatureConfigService.addCredentialConfiguration(payload);
  }
  
  private handleEdit(formValue: any, credential: SignatureConfigurationResponse): Observable<any> {
    let payload = this.buildUpdatePayload(formValue, credential);
     //If you only wrote the reason but didn't edit anything, it means there are no changes.
    if (!Object.keys(payload).length 
      || (Object.keys(payload).length === 1 && payload?.rationale)) {
      return of({ noChanges: true });
    }
    return this.signatureConfigService.updateConfiguration(credential.id, payload);
  }
  
  private handleDelete(formValue: any, credential: SignatureConfigurationResponse): Observable<any> {
    const rationale = formValue?.rationale;
    return this.signatureConfigService.deleteSignatureConfiguration(credential.id, rationale);
  }
  

  private getAsyncOperation(
    mode: FormMode,
    credential?: SignatureConfigurationResponse
  ): (formValue: any) => Observable<any> {
    return (formValue: any) => {
      switch (mode) {
        case 'create':
          return this.handleCreate(formValue);
  
        case 'edit':
          return credential 
            ? this.handleEdit(formValue, credential)
            : of(null);
  
        case 'delete':
          return credential
            ? this.handleDelete(formValue, credential)
            : of(null);
  
        default:
          return of(null);
      }
    };
  }
  
  
  openCredentialDialog(mode: FormMode, title: string, credential?: SignatureConfigurationResponse): void {
    const injector = this.createFormInjector(mode, credential);
    
    const formPortal = new ComponentPortal(FormCloudSignatureConfigurationComponent, null, injector);
  
    const dialogData: DialogData = {
      title,
      message: '',
      confirmationType: 'async',
      status: 'default',
      template: formPortal,
      confirmationLabel: this.translate.instant('dialog.save'),
      style: 'responsive-dialog'
    };
  
    const validateForm = (formInst: any) => formInst.isValid();
    const getFormValue = (formInst: any) => formInst.getFormValue();
  
    const asyncOperation = this.getAsyncOperation(mode, credential);
  
    const dialogRef = this.dialog.openDialogWithForm(dialogData, validateForm, getFormValue, asyncOperation);
  
    dialogRef.afterClosed().subscribe(() => {
      this.reloadCredentialList();
    });
  }
  
  
  reloadCredentialList(): void {
    this.signatureConfigService.getAllConfiguration(SignatureMode.CLOUD).subscribe({
      next: (credentials) => {
        this.signatureConfigDataSource.data = credentials ?? [];
        this.loader.updateIsLoading(false);
      },
      error: (err) => {
        console.error('Error reloading credentials', err);
      }
    });
  }
  

  saveConfiguration() {
    if(!this.initialConfig){
      this.createConfiguration();
    }else{
      this.updateConfiguration();
    }
  }

  updateConfiguration(){
    const patchPayload = this.getChangedConfig();
    if (Object.keys(patchPayload).length === 0) return;
    this.configurationService.updateConfiguration(patchPayload).subscribe({
        next: () => {
          this.initialConfig = { enableRemoteSignature: this.enableRemoteSignature, signatureMode: this.signatureMode }
        },
        error: (err:any) => console.error('Error updating configuration', err)
    });
  }

   

  createConfiguration() {
    this.configurationService.saveConfiguration(this.enableRemoteSignature, this.signatureMode).subscribe({
        next:()=> this.initialConfig = { enableRemoteSignature: this.enableRemoteSignature, signatureMode: this.signatureMode },
        error:(err) => console.error('Error saving configuration', err),
    });
  }

  get isConfigChanged(): boolean {
    if(this.signatureMode==undefined) return false;
    return Object.keys(this.getChangedConfig()).length > 0;
  }

  getChangedConfig(): Partial<SignatureConfigPayload> {
    const updateConfig: Partial<SignatureConfigPayload> = {};
    if (!this.initialConfig || this.signatureMode !== this.initialConfig.signatureMode) {
      updateConfig.signatureMode = this.signatureMode;
    }
    if (!this.initialConfig || this.enableRemoteSignature !== this.initialConfig.enableRemoteSignature) {
      updateConfig.enableRemoteSignature = this.enableRemoteSignature;
    }
    return updateConfig;
  }


}
