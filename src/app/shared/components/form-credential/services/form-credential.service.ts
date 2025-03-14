import { Injectable } from '@angular/core';
import { ProcedureRequest } from 'src/app/core/models/dto/procedure-request.dto';
import { catchError } from 'rxjs/operators';
import { Mandatee, Mandator, Power } from "../../../../core/models/entity/lear-credential-employee.entity";
import { Observable, BehaviorSubject } from 'rxjs';
import { TempPower } from 'src/app/core/models/temporal/temp-power.interface';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { Country } from './country.service';

@Injectable({
  providedIn: 'root'
})
export class FormCredentialService {
  //states
  public addedPowersSubject = new BehaviorSubject<TempPower[]>([]);
  public selectedPowerNameSubject = new BehaviorSubject<string>('');

  private readonly addedPowers$ = this.addedPowersSubject.asObservable();
  private readonly selectedPowerName$ = this.selectedPowerNameSubject.asObservable();

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
      (option) => option.function !== optionToRemove
    );
    this.setAddedPowers(currentAddedPowers);
  }

  public reset(){
    this.setAddedPowers([]);
    this.setSelectedPowerName('');
  }

  public resetForm(): Mandatee {
    return { firstName: '', lastName: '', email: '', nationality: '' };
  }

  public handleSelectChange(event: Event): string {
    const selectElement = event.target as HTMLSelectElement;
    return selectElement.value;
  }

  public submitCredential(
    credential: Mandatee,
    selectedMandatorCountry: Country | undefined,
    addedPowers: TempPower[],
    mandator: Mandator,
    mandatorLastName: string,
    credentialProcedureService: CredentialProcedureService
  ): Observable<void> {

    const credentialToSubmit = { ...credential };
    let mandatorToSubmit = structuredClone(mandator);


    //Prepare mandator
    //this will only happen as a Signer
    if(mandator && selectedMandatorCountry){
      //create full common name
      const mandatorFullName = mandator.commonName + ' ' + mandatorLastName;
      mandatorToSubmit = { ...mandator, commonName: mandatorFullName };

      //create full VAT company name
      const fullOrgId = 'VAT' + selectedMandatorCountry.isoCountryCode + '-' + mandator.organizationIdentifier;
      mandatorToSubmit = { ...mandatorToSubmit, organizationIdentifier: fullOrgId };
    }

    //Prepare powers
    const power: Power[] = addedPowers.map(option => {
      return this.checkFunction(option);
    });

    const credentialProcedure: ProcedureRequest = {
      schema: "LEARCredentialEmployee",
      format: "jwt_vc_json",
      payload: {
        mandatee: credentialToSubmit,
        mandator: mandatorToSubmit,
        power: power
      },
      operation_mode: "S"
    };

    return credentialProcedureService.createProcedure(credentialProcedure).pipe(
      //currently there's no need to reset form, since user is redirected to home and page reloads after creating
      catchError(error => {
        //server-error-interceptor acts here
        throw error;
      })
    );
  }

  public convertToTempPower(power: Power): TempPower {
    const action = Array.isArray(power.action) ? power.action : [power.action];
    return {
      action: power.action,
      domain: power.domain,
      function: power.function,
      type: power.type,
      execute: action.includes('Execute'),
      create: action.includes('Create'),
      update: action.includes('Update'),
      delete: action.includes('Delete'),
      upload: action.includes('Upload'),
      attest: action.includes('Attest')
    };
  }

  public checkFunction(option: TempPower): Power {
    if (option.function === 'Onboarding') {
      return {
        action: option.execute ? 'Execute' : '',
        domain: option.domain,
        function: option.function,
        type: option.type
      };
    }
    let action: string[] = [];
    switch (option.function) {
      case 'Certification':
        action=isCertification(option,action)
        break;
      case 'ProductOffering':
        action=isProductOffering(option,action)
        break;
      default:
        break;
    }

    return {
      action: action,
      domain: option.domain,
      function: option.function,
      type: option.type
    };

  }

  public checkIfPowerIsAdded(powerName: string): boolean{
    const addedPowers = this.getPlainAddedPowers();
    return addedPowers.some(pow => pow.function === powerName);
  }

  public powersHaveFunction(): boolean{
    return this.getPlainAddedPowers().every((option:TempPower) =>
      option.execute || option.create || option.update || option.delete || option.upload || option.attest
    );
  }

  public hasSelectedPower(): boolean{
    return this.getPlainAddedPowers().length > 0;
  }

}

export function isCertification(option: TempPower,action: string[]) {
  const action2=action;
  if (option.upload) action2.push('Upload');
  if (option.attest) action2.push('Attest');
  return action2;
}

export function isProductOffering(option: TempPower,action: string[]) {
  const action2=action;
  if (option.create) action2.push('Create');
  if (option.update) action2.push('Update');
  if (option.delete) action2.push('Delete');
  return action2;
}

