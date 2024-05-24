import { Injectable } from '@angular/core';
import { TempPower } from '../../power/power/power.component';
import { Power } from 'src/app/core/models/power.interface';
import { CredentialMandatee } from 'src/app/core/models/credendentialMandatee.interface';
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
      execute: power.tmf_action.includes('Execute') || power.tmf_action.includes('Operator'),
      create: power.tmf_action.includes('Create') || power.tmf_action.includes('Customer'),
      update: power.tmf_action.includes('Update') || power.tmf_action.includes('Provider'),
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    credentialProcedureService: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    alertService: any,
    resetForm: () => void
  ): void {
    credential.mobile_phone = `+${selectedCountry} ${credential.mobile_phone}`;

    const power: Power[] = addedOptions.map(option => {
      const tmf_action: string[] = [];
      if (option.tmf_function === 'DomePlatform') {
        if (option.execute) tmf_action.push('Operator');
        if (option.create) tmf_action.push('Customer');
        if (option.update) tmf_action.push('Provider');
      } else {
        if (option.execute) tmf_action.push('Execute');
        if (option.create) tmf_action.push('Create');
        if (option.update) tmf_action.push('Update');
        if (option.delete) tmf_action.push('Delete');
      }

      return {
        tmf_action,
        tmf_domain: option.tmf_domain,
        tmf_function: option.tmf_function,
        tmf_type: option.tmf_type
      };
    });

    const credentialProcedure = {
      credential: {
        mandatee: credential,
        mandator: mandator!,
        power: power
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
