import { Injectable } from '@angular/core';
import { TempPower } from '../../power/power/power.component';
import { Power } from 'src/app/core/models/power.interface';
import { CredentialMandatee } from 'src/app/core/models/credendentialMandatee.interface';
import { Mandator } from 'src/app/core/models/madator.interface';
import { PopupComponent } from '../../popup/popup.component';
import { IssuanceRequest } from 'src/app/core/models/issuanceRequest.interface';

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
    signer:any,
    credentialProcedureService: any,
    popupComponent: PopupComponent,
    resetForm: () => void
  ): void {
    const countryPrefix = `+${selectedCountry}`;
    if (credential.mobile_phone != '' && !credential.mobile_phone?.startsWith(countryPrefix)) {
      credential.mobile_phone = `${countryPrefix} ${credential.mobile_phone}`;
    }

    const power: Power[] = addedOptions.map(option => {
      return checkTmfFunction(option);
    });

    const credentialProcedure:IssuanceRequest =  {
      schema: "LEARCredentialEmployee",
      format: "jwt_vc_json",
      payload: {
        mandatee: credential,
        mandator: mandator!,
        signer:signer,
        power: power
      },
      operation_mode: "S"
    };
    

    credentialProcedureService.createProcedure(credentialProcedure).subscribe({
      next: () => {
        popupComponent.showPopup();
        resetForm();
      },
      error: () => {
        popupComponent.showPopup();
      }
    });
  }
}
export function isDomePlatform(option: TempPower,tmf_action: string[]) {
  const tmf_action2=tmf_action;
  if (option.operator) tmf_action2.push('Operator');
  if (option.customer) tmf_action2.push('Customer');
  if (option.provider) tmf_action2.push('Provider');
  if (option.marketplace) tmf_action2.push('Marketplace');
  return tmf_action2;
}
export function isProductOffering(option: TempPower,tmf_action: string[]) {
  const tmf_action2=tmf_action;
  if (option.create) tmf_action2.push('Create');
  if (option.update) tmf_action2.push('Update');
  if (option.delete) tmf_action2.push('Delete');
  return tmf_action2;
}
function checkTmfFunction(option: TempPower): any {
  if (option.tmf_function === 'Onboarding') {
    return {
      tmf_action: option.execute ? 'Execute' : '',
      tmf_domain: option.tmf_domain,
      tmf_function: option.tmf_function,
      tmf_type: option.tmf_type
    };
  }
  let tmf_action: string[] = [];
  switch (option.tmf_function) {
    case 'DomePlatform':
      tmf_action=isDomePlatform(option,tmf_action)
      break;
    case 'ProductOffering':
      tmf_action=isProductOffering(option,tmf_action)
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

