import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'EllipisPipe'
})
export class EllipisPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (!!value && value.length > 15)
      return value.substr(0, 15);
    return value;
  }

}
