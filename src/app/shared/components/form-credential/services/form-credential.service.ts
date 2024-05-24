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
    const tmf_action = Array.isArray(power.tmf_action) ? power.tmf_action : [power.tmf_action];
    return {
      tmf_action: power.tmf_action,
      tmf_domain: power.tmf_domain,
      tmf_function: power.tmf_function,
      tmf_type: power.tmf_type,
      execute: tmf_action.includes('Execute'),
      create: tmf_action.includes('Create'),
      update: tmf_action.includes('Update'),
      delete: tmf_action.includes('Delete'),
      operator: tmf_action.includes('Operator'),
      customer: tmf_action.includes('Customer'),
      provider: tmf_action.includes('Provider'),
      marketplace: tmf_action.includes('Marketplace')
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

    const power: Power[] = addedOptions.map(option => {
      if (option.tmf_function === 'Onboarding') {
        return {
          tmf_action: option.execute ? 'Execute' : '',
          tmf_domain: option.tmf_domain,
          tmf_function: option.tmf_function,
          tmf_type: option.tmf_type
        };
      } else {
        const tmf_action: string[] = [];
        switch(option.tmf_function) {
          case 'DomePlatform':
            if (option.operator) tmf_action.push('Operator');
            if (option.customer) tmf_action.push('Customer');
            if (option.provider) tmf_action.push('Provider');
            if (option.marketplace) tmf_action.push('Marketplace');
            break;
          case 'ProductOffering':
            if (option.create) tmf_action.push('Create');
            if (option.update) tmf_action.push('Update');
            if (option.delete) tmf_action.push('Delete');
            break;
          default:
            break;
        }

        return {
          tmf_action,
          tmf_domain: option.tmf_domain,
          tmf_function: option.tmf_function,
          tmf_type: option.tmf_type
        };
      }
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
