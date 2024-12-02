import { Injectable } from '@angular/core';
import { TempPower } from "../../../../core/models/temporal/temp-power.interface";
import { PopupComponent } from '../../popup/popup.component';
import { ProcedureRequest } from 'src/app/core/models/dto/procedure-request.dto';
import { tap, catchError } from 'rxjs/operators';
import { Mandatee, Mandator, Power } from "../../../../core/models/entity/lear-credential-employee.entity";
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormCredentialService {
  //states
  public addedPowersSubject = new BehaviorSubject<TempPower[]>([]);
  public selectedPowerNameSubject = new BehaviorSubject<string>('');
  
  private addedPowers$ = this.addedPowersSubject.asObservable();
  private selectedPowerName$ = this.selectedPowerNameSubject.asObservable();

  public constructor() {}

  public getPlainAddedPowers(): TempPower[]{
    return this.addedPowersSubject.getValue();
  }

  public getPlainSelectedPower(): string{
    return this.selectedPowerNameSubject.getValue();
  }

  public getAddedPowers(): Observable<TempPower[]>{
    return this.addedPowers$;
  }

  public getSelectedPowerName(): Observable<string>{
    return this.selectedPowerName$;
  }

  public setAddedPowers(powers:TempPower[]): void{
    const newaddedPowers = structuredClone(powers);
    this.addedPowersSubject.next(newaddedPowers);
  }

  public setSelectedPowerName(powerName:string): void{
    this.selectedPowerNameSubject.next(powerName);
  }

  public addPower(newPower: TempPower, isDisabled: boolean): void {
    if (isDisabled) return;

    const addedPowers = structuredClone([...this.getPlainAddedPowers(), newPower]);
    this.setAddedPowers(addedPowers);
  }


  public removePower(optionToRemove:string){
    let currentAddedPowers = this.getPlainAddedPowers();
    currentAddedPowers = currentAddedPowers.filter(
      (option) => option.tmf_function !== optionToRemove
    );
    this.setAddedPowers(currentAddedPowers);
  }

  public reset(){
    this.setAddedPowers([]);
    this.setSelectedPowerName('');
  }

  public resetForm(): Mandatee {
    return { first_name: '', last_name: '', email: '', mobile_phone: '' };
  }

  public handleSelectChange(event: Event): string {
    const selectElement = event.target as HTMLSelectElement;
    return selectElement.value;
  }

  public submitCredential(
    credential: Mandatee,
    selectedCountry: string,
    addedPowers: TempPower[],
    mandator: Mandator | null,
    mandatorLastName: string,
    signer: any,
    credentialProcedureService: any,
    popupComponent: PopupComponent,
    resetForm: () => void
  ): Observable<any> {

    const credentialToSubmit={...credential};
    let mandatorToSubmit;
    
    if(mandator){
      const mandatorFullName = mandator.commonName + ' ' + mandatorLastName;
      mandatorToSubmit = {...mandator, commonName:mandatorFullName}
    }else{
      mandatorToSubmit = {
        organizationIdentifier: "",
        organization: "",
        commonName: "",
        emailAddress: "",
        serialNumber: "",
        country: "",
      };
    }

    const countryPrefix = `+${selectedCountry}`;
    if (credentialToSubmit.mobile_phone != '' && !credentialToSubmit.mobile_phone?.startsWith(countryPrefix)) {
      credentialToSubmit.mobile_phone = `${countryPrefix} ${credentialToSubmit.mobile_phone}`;
    }
    const power: Power[] = addedPowers.map(option => {
      return this.checkTmfFunction(option);
    });

    const credentialProcedure: ProcedureRequest = {
      schema: "LEARCredentialEmployee",
      format: "jwt_vc_json",
      payload: {
        mandatee: credentialToSubmit,
        mandator: mandatorToSubmit,
        signer: signer,
        power: power
      },
      operation_mode: "S"
    };
    
    return credentialProcedureService.createProcedure(credentialProcedure).pipe(
      tap(() => {
        popupComponent.showPopup();
        resetForm();
      }),
      catchError(error => {
        popupComponent.showPopup();
        throw error;
      })
    );
  }

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
      upload: tmf_action.includes('Upload'),
      attest: tmf_action.includes('Attest')
    };
  }

  public checkTmfFunction(option: TempPower): any {
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
      case 'Certification':
        tmf_action=isCertification(option,tmf_action)
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

  public checkIfPowerIsAdded(powerName: string): boolean{
    const addedPowers = this.getPlainAddedPowers();
    return addedPowers.some(pow => pow.tmf_function === powerName);
  }

  public powersHaveFunction(): boolean{
    return this.getPlainAddedPowers().every((option:TempPower) =>
      option.execute || option.create || option.update || option.delete || option.upload
    );
  }

  public hasSelectedPower(): boolean{
    return this.getPlainAddedPowers().length > 0;
  }

}

export function isCertification(option: TempPower,tmf_action: string[]) {
  const tmf_action2=tmf_action;
  if (option.upload) tmf_action2.push('Upload');
  if (option.attest) tmf_action2.push('Attest');
  return tmf_action2;
}

export function isProductOffering(option: TempPower,tmf_action: string[]) {
  const tmf_action2=tmf_action;
  if (option.create) tmf_action2.push('Create');
  if (option.update) tmf_action2.push('Update');
  if (option.delete) tmf_action2.push('Delete');
  return tmf_action2;
}

