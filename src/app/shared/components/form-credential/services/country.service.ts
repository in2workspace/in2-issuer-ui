import { Injectable } from '@angular/core';

export interface Country {
  name: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private countries: Country[] = [
    { name: 'Spain', code: '34' },
    { name: 'Germany', code: '49' },
    { name: 'France', code: '33' },
    { name: 'Italy', code: '39' },
    { name: 'United Kingdom', code: '44' },
    { name: 'Russia', code: '7' },
    { name: 'Ukraine', code: '380' },
    { name: 'Poland', code: '48' },
    { name: 'Romania', code: '40' },
    { name: 'Netherlands', code: '31' },
    { name: 'Belgium', code: '32' },
    { name: 'Greece', code: '30' },
    { name: 'Portugal', code: '351' },
    { name: 'Sweden', code: '46' },
    { name: 'Norway', code: '47' },
    { name: 'Albania', code: '355' },
    { name: 'Andorra', code: '376' },
    { name: 'Armenia', code: '374' },
    { name: 'Austria', code: '43' },
    { name: 'Azerbaijan', code: '994' },
    { name: 'Belarus', code: '375' },
    { name: 'Bosnia and Herzegovina', code: '387' },
    { name: 'Bulgaria', code: '359' },
    { name: 'Croatia', code: '385' },
    { name: 'Cyprus', code: '357' },
    { name: 'Czech Republic', code: '420' },
    { name: 'Denmark', code: '45' },
    { name: 'Estonia', code: '372' },
    { name: 'Finland', code: '358' },
    { name: 'Georgia', code: '995' },
    { name: 'Hungary', code: '36' },
    { name: 'Iceland', code: '354' },
    { name: 'Ireland', code: '353' },
    { name: 'Kazakhstan', code: '7' },
    { name: 'Kosovo', code: '383' },
    { name: 'Latvia', code: '371' },
    { name: 'Liechtenstein', code: '423' },
    { name: 'Lithuania', code: '370' },
    { name: 'Luxembourg', code: '352' },
    { name: 'Malta', code: '356' },
    { name: 'Moldova', code: '373' },
    { name: 'Monaco', code: '377' },
    { name: 'Montenegro', code: '382' },
    { name: 'North Macedonia', code: '389' },
    { name: 'San Marino', code: '378' },
    { name: 'Serbia', code: '381' },
    { name: 'Slovakia', code: '421' },
    { name: 'Slovenia', code: '386' },
    { name: 'Switzerland', code: '41' },
    { name: 'Turkey', code: '90' },
    { name: 'Vatican City', code: '379' }
  ];

  public getCountries(): Country[] {
    return this.countries;
  }
}
