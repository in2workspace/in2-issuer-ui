import { TestBed } from '@angular/core/testing';
import { CountryService, Country } from './country.service';

describe('CountryService', () => {
  let service: CountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the list of countries', () => {
    const countries: Country[] = [
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
      { name: 'Norway', code: '47' }
    ];

    expect(service.getCountries()).toEqual(countries);
  });
});
