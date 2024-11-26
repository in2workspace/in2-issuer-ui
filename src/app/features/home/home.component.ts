import {Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public walletUrl = environment.wallet_url;
  public knowledgebase_url = environment.knowledgebase_url;
  private dialog = inject(MatDialog);

  public constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.dialog.open(DialogComponent, {
      panelClass: 'custom-dialog-error'
    }).afterClosed().subscribe(() => {
      console.log("Closed");
    });
  }

  public login() {
    console.log('HomeComponent: login button clicked');
    this.authService.login();
  }

  public logout() {
    console.log('HomeComponent: logging out');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  public navigateToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }
}
