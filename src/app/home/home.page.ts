import { Component } from '@angular/core';
//import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import {IonicModule, PopoverController} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { UserData } from '../interfaces/userData.interface';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { IssuerService } from '../services/issuer.service';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule],
})
export class HomePage {
  userData: UserData = {
    name: 'John',
    surname: 'Doe',
    idDoc: '12345',
    job: 'Developer'
  }
  public userDataTextAreaValue: string ="";
  public qrdata : string = "";
  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private issuerService: IssuerService,
    private navCtrl: NavController) {
    this.userDataTextAreaValue = this.getUserDataString();
  }

  updateUserData() {
    console.log(this.userDataTextAreaValue);
  }

  generateQR() {
    this.issuerService.credentialOffer().subscribe(data=>{
      this.qrdata=data;
    })
  }

  getUserDataString() {
    return JSON.stringify(this.userData, null, 2);
  }

  saveInfo() {
    window.location.href = (environment.wallet_url + '/' + this.qrdata);
  }

  navigateToPage(page: string) {
    switch (page) {
      case 'user-info':
        this.navCtrl.navigateRoot('/user-info');
        break;
    }
  }

  logout() {
    this.authenticationService.logout().subscribe(() => {
      this.router.navigate(['/'], {})
    });
  }

}
