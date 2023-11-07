import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tax'
})
export class TaxPipe implements PipeTransform {

  transform(cylinder_capacity: number): number {
    if(cylinder_capacity < 1500)
      return 50;
    else if(cylinder_capacity >= 1500 && cylinder_capacity < 2000)
      return 100;
    else
      return 200;
  }

}
