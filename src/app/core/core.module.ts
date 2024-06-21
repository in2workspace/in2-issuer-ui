import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class CoreModule {
  public static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [AuthService],
    };
  }
}
