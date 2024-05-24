import { Injectable } from '@angular/core';
import { TempPower } from '../../power/power/power.component';
import { Power } from 'src/app/core/models/power.interface';
import { CredentialMandatee } from 'src/app/core/models/credendentialMandatee.interface';
import { CredentialProcedure } from 'src/app/core/models/credentialProcedure.interface';
import { Mandator } from 'src/app/core/models/madator.interface';

@Injectable({
  providedIn: 'root'
})
export class FormCredentialService {

  public convertToTempPower(power: Power): TempPower {
    return {
      tmf_action: power.tmf_action,
      tmf_domain: power.tmf_domain,
      tmf_function: power.tmf_function,
      tmf_type: power.tmf_type,
      execute: power.tmf_action.includes('Execute'),
      create: power.tmf_action.includes('Create'),
      update: power.tmf_action.includes('Update'),
      delete: power.tmf_action.includes('Delete')
    };
  }

  public resetForm(): CredentialMandatee {
    return { first_name: '', last_name: '', email: '', mobile_phone: '' };
  }

  public addOption(addedOptions: TempPower[], options: TempPower[], isDisabled: boolean): TempPower[] {
    if (isDisabled) return addedOptions;
    return options;
  }

  public handleSelectChange(event: Event): string {
    const selectElement = event.target as HTMLSelectElement;
    return selectElement.value;
  }

  public submitCredential(
    credential: CredentialMandatee,
    selectedCountry: string,
    addedOptions: TempPower[],
    mandator: Mandator | null,
    credentialProcedureService: any,
    alertService: any,
    resetForm: () => void
  ): void {
    credential.mobile_phone = `+${selectedCountry} ${credential.mobile_phone}`;

    const powers: Power[] = addedOptions.map(option => {
      const tmf_action: string[] = [];
      if (option.execute) tmf_action.push('Execute');
      if (option.create) tmf_action.push('Create');
      if (option.update) tmf_action.push('Update');
      if (option.delete) tmf_action.push('Delete');

      return {
        tmf_action,
        tmf_domain: option.tmf_domain,
        tmf_function: option.tmf_function,
        tmf_type: option.tmf_type
      };
    });

    const credentialProcedure: CredentialProcedure = {
      procedure_id: 'proc-' + new Date().getTime(),
      full_name: `${credential.first_name} ${credential.last_name}`,
      status: 'issued',
      updated: new Date().toISOString().split('T')[0],
      credential: {
        mandatee: credential,
        mandator: mandator!,
        powers: powers
      }
    };

    credentialProcedureService.saveCredentialProcedure(credentialProcedure).subscribe({
      next: () => {
        alertService.showAlert('Credential created successfully!', 'success');
        resetForm();
      },
      error: (error: unknown) => {
        alertService.showAlert('Error creating credential: ' + error, 'error');
      },
    });
  }
}
