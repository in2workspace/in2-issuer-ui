import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true
})
export class CapitalizePipe implements PipeTransform {

  public transform(value: string): string {
    if (!value) return '';
    return value[0].toUpperCase() + value.slice(1).toLowerCase();
  }

}
