import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private AuthenticationService = inject (AuthenticationService);

  public appPages = [
    { title: 'home', url: '/home', icon: 'home' },
    { title: 'user-info', url: '/user-info', icon: 'user'},
    { title: 'logout', url: '/login', icon: 'log-out'},
  ];
  constructor() {}
}
