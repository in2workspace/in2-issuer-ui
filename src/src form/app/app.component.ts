import { Component } from '@angular/core';
import { PowersComponent } from "./components/powers/powers.component";
import { CredentialFormComponent } from "./components/credential-form/credential-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PowersComponent, CredentialFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'provaForm';
}
