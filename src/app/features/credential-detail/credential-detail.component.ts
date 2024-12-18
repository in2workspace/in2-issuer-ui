import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, timer } from 'rxjs';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { LEARCredentialEmployeeJwtPayload } from "../../core/models/entity/lear-credential-employee.entity";
import {LearCredentialEmployeeDataDetail} from "../../core/models/dto/lear-credential-employee-data-detail.dto";
import { FormCredentialComponent } from '../../shared/components/form-credential/form-credential.component';
import { NgIf, AsyncPipe } from '@angular/common';

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
    if (this.credentialId) {
      this.credentialProcedureService.sendReminder(this.credentialId).subscribe({
        next: (response: void) => {
          console.info('Reminder sent successfully', response);
        },
        error: (error: void) => {
          console.error('Error sending reminder', error);
        }
      });
    }
  }
}
