import { Injectable } from '@angular/core';

export interface Country {
  name: string;
  phoneCode: string;
  isoCountryCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private readonly countries: Country[] = [
    { name: 'Spain', phoneCode: '34', isoCountryCode: 'ES' },
    { name: 'Germany', phoneCode: '49', isoCountryCode: 'DE' },
    { name: 'France', phoneCode: '33', isoCountryCode: 'FR' },
    { name: 'Italy', phoneCode: '39', isoCountryCode: 'IT' },
    { name: 'United Kingdom', phoneCode: '44', isoCountryCode: 'GB' },
    { name: 'Russia', phoneCode: '7', isoCountryCode: 'RU' },
    { name: 'Ukraine', phoneCode: '380', isoCountryCode: 'UA' },
    { name: 'Poland', phoneCode: '48', isoCountryCode: 'PL' },
    { name: 'Romania', phoneCode: '40', isoCountryCode: 'RO' },
    { name: 'Netherlands', phoneCode: '31', isoCountryCode: 'NL' },
    { name: 'Belgium', phoneCode: '32', isoCountryCode: 'BE' },
    { name: 'Greece', phoneCode: '30', isoCountryCode: 'GR' },
    { name: 'Portugal', phoneCode: '351', isoCountryCode: 'PT' },
    { name: 'Sweden', phoneCode: '46', isoCountryCode: 'SE' },
    { name: 'Norway', phoneCode: '47', isoCountryCode: 'NO' },
    { name: 'Albania', phoneCode: '355', isoCountryCode: 'AL' },
    { name: 'Andorra', phoneCode: '376', isoCountryCode: 'AD' },
    { name: 'Armenia', phoneCode: '374', isoCountryCode: 'AM' },
    { name: 'Austria', phoneCode: '43', isoCountryCode: 'AT' },
    { name: 'Azerbaijan', phoneCode: '994', isoCountryCode: 'AZ' },
    { name: 'Belarus', phoneCode: '375', isoCountryCode: 'BY' },
    { name: 'Bosnia and Herzegovina', phoneCode: '387', isoCountryCode: 'BA' },
    { name: 'Bulgaria', phoneCode: '359', isoCountryCode: 'BG' },
    { name: 'Croatia', phoneCode: '385', isoCountryCode: 'HR' },
    { name: 'Cyprus', phoneCode: '357', isoCountryCode: 'CY' },
    { name: 'Czech Republic', phoneCode: '420', isoCountryCode: 'CZ' },
    { name: 'Denmark', phoneCode: '45', isoCountryCode: 'DK' },
    { name: 'Estonia', phoneCode: '372', isoCountryCode: 'EE' },
    { name: 'Finland', phoneCode: '358', isoCountryCode: 'FI' },
    { name: 'Georgia', phoneCode: '995', isoCountryCode: 'GE' },
    { name: 'Hungary', phoneCode: '36', isoCountryCode: 'HU' },
    { name: 'Iceland', phoneCode: '354', isoCountryCode: 'IS' },
    { name: 'Ireland', phoneCode: '353', isoCountryCode: 'IE' },
    { name: 'Kazakhstan', phoneCode: '7', isoCountryCode: 'KZ' },
    { name: 'Kosovo', phoneCode: '383', isoCountryCode: 'XK' },
    { name: 'Latvia', phoneCode: '371', isoCountryCode: 'LV' },
    { name: 'Liechtenstein', phoneCode: '423', isoCountryCode: 'LI' },
    { name: 'Lithuania', phoneCode: '370', isoCountryCode: 'LT' },
    { name: 'Luxembourg', phoneCode: '352', isoCountryCode: 'LU' },
    { name: 'Malta', phoneCode: '356', isoCountryCode: 'MT' },
    { name: 'Moldova', phoneCode: '373', isoCountryCode: 'MD' },
    { name: 'Monaco', phoneCode: '377', isoCountryCode: 'MC' },
    { name: 'Montenegro', phoneCode: '382', isoCountryCode: 'ME' },
    { name: 'North Macedonia', phoneCode: '389', isoCountryCode: 'MK' },
    { name: 'San Marino', phoneCode: '378', isoCountryCode: 'SM' },
    { name: 'Serbia', phoneCode: '381', isoCountryCode: 'RS' },
    { name: 'Slovakia', phoneCode: '421', isoCountryCode: 'SK' },
    { name: 'Slovenia', phoneCode: '386', isoCountryCode: 'SI' },
    { name: 'Switzerland', phoneCode: '41', isoCountryCode: 'CH' },
    { name: 'Turkey', phoneCode: '90', isoCountryCode: 'TR' },
    { name: 'Vatican City', phoneCode: '379', isoCountryCode: 'VA' }
];


  public getCountries(): Country[] {
    return this.countries;
  }

  public getSortedCountries(): Country[] {
    return [...this.countries].sort((a, b) => a.name.localeCompare(b.name));
  }

  public getCountryFromIsoCode(isoCode: string): Country | undefined {
    return this.countries.find(c => c.isoCountryCode === isoCode);
  }

  public getCountryFromName(name: string): Country | undefined {
    return this.countries.find(c => c.name.toLowerCase() === name.toLowerCase());
  }

  public getCountryNameFromIsoCountryCode(isoCode: string): string {
    const country = this.countries.find(c => c.isoCountryCode === isoCode);
    if(country){
      return country.name;
    }else{
      return '';
    }
  }

  public getCountryPhoneFromIsoCountryCode(isoCode: string): string {
    const country = this.countries.find(c => c.isoCountryCode === isoCode);
    if(country){
      return country.phoneCode;
    }else{
      return '';
    }
  }
}
