import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CredentialProcedure, CredentialProcedureResponse } from 'src/app/core/models/credentialProcedure.interface';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-credential-management',
  templateUrl: './credential-management.component.html',
  styleUrls: ['./credential-management.component.scss'],
})
export class CredentialManagementComponent implements AfterViewInit {
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  public displayedColumns: string[] = ['status', 'full_name', 'updated'];
  public dataSource = new MatTableDataSource<CredentialProcedure>();
  public rol = "";
  public constructor(
    private credentialProcedureService: CredentialProcedureService,
    private authService: AuthService,
    private router: Router
  ) {

  }
  performAction(element: any): void {
    // Lógica del botón de acción
    console.log('Acción realizada en:', element);
    this.credentialProcedureService.signCredential(element.credential_procedure.procedure_id).subscribe({
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
    this.rol= this.authService.getRol();
    this.loadCredentialData();
    if (this.rol === 'admin') {
      this.displayedColumns.push('actions');
    }
  }

  public loadCredentialData(): void {
    this.credentialProcedureService.getCredentialProcedures().subscribe({
      next: (data:CredentialProcedureResponse) => {
        console.log(data)
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

  public goToCredentialDetails(element: CredentialProcedure): void {
    this.router.navigate(['/organization/credentials/details', element.credential_procedure?.procedure_id]);
  }
}
