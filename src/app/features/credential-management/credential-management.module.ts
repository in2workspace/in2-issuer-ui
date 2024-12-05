import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialManagementComponent } from './credential-management.component';
import { CredentialManagementRoutingModule } from './credential-management-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { CredentialDetailComponent } from './components/credential-detail/credential-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatSortModule } from '@angular/material/sort';
import { ActiveSortColumnDirective } from 'src/app/shared/directives/validators/active-sort-column.directive';

@NgModule({
  declarations: [CredentialManagementComponent, CredentialDetailComponent, ActiveSortColumnDirective],
  imports: [
    CommonModule,
    CredentialManagementRoutingModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    MatSortModule
  ],
  exports: [CredentialManagementComponent, CredentialDetailComponent]
})
export class CredentialManagementModule {}

