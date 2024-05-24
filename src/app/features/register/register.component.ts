import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // public username!: string;
  // public password!: string;

  // public constructor(private authService: AuthService, private router: Router) {}

  // public register() {
  //   const success = this.authService.register(this.username, this.password);
  //   if (success) {
  //     console.log('Registro exitoso');
  //     this.router.navigate(['/login']);
  //   } else {
  //     console.error('El registro ha fallado. Es posible que el usuario ya exista.');
  //   }
  // }

  // public navigateToLogin() {
  //   this.router.navigate(['/login']);
  // }
}
