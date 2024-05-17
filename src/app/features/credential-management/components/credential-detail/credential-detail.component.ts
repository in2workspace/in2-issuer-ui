import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredentialProcedure } from 'src/app/core/models/credentialProcedure.interface';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';

@Component({
  selector: 'app-credential-detail',
  templateUrl: './credential-detail.component.html',
  styleUrls: ['./credential-detail.component.scss'],
})
export class CredentialDetailComponent implements OnInit {
  public credentialId: string | null = null;
  public credential: CredentialProcedure | null = null;

  public constructor(
    private route: ActivatedRoute,
    private credentialProcedureService: CredentialProcedureService
  ) {}

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
      next: (credentials: CredentialProcedure[]) => {
        this.credential = credentials.length > 0 ? credentials[0] : null;
      },
      error: (error: any) => {
        console.error('Error fetching credential details', error);
      }
    });
  }


  public sendReminder(): void {
    if (this.credentialId) {
      this.credentialProcedureService.sendReminder(this.credentialId).subscribe({
        next: (response: any) => {
          console.log('Reminder sent successfully', response);
        },
        error: (error: any) => {
          console.error('Error sending reminder', error);
        }
      });
    }
  }
}
