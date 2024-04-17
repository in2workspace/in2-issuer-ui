import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CredentialManagement } from 'src/app/core/models/credentialManagement.interface';
import { Router } from '@angular/router';

const ELEMENT_DATA: CredentialManagement[] = [
  { id: '1', status: 'issued', name: 'Matt Smith', issuanceDate: '23/04/2024' },
  { id: '2', status: 'issued', name: 'Tom Baker', issuanceDate: '22/05/2021' },
  { id: '3', status: 'issued', name: 'Pepe Perez', issuanceDate: '09/07/2022' },
  {
    id: '4',
    status: 'issued',
    name: 'Isaiah Smith',
    issuanceDate: '12/04/2024',
  },
  {
    id: '5',
    status: 'issued',
    name: 'Naruto Uchiha',
    issuanceDate: '01/04/2024',
  },
  { id: '6', status: 'issued', name: 'Lisa Symon', issuanceDate: '02/04/2024' },
  {
    id: '7',
    status: 'issued',
    name: 'Shasuke Uchiha',
    issuanceDate: '05/04/2023',
  },
  {
    id: '8',
    status: 'issued',
    name: 'Carlos Guzman',
    issuanceDate: '11/09/2024',
  },
];

@Component({
  selector: 'app-credential-management',
  templateUrl: './credential-management.component.html',
  styleUrls: ['./credential-management.component.scss'],
})
export class CredentialManagementComponent implements AfterViewInit {
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  public displayedColumns: string[] = ['status', 'name', 'issuanceDate'];
  public dataSource = new MatTableDataSource<CredentialManagement>(
    ELEMENT_DATA
  );

  public constructor(private router: Router) {}

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  public createNewCredential() {
    this.router.navigate(['/credentialIssuance']);
  }
  public goToCredentialDetails(element: CredentialManagement) {
    this.router.navigate(['/credentialManagement/details', element.id]);
  }
}
