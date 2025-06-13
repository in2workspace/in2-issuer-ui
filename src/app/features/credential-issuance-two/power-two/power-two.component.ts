import { IssuanceFormSchemaPower } from './../../../core/models/entity/lear-credential-issuance-schemas';
import { Component, OnInit, Signal, WritableSignal, computed, inject, input, signal } from '@angular/core';
import { AuthService } from "../../../core/services/auth.service";
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { NgIf, NgFor, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';

export interface TempIssuanceFormSchemaPower extends IssuanceFormSchemaPower{
  isDisabled?: boolean;
}

export interface NormalizedTempIssuanceFormSchemaPower extends TempIssuanceFormSchemaPower{
  normalizedActions: NormalizedAction[];
}

type NormalizedAction = { action: string; value: boolean };


@Component({
    selector: 'app-power-two',
    templateUrl: './power-two.component.html',
    styleUrls: ['./power-two.component.scss'],
    standalone: true,
    imports: [NgIf, MatFormField, MatSelect, MatSelectTrigger, MatOption, MatButton, NgFor, NgTemplateOutlet, MatSlideToggle, FormsModule, MatMiniFabButton, MatIcon, MatLabel, MatSelect, AsyncPipe, TranslatePipe]
})
export class PowerTwoComponent implements OnInit{

  public organizationIdentifierIsIn2: boolean = false;

  //streams (form states)
  public _selectablePowers$: Signal<TempIssuanceFormSchemaPower[]> = input.required<TempIssuanceFormSchemaPower[]>();
  public selectablePowers$: WritableSignal<TempIssuanceFormSchemaPower[] | undefined> = signal(undefined);
  public selectedPower$: WritableSignal<TempIssuanceFormSchemaPower | undefined> = signal(undefined);
  public addedPowers$: WritableSignal<TempIssuanceFormSchemaPower[]> = signal([]);
  public powersFormModel$: Signal<NormalizedTempIssuanceFormSchemaPower[]> = computed(() => {
    return this.normalizePowers(this.addedPowers$())
  });

normalizePowers(powers: TempIssuanceFormSchemaPower[]): NormalizedTempIssuanceFormSchemaPower[] {
  const normalizedPowers = powers.map(p => {
    const normalizedActions: NormalizedAction[] = [];
    
    const actions = Array.isArray(p.action) ? p.action : [p.action];
    
    for (let i = 0; i < actions.length; i++) {
      normalizedActions.push({action:actions[i], value: false});
    }
    
    return {
      ...p,
      normalizedActions
    };
  });
  
  return normalizedPowers;
}

  isAddDisabled$ = computed(()=>{
    return !this.selectedPower$() || this.isPowerDisabled(this.selectedPower$()!)
  });

  private readonly authService = inject(AuthService);
  private readonly dialog = inject(DialogWrapperService);
  private readonly translate = inject(TranslateService);



 public isPowerDisabled(power:IssuanceFormSchemaPower): boolean{
  return this.addedPowers$().some(p => p.function === power.function && p.action === power.action);
 }
  public ngOnInit(){
    this.organizationIdentifierIsIn2 = this.authService.hasIn2OrganizationIdentifier();
    this.selectablePowers$.set(this._selectablePowers$());
  }

  public addPower(): void {
    const selectedPower = this.selectedPower$();
    if(!selectedPower){
      console.error('Trying to add a power but there is no selected power');
      return;
    }
    const currentSelectedPowers = this.addedPowers$();
    this.addedPowers$?.set([...currentSelectedPowers, selectedPower]);
    console.log('add power: ');
    console.log(selectedPower);
    this.selectedPower$.set(undefined);
    const selectablePowers = this.selectablePowers$();
    let updatedSelectablePowers;
    if(selectablePowers){
      updatedSelectablePowers = this.updatePowers(selectablePowers, selectedPower);
    }
    this.selectablePowers$.set(updatedSelectablePowers);
    console.log('slected powers:');
    console.log(this.addedPowers$())
  
  }


public updatePowers(powers:TempIssuanceFormSchemaPower[], power: TempIssuanceFormSchemaPower){
  return powers.map(p => p.function === power.function ? {...p, isDisabled: true} : p);
}




  public removePower(powerToRemove: string): void {
  //   const dialogData: DialogData = {
  //       title: this.translate.instant("power.remove-dialog.title"),
  //       message: this.translate.instant("power.remove-dialog.message") + powerToRemove,
  //       confirmationType: 'sync',
  //       status: `default`
  //   }
  //   const removeAfterClose =  (): Observable<any> => {
  //     this.formService.removePower(powerToRemove);
  //     return EMPTY;
  //   };
  //   this.dialog.openDialogWithCallback(dialogData, removeAfterClose);
  // }

  // public onHandleSelectChange(event: MatSelectChange): void {
  //   this.formService.setSelectedPowerName(event.value);
  // }

  // public isOptionDisabled(power: string): boolean {
  //   return this.formService.checkIfPowerIsAdded(power);
  }

}
