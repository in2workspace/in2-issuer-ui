import { Component, Input, inject } from '@angular/core';
import { AuthService } from "../../../../core/services/auth.service";
import { TempPower } from "../../../../core/models/temporal/temp-power.interface";
import { TranslatePipe } from '@ngx-translate/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { PopupComponent } from '../../popup/popup.component';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgTemplateOutlet } from '@angular/common';
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {FormCredentialService} from "../../form-credential/services/form-credential.service";
import {MatSelectChange} from "@angular/material/select";
import {ConfirmDialogComponent} from "../../confirm-dialog/confirm-dialog.component";

@Component({
    selector: 'app-power',
    templateUrl: './power.component.html',
    styleUrls: ['./power.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule, NgFor, NgTemplateOutlet, PopupComponent, MatSlideToggle, TranslatePipe]
})
export class PowerComponent {
  // set-once-and-don't-change properties
  @Input() public isDisabled: boolean = false;
  @Input() public viewMode: 'create' | 'detail' = 'create'; //currently isDisabled and viewMode are interchangeable
  @Input() public power: TempPower[] = [];
  public organizationIdentifierIsIn2: boolean = false;

  //streams (form states)
  public addedPowers$: Observable<TempPower[]>
  public selectedPower$: Observable<string>;

  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly formService = inject(FormCredentialService);

  ngOnInit(): void {
    this.organizationIdentifierIsIn2 = this.authService.hasIn2OrganizationIdentifier();
  }

  public constructor(){
    this.addedPowers$ = this.formService.getAddedPowers();
    this.selectedPower$ = this.formService.getSelectedPowerName();
  }

  public addPower(): void {
    if (this.isDisabled) return;
    const selectedPower = this.formService.getPlainSelectedPower();

    if(this.isOptionDisabled(selectedPower)) return;

    if (selectedPower === 'Onboarding' && !this.organizationIdentifierIsIn2) {
      return;
    }

    if (selectedPower === 'Certification' && !this.organizationIdentifierIsIn2) {
      return;
    }

    const newPower: TempPower = {
      tmf_action: '',
      tmf_domain: 'DOME',
      tmf_function: selectedPower,
      tmf_type: 'Domain',
      execute: false,
      create: false,
      update: false,
      delete: false,
      upload: false,
      attest: false
    };

    switch(selectedPower) {
      case 'Certification':
        newPower.upload = false;
        newPower.attest = false;
        break;
      case 'ProductOffering':
        newPower.create = false;
        newPower.update = false;
        newPower.delete = false;
        break;
      case 'Onboarding':
        newPower.execute = false;
        break;
      default:
        break;
    }

    this.formService.addPower(newPower, this.isDisabled);
    this.formService.setSelectedPowerName('');
  }

  public removePower(powerToRemove: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Remove Power ${powerToRemove}`,
        message: `Are you sure you want to remove this power: ${powerToRemove}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.formService.removePower(powerToRemove);
      }
    });
  }

  public onHandleSelectChange(event: MatSelectChange): void {
    this.formService.setSelectedPowerName(event.value);
  }

  public isOptionDisabled(power: string): boolean {
    return this.formService.checkIfPowerIsAdded(power);
  }
}
