import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isLoading$: Observable<boolean>;
  private isLoadingSubj: BehaviorSubject<boolean>;

  private constructor(){
    this.isLoadingSubj = new BehaviorSubject<boolean>(false)
    this.isLoading$ = this.isLoadingSubj.asObservable();
  }
  
    public updateIsLoading(isLoading:boolean){
      this.isLoadingSubj.next(isLoading);
    }
}
