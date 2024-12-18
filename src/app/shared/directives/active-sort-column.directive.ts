import { Directive, ElementRef, inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';

//this directive must be applied with MatSort
//it reacts to MatSort "sort state" to mark the selected column with class "active-sort-column"

@Directive({
    selector: '[appActiveSortColumn]',
    standalone: true,
})

export class ActiveSortColumnDirective implements OnInit, OnDestroy {
  @Input() public appActiveSortColumn: string = ''; //name of column to be marked with class "active-sort-column"
  private subscription: Subscription | undefined;

  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly matSort = inject(MatSort);

  public ngOnInit(): void {
    this.subscription = this.matSort.sortChange.subscribe((sort: Sort) => {
      this.updateStyle(sort);
    });
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateStyle(sort: Sort): void {
    if (sort.active === this.appActiveSortColumn) {
      this.renderer.addClass(this.elementRef.nativeElement, 'active-sort-column');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'active-sort-column');
    }
  }
}
