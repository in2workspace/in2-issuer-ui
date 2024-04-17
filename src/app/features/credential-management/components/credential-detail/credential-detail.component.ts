import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-credential-detail',
  templateUrl: './credential-detail.component.html',
  styleUrls: ['./credential-detail.component.scss'],
})
export class CredentialDetailComponent implements OnInit {
  public credentialId: string | null = null;

  public constructor(private route: ActivatedRoute) {}

  public ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.credentialId = params.get('id');
    });
  }
}
