import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { CredentialData, LEARCredential } from "../../../../core/models/vc/learCredential.interface";

@Component({
  selector: 'app-credential-detail',
  templateUrl: './credential-detail.component.html',
})
export class CredentialDetailComponent implements OnInit {
  public credentialId: string | null = null;
  public credential: LEARCredential | null = null;
  public credentialStatus: string | null = null;

  private readonly route = inject(ActivatedRoute);
  private readonly credentialProcedureService = inject(CredentialProcedureService);

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
      next: (credentials: CredentialData) => {
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
          console.log('Reminder sent successfully', response);
        },
        error: (error: void) => {
          console.error('Error sending reminder', error);
        }
      });
    }
  }
}
