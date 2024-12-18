import { Renderer2 } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { ActiveSortColumnDirective } from './active-sort-column.directive';
import { Subject } from 'rxjs';
import { TestBed } from "@angular/core/testing";

describe('ActiveSortColumnDirective', () => {
  let directive: ActiveSortColumnDirective;
  let mockElementRef: ElementRef;
  let mockRenderer: Renderer2;
  let mockMatSort: MatSort;
  let sortChangeSubject: Subject<Sort>;

  beforeEach(() => {
    mockElementRef = { nativeElement: document.createElement('div') };
    mockRenderer = {
      addClass: jest.fn(),
      removeClass: jest.fn(),
    } as unknown as Renderer2;

    sortChangeSubject = new Subject<Sort>();
    mockMatSort = {
      sortChange: sortChangeSubject.asObservable(),
    } as MatSort;

    TestBed.configureTestingModule({
      providers: [
        ActiveSortColumnDirective,
        { provide: Renderer2, useValue: mockRenderer },
        { provide: ElementRef, useValue: mockElementRef },
        { provide: MatSort, useValue: mockMatSort }
      ]
    });
    directive = TestBed.inject(ActiveSortColumnDirective)
    directive.appActiveSortColumn = 'columnName';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add "active-sort-column" class when the sort active column matches', () => {
    directive.ngOnInit();

    sortChangeSubject.next({ active: 'columnName', direction: 'asc' });

    expect(mockRenderer.addClass).toHaveBeenCalledWith(mockElementRef.nativeElement, 'active-sort-column');
    expect(mockRenderer.removeClass).not.toHaveBeenCalled();
  });

  it('should remove "active-sort-column" class when the sort active column does not match', () => {
    directive.ngOnInit();

    sortChangeSubject.next({ active: 'otherColumn', direction: 'asc' });

    expect(mockRenderer.removeClass).toHaveBeenCalledWith(mockElementRef.nativeElement, 'active-sort-column');
    expect(mockRenderer.addClass).not.toHaveBeenCalled();
  });

  it('should unsubscribe from sortChange on destroy', () => {
    directive.ngOnInit();
    const unsubscribeSpy = jest.spyOn(directive['subscription']!, 'unsubscribe');
    directive.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

});
