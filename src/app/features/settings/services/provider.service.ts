import { Injectable, inject } from '@angular/core';
import {CloudProvider} from '../models/provider.models';
import {  map, Observable } from 'rxjs';
import {ProviderRepository} from './provider.repository';
@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private readonly repository= inject(ProviderRepository);
  getAllProvider(): Observable<CloudProvider[]> {
    return this.repository.getAllCloudProvider().pipe(
      map((providers: CloudProvider[]) => {
        if (!providers || providers.length === 0) {
          throw new Error('No provider found');
        }
        return providers;
      })
    );
  }
  

}
