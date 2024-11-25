import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { MatDialogModule } from '@angular/material/dialog';
import {DialogComponent} from "./dialog/dialog.component";

@NgModule({
  declarations: [DialogComponent],
  imports: [CommonModule,MatDialogModule],
})
export class CoreModule {
  public static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [AuthService],
    };
  }
}
