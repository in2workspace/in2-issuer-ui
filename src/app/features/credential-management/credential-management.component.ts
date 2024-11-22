import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CredentialProcedure, CredentialProcedureResponse } from 'src/app/core/models/credentialProcedure.interface';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSort } from '@angular/material/sort';

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
  public rol = "";
  public constructor(
    private credentialProcedureService: CredentialProcedureService,
    private authService: AuthService,
    private router: Router
  ) {

  }
  performAction(credential_procedures: any): void {
    // Lógica del botón de acción
    console.log('Acción realizada en:', credential_procedures);
    this.credentialProcedureService.signCredential(credential_procedures.credential_procedure.procedure_id).subscribe({
      next: () => {
        console.log("firma enviada")
      },
      error: () => {
        console.log("firma no enviada")
      }
    });
  }
  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.rol = this.authService.getRol();
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

    if (this.rol === 'local-signer') {
      this.displayedColumns.push('actions');
    }
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
    this.router.navigate(['/organization/credentials/create']);
  }  
  
  public createNewCredential2(): void {
    this.router.navigate(['/organization/credentials/create2',this.rol]);
  }

  public goToCredentialDetails(credential_procedures: CredentialProcedure): void {
    this.router.navigate(['/organization/credentials/details', credential_procedures.credential_procedure?.procedure_id]);
  }
}
