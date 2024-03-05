import { Component } from '@angular/core';
//import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import {IonicModule, PopoverController} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { UserData } from '../interfaces/userData.interface';

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
  constructor() {
    this.userDataTextAreaValue = this.getUserDataString();
  }

  updateUserData() {
    console.log(this.userDataTextAreaValue);
  }

  generateQR() {

  }

  getUserDataString() {
    return JSON.stringify(this.userData, null, 2);
  }

  saveInfo() {
    
  }
}
