import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CloudProvider } from '../models/provider.models'
import {API_PATH} from 'src/app/core/constants/api-paths.constants';
import { environment } from 'src/environments/environment';
@Injectable({ providedIn: 'root' })
export class ProviderRepository {
  private readonly http = inject(HttpClient);
  private readonly configurationUrl = environment.server_url+API_PATH.CLOUD_PROVIDER;



  getAllCloudProvider(): Observable<CloudProvider[]> {
    return this.http.get<CloudProvider[]>(this.configurationUrl);
  }

}
