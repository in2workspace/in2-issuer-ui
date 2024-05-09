import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-info',
    templateUrl: 'info.page.html',
    styleUrls: ['info.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule],
  })

export class InfoPage {
    fullName: string = '';
    username: string = '';
    givenName: string = '';
    familyName: string = '';
    email: string = '';
    constructor(private authenticationService: AuthenticationService,
        private navCtrl: NavController) {}

    ngOnInit() {
        console.log(this.authenticationService.getFullName());
        this.fullName = this.authenticationService.getFullName();
        this.username = this.authenticationService.getUsername();
        this.givenName = this.authenticationService.getGivenName();
        this.familyName = this.authenticationService.getFamilyName();
        this.email = this.authenticationService.getEmail();
    }

    navigateToPage(page: string) {
        switch (page) {
          case 'home':
            this.navCtrl.navigateRoot('/');
            break;
        }
      }

    logout(){}
}