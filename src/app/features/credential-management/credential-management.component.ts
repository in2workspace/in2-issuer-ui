import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CredentialManagement } from 'src/app/core/models/credentialManagement.interface';
import { Router } from '@angular/router';
import { CredentialManagementService } from './services/credential-management.service';

@Component({
  selector: 'app-credential-management',
  templateUrl: './credential-management.component.html',
  styleUrls: ['./credential-management.component.scss'],
})
export class CredentialManagementComponent implements AfterViewInit {
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  public displayedColumns: string[] = ['status', 'name', 'updated'];
  public dataSource = new MatTableDataSource<CredentialManagement>();

  public constructor(
    private credentialManagementService: CredentialManagementService,
    private router: Router
  ) {}

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadCredentialData();
  }

  public loadCredentialData(): void {
    this.credentialManagementService.getCredentials().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Error fetching credentials', error);
      }
    });
  }

  public createNewCredential(): void {
    this.router.navigate(['/credentialIssuance']);
  }

  public goToCredentialDetails(element: CredentialManagement): void {
    this.router.navigate(['/credentialManagement/details', element.id]);
  }
}
