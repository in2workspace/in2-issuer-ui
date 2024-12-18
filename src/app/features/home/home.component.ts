import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [QRCodeModule],
})
export class HomeComponent {
  public walletUrl = environment.wallet_url;
  public knowledgebase_url = environment.knowledgebase_url;

  private readonly router = inject(Router);
  private authService = inject(AuthService);

  public login() {
    console.info('HomeComponent: login button clicked');
    this.authService.login();
  }

  public logout() {
    console.info('HomeComponent: logging out');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  public navigateToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }
}
