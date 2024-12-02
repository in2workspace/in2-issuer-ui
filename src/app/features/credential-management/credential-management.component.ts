import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSort } from '@angular/material/sort';
import { FormCredentialService } from "../../shared/components/form-credential/services/form-credential.service";
import { CredentialProcedure } from "../../core/models/credentialProcedure.interface";
import { CredentialProcedureResponse } from "../../core/models/credentialProcedureResponse.interface";

@Component({
  selector: 'app-credential-management',
  templateUrl: './credential-management.component.html',
  styleUrls: ['./credential-management.component.scss'],
})
export class CredentialManagementComponent implements AfterViewInit {
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) public sort!: MatSort;
  public displayedColumns: string[] = ['status', 'full_name', 'updated'];
  public dataSource = new MatTableDataSource<CredentialProcedure>();
  public isValidOrganizationIdentifier = false;

  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly authService = inject(AuthService);
  private readonly formCredentialService = inject(FormCredentialService);
  private readonly router = inject(Router);

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isValidOrganizationIdentifier = this.authService.hasIn2OrganizationIdentifier()
    this.loadCredentialData();

    this.dataSource.sortingDataAccessor = (item: CredentialProcedure, property: string) => {
      switch (property) {
        case 'status':
          return item.credential_procedure.status.toLowerCase();
        case 'full_name':
          return item.credential_procedure.full_name.toLowerCase();
        case 'updated':
          return item.credential_procedure.updated.toLowerCase();
        default:
          return '';
      }
    };
  }

  public loadCredentialData(): void {
    this.credentialProcedureService.getCredentialProcedures().subscribe({
      next: (data:CredentialProcedureResponse) => {
        this.dataSource.data = data.credential_procedures;
      },
      error: (error) => {
        console.error('Error fetching credentials', error);
      }
    });
  }

  public createNewCredential(): void {
    console.info("BUTTON createNewCredential pressed!")
    this.formCredentialService.setShowMandator(false);
    this.router.navigate(['/organization/credentials/create2',this.isValidOrganizationIdentifier ? "admin" : ""]);
  }

  public createCredentialAsSigner(): void {
    console.info("BUTTON createCredentialAsSigner pressed!")
    this.formCredentialService.setShowMandator(true);
    this.router.navigate(['/organization/credentials/create2',this.isValidOrganizationIdentifier ? "admin" : ""]);
  }

  public goToCredentialDetails(credential_procedures: CredentialProcedure): void {
    this.router.navigate(['/organization/credentials/details', credential_procedures.credential_procedure?.procedure_id]);
  }
}
