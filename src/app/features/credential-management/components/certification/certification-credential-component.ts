import { Component, Input } from '@angular/core';
import {VerifiableCertificationJwtPayload} from "../../../../core/models/entity/verifiable-certification.entity";

@Component({
  selector: 'app-certification-credential-component',
  templateUrl: './certification-credential-component.html',
  styleUrls: ['./certification-credential-component.scss'],
})
export class CertificationCredentialComponent {
  @Input() public credential!: VerifiableCertificationJwtPayload;
  @Input() public credentialStatus: string = '';
  @Input() public viewMode: 'detail' | 'create' = 'detail';

  public get issuer() {
    return this.credential?.vc?.issuer;
  }

  public get company() {
    return this.credential?.vc?.credentialSubject?.company;
  }

  public get complianceList() {
    return this.credential?.vc?.credentialSubject?.compliance || [];
  }

  public get product() {
    return this.credential?.vc?.credentialSubject?.product;
  }
}
