import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredentialManagement } from 'src/app/core/models/credentialManagement.interface';
import { CredentialManagementService } from '../../../../core/services/credential-management.service';

@Component({
  selector: 'app-credential-detail',
  templateUrl: './credential-detail.component.html',
  styleUrls: ['./credential-detail.component.scss'],
})
export class CredentialDetailComponent implements OnInit {
  public credentialId: string | null = null;
  public credential: CredentialManagement | null = null;

  public constructor(
    private route: ActivatedRoute,
    private credentialManagementService: CredentialManagementService
  ) {}

  public ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.credentialId = params.get('id');
      if (this.credentialId) {
        this.loadCredentialDetail(this.credentialId);
      }
    });
  }

  public loadCredentialDetail(id: string): void {
    this.credentialManagementService.getCredentialById(id).subscribe({
      next: (credential) => {
        this.credential = credential;
      },
      error: (error) => {
        console.error('Error fetching credential details', error);
      }
    });
  }

  public sendReminder(): void {
    if (this.credentialId) {
      this.credentialManagementService.sendReminder(this.credentialId).subscribe({
        next: (response) => {
          console.log('Reminder sent successfully', response);
        },
        error: (error) => {
          console.error('Error sending reminder', error);
        }
      });
    }
  }
}
