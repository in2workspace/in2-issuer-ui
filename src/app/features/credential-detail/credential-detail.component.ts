import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, timer } from 'rxjs';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { LEARCredentialEmployeeJwtPayload } from "../../core/models/entity/lear-credential-employee.entity";
import { LearCredentialEmployeeDataDetail } from "../../core/models/dto/lear-credential-employee-data-detail.dto";
import { FormCredentialComponent } from '../../shared/components/form-credential/form-credential.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';
import { DialogData } from 'src/app/shared/components/dialog/dialog.component';

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

  private readonly route = inject(ActivatedRoute);
  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(DialogWrapperService);
  private readonly destroyRef = inject(DestroyRef);

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
      error: (error: any) => {
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
      isConfirmDialog: true,
      status: 'warn'
    };
    const confirmDialogRef = this.dialog.openDialog(dialogData);

    confirmDialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: boolean) => {
        if (result) {
          this.credentialProcedureService.sendReminder(credentialId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              const dialogData: DialogData = { 
                title: this.translate.instant("credentialDetail.sendReminderSuccess.title"),
                message: this.translate.instant("credentialDetail.sendReminderSuccess.message"),
                isConfirmDialog: false,
                status: 'default'
              };
              this.dialog.openDialog(dialogData);
            }
          });
        }
      });

  }

}
