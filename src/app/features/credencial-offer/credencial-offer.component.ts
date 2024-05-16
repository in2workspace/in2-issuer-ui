import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredentialManagement } from 'src/app/core/models/credentialManagement.interface';
import { CredentialManagementService } from '../../core/services/credential-management.service';

@Component({
  selector: 'app-credencial-offer',
  templateUrl: './credencial-offer.component.html',
  styleUrls: ['./credencial-offer.component.scss']
})
export class CredencialOfferComponent implements OnInit {
  public credentialId: string | null = null;
  public credential: CredentialManagement | null = null;

  public constructor(
    private credentialManagementService: CredentialManagementService,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.credentialId = params.get('id');
      if (this.credentialId) {
        this.loadCredential(this.credentialId);
      } else {
        this.loadFirstAvailableCredential();
      }
    });
  }

  public loadCredential(id: string): void {
    this.credentialManagementService.getCredentialById(id).subscribe({
      next: (credential) => {
        this.credential = credential;
      },
      error: (error) => {
        console.error('Error fetching credential details', error);
      }
    });
  }

  public loadFirstAvailableCredential(): void {
    this.credentialManagementService.getCredentials().subscribe(credentials => {
      if (credentials && credentials.length > 0) {
        this.credentialId = credentials[0].id;
        this.loadCredential(this.credentialId);
      } else {
        console.error('Error fetching credential details');
      }
    });
  }
}
