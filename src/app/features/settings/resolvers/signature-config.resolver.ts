import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigurationService } from '../services/configuration.service';
import { SignatureConfigurationService } from '../services/signatureConfiguration.service';

@Injectable({ providedIn: 'root' })
export class SignatureConfigResolver implements Resolve<any> {
  private configurationService = inject(ConfigurationService);
  private signatureConfigService = inject(SignatureConfigurationService);

  resolve() {
    return forkJoin({
      config: this.configurationService.getConfiguration().pipe(catchError(() => of(null))),
      credentialList: this.signatureConfigService.getAllConfiguration().pipe(catchError(() => of([])))
    });
  }
}
