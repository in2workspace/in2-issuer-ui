import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addPrefix',
  standalone: true
})
export class AddPrefixPipe implements PipeTransform {

  public transform(value: string, prefix: string): string {
    return prefix + value;
  }

}
