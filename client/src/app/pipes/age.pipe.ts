import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  // CNP format: X-YYMMDD-XXXXXX
  transform(cnp: string): number {
    let year = parseInt(cnp.substring(1, 3));
    let month = parseInt(cnp.substring(3, 5)) - 1;
    let day = parseInt(cnp.substring(5, 7));

    const today = new Date();
    if(year <= today.getFullYear() % 100)
      year += 2000;
    else
      year += 1900;

    const birthday = new Date(year, month, day);

    return new Date(today.getTime() - birthday.getTime()).getFullYear() - 1970;
  }

}
