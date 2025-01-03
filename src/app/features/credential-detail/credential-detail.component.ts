import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable, switchMap, tap, timer } from 'rxjs';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { LEARCredentialEmployeeJwtPayload } from "../../core/models/entity/lear-credential-employee.entity";
import { LearCredentialEmployeeDataDetail } from "../../core/models/dto/lear-credential-employee-data-detail.dto";
import { FormCredentialComponent } from '../../shared/components/form-credential/form-credential.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';
import { DialogData } from 'src/app/shared/components/dialog/dialog.component';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
    selector: 'app-credential-detail',
    templateUrl: './credential-detail.component.html',
    standalone: true,
    imports: [
        NgIf,
        FormCredentialComponent,
        AsyncPipe,
    ],
})
export class CredentialDetailComponent implements OnInit {
  public title = timer(0).pipe(switchMap(()=>this.translate.get("credentialDetail.credentialDetails")));
  public credentialId: string | null = null;
  public credential: LEARCredentialEmployeeJwtPayload | null = null;
  public credentialStatus: string | null = null;
  public isLoading$: Observable<boolean>;

  private readonly route = inject(ActivatedRoute);
  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(DialogWrapperService);
  private readonly loader = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  public constructor(){
    this.isLoading$ = this.loader.isLoading$;
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.credentialId = params.get('id');
      if (this.credentialId) {
        this.loadCredentialDetail(this.credentialId);
      }
    });
  }

  public loadCredentialDetail(procedureId: string): void {
    this.credentialProcedureService.getCredentialProcedureById(procedureId).subscribe({
      next: (credentials: LearCredentialEmployeeDataDetail) => {
        this.credential = credentials['credential'];
        this.credentialStatus = credentials['credential_status'];
      },
      error: (error: Error) => {
        console.error('Error fetching credential details', error);
      }
    });
   
  }

  public sendReminder(): void {
    const credentialId = this.credentialId;
    if (!credentialId){
      console.error('No credential id.');
      return;
    }

    const dialogData: DialogData = {
      title: this.translate.instant("credentialDetail.sendReminderConfirm.title"),
      message: this.translate.instant("credentialDetail.sendReminderConfirm.message"),
      confirmationType: 'async',
      status: 'default',
      loadingData: undefined
    };

    const sendReminderAfterConfirm = (): Observable<any> => {
      return this.credentialProcedureService.sendReminder(credentialId)
        .pipe(
          switchMap(()  => 
            from(this.router.navigate(['/organization/credentials'])).pipe(
              tap(() => location.reload())
            )
          ));
    }
    
    this.dialog.openDialogWithCallback(dialogData, sendReminderAfterConfirm);

  }

}
