import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject
} from '@angular/core';
import { FormGroupDirective, FormsModule } from '@angular/forms';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { Country, CountryService } from './services/country.service';
import { FormCredentialService } from './services/form-credential.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatOption } from '@angular/material/core';
import { TempPower } from "../../../core/models/temporal/temp-power.interface";
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { from, Observable, of, switchMap, tap } from 'rxjs';
import { Mandatee, OrganizationDetails, Power } from 'src/app/core/models/entity/lear-credential-employee.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { PowerComponent } from '../power/power.component';
import { OrganizationIdentifierValidatorDirective } from '../../directives/validators/organization-identifier.directive';
import { OrganizationNameValidatorDirective } from '../../directives/validators/organization-name.validator.directive';
import { MatSelect } from '@angular/material/select';
import { CustomEmailValidatorDirective } from '../../directives/validators/custom-email-validator.directive';
import {NgIf, NgTemplateOutlet, AsyncPipe, NgForOf} from '@angular/common';
import { MaxLengthDirective } from '../../directives/validators/max-length-directive.directive';
import { UnicodeValidatorDirective } from '../../directives/validators/unicode-validator.directive';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NavbarComponent } from '../navbar/navbar.component';
import { DialogWrapperService } from '../dialog/dialog-wrapper/dialog-wrapper.service';
import { DialogData } from '../dialog/dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-form-credential',
  templateUrl: './form-credential.component.html',
  styleUrls: ['./form-credential.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    CustomEmailValidatorDirective,
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatProgressSpinnerModule,
    MatSelect,
    MaxLengthDirective,
    NavbarComponent,
    NgIf,
    NgTemplateOutlet,
    OrganizationIdentifierValidatorDirective,
    OrganizationNameValidatorDirective,
    PowerComponent,
    RouterLink,
    TranslatePipe,
    UnicodeValidatorDirective,
    NgForOf,
  ],
})
export class FormCredentialComponent implements OnInit, OnDestroy {
  @ViewChild('formDirective') public formDirective!: FormGroupDirective;
  @Output() public sendReminder = new EventEmitter<void>();
  @Input({ required: true }) public viewMode: 'create' | 'detail' = 'create';
  @Input() public asSigner: boolean = false;
  @Input() public isDisabled: boolean = false;
  @Input() public title: string = '';
  @Input() public power: Power[] = [];
  @Input() public credentialStatus: string = '';
  @Input() public credential: Mandatee = this.initializeCredential();
  @Input() public mandator: OrganizationDetails = this.initializeOrganizationDetails();
  public signer: OrganizationDetails = this.initializeOrganizationDetails();
  public isLoading$: Observable<boolean>;

  public addedPowers$: Observable<TempPower[]>;

  public tempPowers: TempPower[] = [];
  public countries: Country[] = [];
  public hasIn2OrganizationId = false;
  public addedMandatorLastName: string = '';

  public readonly translate = inject(TranslateService);
  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly formService = inject(FormCredentialService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly countryService = inject(CountryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(DialogWrapperService);
  private readonly loader = inject(LoaderService);

  public constructor() {
    this.countries = this.countryService.getSortedCountries();
    this.addedPowers$ = this.formService.getAddedPowers();
    this.hasIn2OrganizationId = this.authService.hasIn2OrganizationIdentifier();
    this.isLoading$ = this.loader.isLoading$;
  }

  public ngOnInit(): void {
    this.authService.getMandator()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(mandator2 => {
        if (mandator2) {
          if (this.viewMode === "create" && !this.asSigner) {
            this.mandator = {
              organizationIdentifier: mandator2.organizationIdentifier,
              organization: mandator2.organization,
              commonName: mandator2.commonName,
              emailAddress: mandator2.emailAddress,
              serialNumber: mandator2.serialNumber,
              country: mandator2.country
            };
          }
          this.authService.getSigner()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(signer => {
              this.signer = {
                organizationIdentifier: signer?.organizationIdentifier ?? '',
                organization: signer?.organization ?? '',
                commonName: signer?.commonName ?? '',
                emailAddress: signer?.emailAddress ?? '',
                serialNumber: signer?.serialNumber ?? '',
                country: signer?.country ?? ''
              };
            });
        }
      });

    if (this.viewMode === 'detail') {
      this.tempPowers = this.power.map(power => this.formService.convertToTempPower(power));
    }
  }

  public openSubmitDialog() {
    const dialogData: DialogData = {
      title: this.translate.instant("credentialIssuance.create-confirm-dialog.title"),
      message: this.translate.instant("credentialIssuance.create-confirm-dialog.message"),
      confirmationType: 'async',
      status: 'default',
      loadingData: {
        title: this.translate.instant("credentialIssuance.creating-credential"),
        message: ''
      }
    };

    const submitAfterDialogClose = (): Observable<any> => {
      return this.submitCredential();
    };
    this.dialog.openDialogWithCallback(dialogData, submitAfterDialogClose);
  }

  public submitCredential(): Observable<any> {
    // mandatory if asSigner
    let selectedMandatorCountry: Country | undefined = undefined;
    if (this.asSigner) {
      selectedMandatorCountry = this.countryService.getCountryFromName(this.mandator.country);
    }

    if (this.hasSelectedPower() && this.selectedPowersHaveFunction()) {
      return this.formService.submitCredential(
        this.credential,
        selectedMandatorCountry,
        this.formService.getPlainAddedPowers(),
        this.mandator,
        this.addedMandatorLastName,
        this.credentialProcedureService)
        .pipe(
          // After submitting credential, show success popup and navigate to dashboard after close
          switchMap(() => {
            const dialogData: DialogData = {
              title: this.translate.instant("credentialIssuance.create-success-dialog.title"),
              message: this.translate.instant("credentialIssuance.create-success-dialog.message"),
              confirmationType: 'none',
              status: 'default'
            };

            const dialogRef = this.dialog.openDialog(dialogData);
            return dialogRef.afterClosed();
          }),
          switchMap(() => from(this.navigateToCredentials())),
          tap(() => location.reload())
        );
    } else {
      console.error('Data to submit is not valid');
      return of(undefined);
    }
  }

  public navigateToCredentials(): Promise<boolean> {
    return this.router.navigate(['/organization/credentials']);
  }

  public triggerSendReminder(): void {
    this.sendReminder.emit();
  }

  public hasSelectedPower(): boolean {
    return this.formService.hasSelectedPower();
  }

  public selectedPowersHaveFunction(): boolean {
    return this.formService.powersHaveFunction();
  }

  public showReminderButton(): boolean {
    return (this.viewMode === 'detail') && ((this.credentialStatus === 'WITHDRAWN') || (this.credentialStatus === 'DRAFT') || (this.credentialStatus === 'PEND_DOWNLOAD'));
  }

  public ngOnDestroy(): void {
    this.formService.reset();
  }

  private initializeCredential(): Mandatee {
    return {
      firstName: '',
      lastName: '',
      email: '',
      nationality: ''
    };
  }

  private initializeOrganizationDetails(): OrganizationDetails {
    return {
      organizationIdentifier: '',
      organization: '',
      commonName: '',
      emailAddress: '',
      serialNumber: '',
      country: ''
    };
  }
}
