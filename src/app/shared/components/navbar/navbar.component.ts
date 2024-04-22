import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Mandator } from 'src/app/core/models/madator.interface';
import { MandatorService } from 'src/app/core/services/mandator.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit{
  public userName: string = 'User Name';
  public companyName: string = '';

  public languages = [
    { code: 'EN', label: 'EN' },
    { code: 'ES', label: 'ES' },
    { code: 'CA', label: 'CA' },
  ];
  public selectedLanguage = 'EN';

  public constructor(
    private authService: AuthService,
    private router: Router,
    private mandatorService: MandatorService
  ) {}
  public ngOnInit() {
    this.loadMandatorData();
  }
  public logout(): void {
    this.authService.logout();
  }

  public changeLanguage(languageCode: string) {
    this.selectedLanguage = languageCode;
  }

  public loadMandatorData(): void {
    this.mandatorService.getMandator().subscribe({
      next: (mandator: Mandator) => {
        this.userName = mandator.name;
        this.companyName = mandator.organization;
      }
    });
  }
}

